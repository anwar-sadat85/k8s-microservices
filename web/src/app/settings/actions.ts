"use server";
import { revalidatePath } from "next/cache";
import { auth0 } from "@/lib/auth0";

export interface UpdateProfileState {
  success: boolean;
  error?: string;
}

export async function updateProfile(
  _prev: UpdateProfileState,
  formData: FormData,
): Promise<UpdateProfileState> {
  const { token } = await auth0.getAccessToken();
  const body = {
    firstName: formData.get("firstName")?.toString() || undefined,
    lastName: formData.get("lastName")?.toString() || undefined,
    preferredTime: formData.get("preferredTime")?.toString() || undefined,
    remindersOptIn: formData.get("remindersOptIn") === "on",
  };

  const res = await fetch(`${process.env.USER_SERVICE_URL}/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    return { success: false, error: `Save failed (${res.status})` };
  }

  revalidatePath("/settings");
  revalidatePath("/");
  return { success: true };
}
