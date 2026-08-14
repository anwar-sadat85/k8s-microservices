import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth0";
import { getUserProfile } from "@/lib/user-service";
import { ProfileNotReady } from "@/components/ProfileNotReady";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const session = await auth0.getSession();
  if (!session) redirect("/auth/login");

  const { token } = await auth0.getAccessToken();
  const profile = await getUserProfile(token);
  if (!profile) {
    return (
      <div className="px-8 py-16">
        <ProfileNotReady refreshHref="/settings" />
      </div>
    );
  }

  return (
    <div className="px-8 py-16">
      <SettingsForm initialProfile={profile} />
    </div>
  );
}
