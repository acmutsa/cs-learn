import React from 'react'
import SignIn from '@/components/auth/signin'
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  // const session = await auth.api.getSession({
  //   headers: await headers()
  // })
  // if (session){
  //   redirect("/home");
  // }
  return (
    <div className="flex justify-center items-center min-h-screen bg-background dark">
      <SignIn />
    </div>
  )
}