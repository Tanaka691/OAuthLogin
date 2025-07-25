import Link from 'next/link';

export default function Page() {
  return (
    <Link href="/test">
      <button>Go to Target Page</button>
    </Link>
  );
}