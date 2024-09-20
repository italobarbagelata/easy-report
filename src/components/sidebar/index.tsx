"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "../global/mode-toggle";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BarChartIcon,
  SettingsIcon,
  HelpCircleIcon,
  LogOutIcon,
  LayersIcon,
  FileTextIcon,
} from "lucide-react";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch } from "react-redux";
import { supabase } from "@/supabase/client";

const MenuOptions = () => {
  const pathName = usePathname();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.users);

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-background">
      <div className="flex h-[65px] items-center border-b">
        <img src="/logo.png" alt="logo" className="h-10 w-18 ml-4 mr-6" />
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-2 p-4">
          <div>
            <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
              Overview
            </h2>
            <div className="space-y-1">
              <Button
                variant={pathName === "/dashboard" ? "secondary" : "ghost"}
                className="w-full justify-start gap-2"
                onClick={() => router.push("/dashboard")}
              >
                <BarChartIcon className="h-4 w-4" />
                Analytics
              </Button>
            </div>
          </div>
          <Separator className="my-2" />
          <div>
            <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
              Inspection
            </h2>
            <div className="space-y-1">
              <Button
                variant={pathName === "/inspection" ? "secondary" : "ghost"}
                className="w-full justify-start gap-2"
                onClick={() => router.push("/inspection")}
              >
                <LayersIcon className="h-4 w-4" />
                All
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <FileTextIcon className="h-4 w-4" />
                Today
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <FileTextIcon className="h-4 w-4" />
                Last 7 days
              </Button>
            </div>
          </div>
          <Separator className="my-2" />
          <div>
            <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
              Settings
            </h2>
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <SettingsIcon className="h-4 w-4" />
                General
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <HelpCircleIcon className="h-4 w-4" />
                Help & Support
              </Button>
            </div>
          </div>
        </nav>
      </ScrollArea>
      <Separator />
      <div className="p-4">
        <div className="flex items-center gap-4 justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {user.email?.split("@")[0]}
            </span>
            <span className="text-xs text-muted-foreground">{user?.email}</span>
          </div>
          <ModeToggle />
        </div>
        <Button
          variant="ghost"
          className="mt-4 w-full justify-start gap-2"
          onClick={() => {
            supabase.auth.signOut();
            router.push("/login");
          }}
        >
          <LogOutIcon className="h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  );
};

export default MenuOptions;
