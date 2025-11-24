"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const router = useRouter();
    const handleLogout = async () => {
      await authClient.signOut();
      router.push("/sign-in");
      router.refresh();
    };
    
    return (
      <Button
        onClick={handleLogout}
        className="text-lg px-4 py-2 border border-border"
      >
        Logout
      </Button>
    );
  }
