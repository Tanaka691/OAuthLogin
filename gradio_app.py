# -*- coding: utf-8 -*-
import gradio as gr

def increment_counter(current_count):
    """カウンターを1増加させる"""
    return current_count + 1

def reset_counter():
    """カウンターを0にリセットする"""
    return 0

def decrement_counter(current_count):
    """カウンターを1減少させる（0以下にはならない）"""
    return max(0, current_count - 1)

# Gradioアプリケーションの作成
with gr.Blocks(
    title="🎉 認証済みカウンターアプリ",
    theme=gr.themes.Soft(),
    css="""
    .gradio-container {
        max-width: 800px !important;
        margin: auto !important;
    }
    """
) as demo:
    # ヘッダー
    gr.Markdown("""
    # 🎉 ログイン成功！カウンターアプリ
    
    NextAuthで認証されたユーザー専用のGradioアプリです。
    """)
    
    # カウンター表示
    count_display = gr.Number(
        value=0, 
        label="📊 現在のカウント", 
        interactive=False,
        container=True
    )
    
    # ボタングループ
    with gr.Row():
        increment_btn = gr.Button("➕ +1", variant="primary", size="lg")
        decrement_btn = gr.Button("➖ -1", variant="secondary", size="lg")
        reset_btn = gr.Button("🔄 リセット", variant="stop", size="lg")
    
    # 統計情報
    with gr.Row():
        with gr.Column():
            total_clicks = gr.Number(
                value=0, 
                label="総クリック数", 
                interactive=False
            )
    
    # イベントハンドラー
    increment_btn.click(
        fn=increment_counter,
        inputs=count_display,
        outputs=count_display
    )
    
    decrement_btn.click(
        fn=decrement_counter,
        inputs=count_display,
        outputs=count_display
    )
    
    reset_btn.click(
        fn=reset_counter,
        outputs=count_display
    )
    
    # フッター
    gr.Markdown("""
    ---
    💡 **使い方**: 
    - ➕ボタンでカウントを増加
    - ➖ボタンでカウントを減少
    - 🔄ボタンでリセット
    """)

if __name__ == "__main__":
    print("Starting Gradio application...")
    print("Authenticated users only")
    
    demo.launch(
        server_port=7860,
        share=False,
        server_name="127.0.0.1",
        prevent_thread_lock=True,  # メインスレッドをブロックしない
        show_error=True,
        quiet=False  # 起動メッセージを表示
    )
    
    print("* Running on local URL:  http://127.0.0.1:7860")
    
    # プロセスが生きていることを確認するためのループ
    import time
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("Shutting down...")
