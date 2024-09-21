'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const isLocal = process.env.NEXT_PUBLIC_HOST === 'local';

  useEffect(() => {
    const redirectUrl = isLocal ? '/home' : '/home.html';
    router.push(redirectUrl);
  }, [router, isLocal]);

  return null;
}
