// src/app/protected/page.tsx
import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const session = await auth0.getSession();
  if (!session) {
    redirect("/auth/login");
  }
  return (
    <div>
      <h1>Protected content</h1>
      <p>Welcome, {session.user.name}</p>
    </div>
  );
}