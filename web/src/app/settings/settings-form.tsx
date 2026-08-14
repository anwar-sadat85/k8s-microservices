"use client";
import { useActionState } from "react";
import { updateProfile, type UpdateProfileState } from "./actions";
import type { UserProfile } from "@/lib/user-service";

export function SettingsForm({ initialProfile }: { initialProfile: UserProfile }) {
  const [state, formAction, pending] = useActionState<UpdateProfileState, FormData>(
    updateProfile,
    { success: false },
  );

  return (
    <form action={formAction} className="mx-auto max-w-md space-y-4 rounded-lg bg-surface p-6">
      <label className="block text-sm text-muted">
        First name
        <input
          name="firstName"
          defaultValue={initialProfile.firstName ?? ""}
          className="mt-1 w-full rounded-md border border-muted bg-background px-3 py-1.5 text-foreground"
        />
      </label>
      <label className="block text-sm text-muted">
        Last name
        <input
          name="lastName"
          defaultValue={initialProfile.lastName ?? ""}
          className="mt-1 w-full rounded-md border border-muted bg-background px-3 py-1.5 text-foreground"
        />
      </label>
      <label className="block text-sm text-muted">
        Preferred reminder time
        <input
          type="time"
          name="preferredTime"
          defaultValue={initialProfile.preferredTime ?? ""}
          className="mt-1 w-full rounded-md border border-muted bg-background px-3 py-1.5 text-foreground"
        />
      </label>
      <label className="flex items-center gap-2 text-sm text-muted">
        <input type="checkbox" name="remindersOptIn" defaultChecked={initialProfile.remindersOptIn} />
        Send me reminders
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md border border-accent px-3.5 py-1.5 text-sm font-semibold text-accent transition-colors hover:bg-accent-soft disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save"}
      </button>
      {state.error && <p className="text-sm text-accent">{state.error}</p>}
      {state.success && <p className="text-sm text-muted">Saved.</p>}
    </form>
  );
}
