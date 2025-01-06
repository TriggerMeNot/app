# Build

## Development

```bash
cp .env.dev.example .env.dev
```

Set the environment variables in the `.env.dev` file.

```bash
docker compose -f compose.yml up -d
```

```bash
deno -A --env-file=.env.dev npm:drizzle-kit generate
```

```bash
deno -A --env-file=.env.dev npm:drizzle-kit migrate
```

```bash
deno task dev
```

## Production

```bash
cp .env.prod.example .env.prod
```

Set the environment variables in the `.env.prod` file.

```bash
docker compose -f compose.prod.yml up -d
```
