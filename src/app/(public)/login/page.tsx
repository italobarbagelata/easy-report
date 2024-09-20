"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/supabase/client";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { ModeToggle } from "@/components/global/mode-toggle";
import Link from "next/link";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const checkAuthState = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      } else {
        router.push("/dashboard");
      }
    };

    checkAuthState();
  }, [router]);

  const handleLogin = async (e: any) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error signing in:", error);
      setErrorMsg(error.message);
    } else {
      console.log("Signed in as:", data.user.email);
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-zinc-900 dark:to-zinc-950">
      <Card className="mx-auto w-[400px]">
        <form onSubmit={handleLogin}>
          <CardHeader>
            <div className="flex justify-end">
              <img src="/logo.png" alt="logo" className="h-[100px] w-[150px]" />
            </div>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              {errorMsg && (
                <p className="text-sm text-red-500 mt-2">{errorMsg}</p>
              )}
              <Button type="submit" className="w-full">
                Login
              </Button>
              <div className="flex items-center mt-4 text-center w-full justify-between">
                <p className="text-sm text-muted-foreground">
                  change your theme
                </p>
                <ModeToggle />
              </div>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
};

export default LoginForm;
