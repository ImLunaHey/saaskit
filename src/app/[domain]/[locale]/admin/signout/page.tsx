'use client';
import { useEffect } from 'react';
import { signout } from './action';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  useEffect(() => {
    void signout();
  }, [router]);
}
