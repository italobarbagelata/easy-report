'use client'
import { useEffect } from 'react';
import { supabase } from "@/supabase/client";
import Loading from '@/components/loading';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuthState = async () => {
      const session = supabase.auth.getSession();

      if (await session) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    };

    checkAuthState();
  }, [router]);

  return (
    <main aria-busy="true">
      <Loading />
    </main>
  );
}