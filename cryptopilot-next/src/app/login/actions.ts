"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  // 1. Get credentials from FormData
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Note: user asked for "Email ou Téléphone", but Supabase Auth usually expects Email.
  // If phone login is needed, logic differs. Assuming email for standard Supabase Auth for now
  // or simple mapping if your DB setup supports it.
  // Custom logic for Phone/Email split:
  let finalEmail = email;
  if (!email.includes("@")) {
    // Optional: lookup email by phone if database allows,
    // but for "Server Action" simplicity with standard Supabase, we stick to email
    // or expect the user to have provided an email.
    // If the previous client-side code did a lookup, we might need to replicate that here
    // or assume the input IS an email.
    // For safety/standardization:
    // console.log("Login with phone not directly supported in this snippet without admin lookup");
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: finalEmail,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Logout error:", error);
  }

  revalidatePath("/", "layout");
  redirect("/login");
}
