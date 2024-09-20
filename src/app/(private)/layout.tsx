'use client';
import React from 'react'
import Sidebar from '@/components/sidebar'
import { useEffect, useState } from "react";
import { supabase } from "@/supabase/client";
import Loading from "@/components/loading";
import { useRouter } from "next/navigation";
import { fetchUsersSuccess } from "@/store/user/actions";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
type Props = { children: React.ReactNode }

const Layout = (props: Props) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const validateUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { id, aud, role, email } = user;
        dispatch(fetchUsersSuccess({ id, aud, role, email }));
      } else {
        router.push('/login');
      }
      setLoading(false);
    };

    validateUser();
  }, [dispatch, router]);
  return (
    <div className="flex overflow-hidden h-screen">
      <Sidebar />
      <div className="w-full">
        {props.children}
      </div>
    </div>
  )
}

export default Layout