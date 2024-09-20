"use client";
import { useEffect } from "react";
import { supabase } from "@/supabase/client";
import Loading from "@/components/loading";
import { useRouter } from "next/navigation";
import { fetchUsers, fetchUsersSuccess } from "@/store/user/actions";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";

export default function Home() {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { id, aud, role, email } = user;
        dispatch(fetchUsersSuccess({ id, aud, role, email }));
        router.push("/inspection");
      } else {
        router.push("/login"); // Redirigir si no hay usuario
      }
    };

    fetchUserData();
  }, [dispatch, router]);

  return (
    <main aria-busy="true">
      <Loading />
    </main>
  );
}
