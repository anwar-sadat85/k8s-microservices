// src/lib/user-service.ts
export interface UserProfile {
  sub: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  preferredTime: string | null;
  remindersOptIn: boolean;
  createdAt: string;
}

export async function getUserProfile(token: string): Promise<UserProfile | null> {
  const res = await fetch(`${process.env.USER_SERVICE_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`user-service GET /users/me failed: ${res.status}`);
  return res.json();
}
