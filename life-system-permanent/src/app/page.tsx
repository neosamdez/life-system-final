import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Life System</h1>
      <div className="flex gap-4">
        <Link href="/auth/login" className="px-4 py-2 bg-blue-600 text-white rounded">Login</Link>
        <Link href="/auth/register" className="px-4 py-2 bg-green-600 text-white rounded">Register</Link>
      </div>
    </main>
  );
}
