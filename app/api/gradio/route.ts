import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

let gradioProcess: any = null;
let isGradioRunning = false;

export async function GET(request: NextRequest) {
  try {
    console.log('Gradio API: Starting Gradio server');
    
    // Gradioが既に起動している場合
    if (isGradioRunning && gradioProcess) {
      console.log('Gradio API: Server already running');
      return NextResponse.json({ 
        status: 'running', 
        message: 'Gradio server is already running',
        url: 'http://localhost:7860'
      });
    }

    // Gradioサーバーを起動
    const gradioAppPath = path.join(process.cwd(), 'gradio_app.py');
    console.log('Gradio API: Launching process at', gradioAppPath);
    
    // Pythonが利用可能かチェック
    try {
      const { execSync } = require('child_process');
      execSync('python --version', { encoding: 'utf8' });
      console.log('Gradio API: Python is available');
    } catch (error) {
      console.error('Gradio API: Python not found');
      return NextResponse.json({ 
        status: 'error', 
        message: 'Python not found on system',
        error: 'Python executable not available'
      }, { status: 500 });
    }
    
    gradioProcess = spawn('python', [gradioAppPath], {
      cwd: process.cwd(),
      stdio: ['ignore', 'pipe', 'pipe'],
      env: {
        ...process.env,
        PYTHONIOENCODING: 'utf-8',
        PYTHONUTF8: '1'
      }
    });

    // プロセスの出力を監視
    gradioProcess.stdout?.on('data', (data: Buffer) => {
      const output = data.toString();
      console.log(`Gradio: ${output.trim()}`);
      // Gradioが起動完了したかチェック（より確実な検出）
      if (output.includes('Running on local URL:') && output.includes('127.0.0.1:7860')) {
        console.log('Gradio API: Server is ready');
        isGradioRunning = true;
      }
      // またはUvicornサーバーの起動メッセージをチェック
      if (output.includes('Uvicorn running on')) {
        console.log('Gradio API: Uvicorn server is ready');
        isGradioRunning = true;
      }
    });

    gradioProcess.stderr?.on('data', (data: Buffer) => {
      const error = data.toString();
      console.error(`Gradio Error: ${error.trim()}`);
      // 重要なエラーの場合は状態をリセット
      if (error.includes('Error') || error.includes('failed')) {
        console.error('Gradio API: Critical error detected');
        isGradioRunning = false;
        gradioProcess = null;
      }
    });

    gradioProcess.on('close', (code: number) => {
      console.log(`Gradio API: Process exited with code ${code}`);
      isGradioRunning = false;
      gradioProcess = null;
    });

    gradioProcess.on('error', (error: Error) => {
      console.error('Gradio API: Failed to start process:', error.message);
      isGradioRunning = false;
      gradioProcess = null;
    });

    // 起動完了の確認とタイムアウト処理
    return new Promise((resolve) => {
      let timeoutId: NodeJS.Timeout;
      let resolved = false;
      
      const checkStartup = () => {
        if (resolved) return;
        
        if (isGradioRunning) {
          resolved = true;
          clearTimeout(timeoutId);
          resolve(NextResponse.json({ 
            status: 'running', 
            message: 'Gradio server is running',
            url: 'http://localhost:7860'
          }));
        }
      };
      
      // 出力監視でチェック
      const originalStdoutHandler = gradioProcess.stdout?.listeners('data')[0];
      gradioProcess.stdout?.on('data', checkStartup);
      
      // 5秒でタイムアウト（早めのフィードバック）
      timeoutId = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          console.log('Gradio API: Checking server status after timeout');
          
          // ポート7860をチェックして実際に起動しているか確認
          const net = require('net');
          const socket = new net.Socket();
          
          socket.setTimeout(1000);
          socket.on('connect', () => {
            console.log('Gradio API: Port 7860 is accessible');
            isGradioRunning = true;
            socket.destroy();
            resolve(NextResponse.json({ 
              status: 'running', 
              message: 'Gradio server is running',
              url: 'http://localhost:7860'
            }));
          });
          
          socket.on('error', () => {
            console.log('Gradio API: Port 7860 not yet accessible');
            socket.destroy();
            resolve(NextResponse.json({ 
              status: 'starting', 
              message: 'Gradio server is starting... (please wait)',
              url: 'http://localhost:7860'
            }));
          });
          
          socket.connect(7860, '127.0.0.1');
        }
      }, 5000);
      
      // 初期チェック
      setTimeout(checkStartup, 1000);
    });

  } catch (error) {
    console.error('Gradio API: Unexpected error:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: 'Failed to start Gradio server',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('Gradio API: Stopping server');
    if (gradioProcess) {
      gradioProcess.kill('SIGTERM');
      gradioProcess = null;
      isGradioRunning = false;
      return NextResponse.json({ 
        status: 'stopped', 
        message: 'Gradio server stopped' 
      });
    }
    
    return NextResponse.json({ 
      status: 'not_running', 
      message: 'Gradio server was not running' 
    });
  } catch (error) {
    console.error('Gradio API: Error stopping server:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: 'Failed to stop Gradio server' 
    }, { status: 500 });
  }
}
