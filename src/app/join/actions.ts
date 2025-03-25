"use server";

import { createClient } from '@/lib/supabase/server'
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
import {AUTH_REDIRECT} from "@/lib/constants";

export async function signup(formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const credentials = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data, error } = await supabase.auth.signUp(credentials)

  if (error || !data?.user) {
    redirect('/error')
  }

  const user = data.user;
  const userResponse = await supabase
    .from("users")
    .insert({
      id: user.id,
    })

  revalidatePath(AUTH_REDIRECT, 'layout')
  redirect(AUTH_REDIRECT)
}
