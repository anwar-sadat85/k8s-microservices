import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import { auth0 } from "@/lib/auth0";
import "./globals.css";

const fraunces = Fraunces({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-display-raw" });
const inter = Inter({ subsets: ["latin"], variable: "--font-body-raw" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400"], variable: "--font-mono-raw" });

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth0.getSession();

  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${plexMono.variable}`}>
      <body className="min-h-screen">
        <header className="flex items-center justify-end gap-5 px-8 py-5">
          {session ? (
            <>
              <span className="font-sans text-sm text-muted">Welcome, {session.user.name}</span>
              
                <a href="/auth/logout"
                className="rounded-md border border-accent px-3.5 py-1.5 text-sm font-semibold text-accent transition-colors hover:bg-accent-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground focus-visible:outline-offset-2"
              >
                Log Out
              </a>
            </>
          ) : (
            
              <a href="/auth/login"
              className="rounded-md border border-accent px-3.5 py-1.5 text-sm font-semibold text-accent transition-colors hover:bg-accent-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground focus-visible:outline-offset-2"
            >
              Log In
            </a>
          )}
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}