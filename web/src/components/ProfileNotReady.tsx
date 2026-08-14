// src/components/ProfileNotReady.tsx
export function ProfileNotReady({ refreshHref = "/" }: { refreshHref?: string }) {
  return (
    <div className="mx-auto max-w-md rounded-lg bg-surface p-6 text-center">
      <p className="font-sans text-foreground">
        We&apos;re still setting up your profile. This usually takes a few seconds.
      </p>
      <a
        href={refreshHref}
        className="mt-4 inline-block rounded-md border border-accent px-3.5 py-1.5 text-sm font-semibold text-accent transition-colors hover:bg-accent-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground focus-visible:outline-offset-2"
      >
        Refresh
      </a>
    </div>
  );
}
