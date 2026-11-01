# Static deployment

This deployment is intentionally frontend-only. It serves:

- the React/Vite app under `/app/`;
- the 54 legacy simulations under `/courses/`;
- covers under `/covers/`;
- public metadata under `/content/` and `/catalog.json`.

The full `SGK/` PDF directory is not copied into the public image. Keep it in
private storage until distribution rights and access control are decided.

## Docker Compose smoke run

From the repository root:

```bash
docker compose -f deploy/docker-compose.static.yml up --build
```

Open:

```text
http://localhost:8080/app/
http://localhost:8080/app/lesson/capacitor-step
```

Health/version endpoints:

```text
http://localhost:8080/healthz
http://localhost:8080/version
```

Expected static path behavior:

```text
/app/*                         SPA fallback to /app/index.html
/courses/missing.html         404
/covers/missing.webp          404
/content/missing.json         404
/SGK/*                        404 in the public image
```

## Nginx or Caddy

- Use `infra/nginx/nginx.conf` with the image above, or
- use `infra/caddy/Caddyfile` with a release directory whose document root
  contains `app/`, `assets/`, `courses/`, `covers/`, `content/`, and the static
  health/version files.

Put TLS termination in front of the HTTP container. Enable HSTS only after the
server is consistently reachable over HTTPS.
