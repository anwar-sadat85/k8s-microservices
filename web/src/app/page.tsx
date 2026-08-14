import { auth0 } from "@/lib/auth0";
import { getUserProfile } from "@/lib/user-service";
import { ProfileNotReady } from "@/components/ProfileNotReady";

export default async function Home() {
  const session = await auth0.getSession();
  if (!session) {
    return (
      <div className="mx-auto max-w-lg px-8 py-16 text-center">
        <h1 className="font-display text-3xl text-foreground">Task Reminder</h1>
        <p className="mt-3 font-sans text-muted">Log in to get started.</p>
      </div>
    );
  }

  const { token } = await auth0.getAccessToken();
  const profile = await getUserProfile(token);
  if (!profile) {
    return (
      <div className="px-8 py-16">
        <ProfileNotReady />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-8 py-16">
      <h1 className="font-display text-2xl text-foreground">
        Welcome{profile.firstName ? `, ${profile.firstName}` : ""}
      </h1>
      <a href="/settings" className="mt-4 inline-block text-sm text-accent hover:underline">
        Settings
      </a>
    </div>
  );
}
