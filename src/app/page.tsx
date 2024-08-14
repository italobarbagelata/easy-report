"use client";
import { useEffect } from "react";
import { supabase } from "@/supabase/client";
import Loading from "@/components/loading";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const checkAuthState = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
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
