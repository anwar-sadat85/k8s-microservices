export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-76px)] items-center justify-center px-8 py-16">
      <div className="flex flex-col-reverse items-center gap-6 sm:flex-row sm:gap-12">
        <div className="flex items-center gap-3 opacity-70 sm:flex-col">
          <span className="hidden h-1 w-1 rounded-full bg-muted sm:block" />
          <span className="hidden h-1 w-1 rounded-full bg-muted sm:block" />
          <div className="flex flex-col items-center">
            <span className="h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_0_6px_var(--color-accent-soft)]" />
            <span className="mt-1.5 font-mono text-[0.7rem] uppercase tracking-widest text-accent">Now</span>
          </div>
          <span className="hidden h-1 w-1 rounded-full bg-muted sm:block" />
          <span className="hidden h-1 w-1 rounded-full bg-muted sm:block" />
        </div>

        <div className="max-w-[420px] rounded-2xl border border-white/[.06] bg-surface px-10 py-12">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-accent">Task &amp; Reminder</p>
          <h1 className="mb-3.5 font-display text-4xl font-semibold leading-tight text-foreground">
            Nothing falls through.
          </h1>
          <p className="mb-8 text-[0.95rem] leading-relaxed text-muted">
            Sign in to keep your tasks and their reminders in one place, sent right when you need them.
          </p>
          
            <a href="/auth/login"
            className="inline-block rounded-lg bg-accent px-6 py-3 text-[0.95rem] font-semibold text-[#1a1204] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground focus-visible:outline-offset-2"
          >
            Log in
          </a>
        </div>
      </div>
    </div>
  );
}