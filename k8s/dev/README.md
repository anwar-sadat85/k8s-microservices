# Web Service — Architecture & Learnings

## What this service is

The `web` service is the Next.js (App Router) frontend for the Task/Reminder
POC. Its current scope is authentication only — no task/reminder UI yet,
since User service and Task service don't exist. It validates the full
Auth0 login flow running inside Kubernetes, end to end, before any other
service is built.

## High-level architecture

```
Browser
  │  http://task-app.local:<port>
  ▼
Ingress (nginx-ingress)
  │  host: task-app.local  →  Service: web (port 80)
  ▼
Service: web (ClusterIP)
  │  selector: app=web  →  routes to pod on port 3000
  ▼
Deployment: web (1 replica)
  │  Next.js server (standalone build), non-root container
  │  envFrom: web-config (ConfigMap) + web-secrets (Secret)
  ▼
Auth0 (external)
  │  /auth/login, /auth/callback, /auth/logout handled by
  │  @auth0/nextjs-auth0 middleware (proxy.ts on Next 16)
  │  Session stored as an encrypted cookie (AUTH0_SECRET),
  │  not server-side state — no database involved for Web itself.
```

No database, no message bus, no other service dependency at this stage —
deliberately kept minimal so Docker/Ingress/Auth0-in-cluster issues could
be isolated from backend complexity.

## Key building blocks

- **Auth0 setup**: a Regular Web Application (not SPA — Next.js is a
  confidential client with a client secret) + a Custom API (`TaskAPI`)
  defining the `audience` (`https://task-reminder-api/`). The Web app was
  explicitly authorized to request tokens for that API via a Client Grant
  (Per-app authorization, not "All apps allowed").
- **`@auth0/nextjs-auth0` v4**: routes mounted at `/auth/*` (not the old
  `/api/auth/*`), middleware-based session handling via `auth0.middleware()`,
  server-side session reads via `auth0.getSession()`.
- **`output: "standalone"`** in `next.config.ts` — produces a minimal
  self-contained server bundle for a much smaller Docker image than
  copying the full `node_modules`.
- **Multi-stage Dockerfile** — deps → build → runtime, running as a
  non-root user (satisfies Pod Security Standards' `restricted` tier
  without extra config).
- **ConfigMap / Secret split**:
  - ConfigMap: `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`, `AUTH0_AUDIENCE`, `APP_BASE_URL`
  - Secret: `AUTH0_CLIENT_SECRET`, `AUTH0_SECRET`
- **Ingress**: host-based routing (`task-app.local`) via nginx-ingress,
  with `proxy-buffer-size`/`proxy-buffers-number` annotations increased
  beyond nginx's default (see gotcha below).

## Local Kubernetes networking — what we learned the hard way

Running minikube with the **Docker driver on WSL2/Windows** means the
node's own IP (`minikube ip`) is inside Docker's internal network and is
**not reachable directly from the Windows browser** — this was the root
cause of most of the connectivity troubleshooting.

What actually works for reaching Ingress from the Windows host:

```bash
minikube service ingress-nginx-controller -n ingress-nginx --url
```

This prints one or more `http://127.0.0.1:<ephemeral-port>` URLs. **The
port is different every time this command is run** — it is not stable
across restarts of the tunnel. Whatever port it prints has to be
consistently used in three places at once:

1. `/etc/hosts` — `127.0.0.1  task-app.local` (the IP side doesn't change,
   only the port used when browsing)
2. `APP_BASE_URL` in `web-config` ConfigMap
3. Auth0's Allowed Callback URLs / Allowed Logout URLs

A mismatch in any one of these three breaks the login redirect in a way
that's easy to misdiagnose as something else.

**Known dead ends, kept here so they aren't re-tried:**
- Using the raw `minikube ip` directly in the browser → times out (Docker
  internal network, unreachable from Windows).
- Port 80 specifically may be occupied by IIS on a Windows machine
  (`ERR IIS Web Core` in the browser is the tell) — avoid port 80
  entirely rather than trying to stop/reconfigure IIS.
- `nslookup` does **not** honor the Windows hosts file (it queries DNS
  directly) — use `ping` or `Resolve-DnsName` to verify hosts file
  resolution instead.

## Gotchas worth remembering

- **`ConfigMap` changes don't affect a running pod.** Env-var-injected
  config is fixed at container start — always follow a ConfigMap edit
  with `kubectl rollout restart deployment/web -n dev`.
- **`imagePullPolicy: Never`** is required in the Deployment spec on
  minikube, or Kubernetes may try to pull `web:dev` from a remote
  registry instead of using the image built directly into minikube's
  Docker daemon (`eval $(minikube docker-env)` before `docker build`).
- **`nginx.ingress.kubernetes.io/proxy-buffer-size`** needed to be raised
  from nginx's default (4–8KB) to `16k` — the Auth0 session cookie set on
  `/auth/callback` is large enough to exceed the default and causes a
  502 ("upstream sent too big header") on the very next page load after
  a successful login. This will likely resurface on any other
  Auth0-gated Ingress rule (User service, Task service) and should be
  set proactively rather than rediscovered each time.
- **Auth0's default post-login redirect goes to `APP_BASE_URL`, not
  wherever the user came from.** Use `?returnTo=/path` on the
  `/auth/login` link to control the landing page after login.
- **Next.js 16 renamed `middleware.ts` → `proxy.ts`** (exported function
  `proxy` instead of `middleware`) for the Auth0 SDK's route interception
  to keep working.

## Files

```
web/
├── Dockerfile
├── .dockerignore
├── next.config.ts          (output: "standalone")
├── src/
│   ├── lib/auth0.ts         (Auth0Client instance)
│   ├── app/
│   │   ├── proxy.ts          (Auth0 route middleware, Next 16 naming)
│   │   ├── layout.tsx        (session-aware header, fonts, Tailwind theme)
│   │   ├── page.tsx          (login landing page)
│   │   └── globals.css       (Tailwind v4 theme tokens)

k8s/dev/
├── namespace.yaml
├── web-configmap.yaml
├── web-secret.yaml
├── web-deployment.yaml       (Deployment + Service)
└── web-ingress.yaml          (host: task-app.local, buffer-size annotations)
```

## Verified working end to end

- [x] Local `npm run dev` login/logout
- [x] Containerized (`docker run`) login/logout, standalone build
- [x] Deployed to minikube, reachable via `port-forward`
- [x] Reachable and functional via Ingress (`task-app.local:<port>`)
- [x] Full Auth0 login → callback → session → logout round-trip through
      the whole chain: browser → minikube tunnel → Ingress → Service →
      pod → Auth0 → back

## Next steps (not yet built)

- User service (API + Postgres StatefulSet + AuthGuard verifying tokens
  against this same Auth0 setup)
- Task service
- Real UI beyond login/logout, once there's something for it to call