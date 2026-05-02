# API documentation

Spécification OpenAPI 3.0 de l'API `auth-system`.

## Fichier

- [`openapi.yaml`](./openapi.yaml) — spec complète de toutes les routes (Auth + Users).

## Visualiser la doc

Plusieurs options selon ton contexte :

### Swagger Editor (en ligne)

1. Ouvrir <https://editor.swagger.io>
2. `File > Import file` → sélectionner `docs/openapi.yaml`

### Redocly CLI (local)

```bash
bunx @redocly/cli preview-docs docs/openapi.yaml
```

Ouvre une UI Redoc sur <http://localhost:8080>.

### Swagger UI (local, via Docker)

```bash
docker run --rm -p 8081:8080 \
  -e SWAGGER_JSON=/spec/openapi.yaml \
  -v "$(pwd)/docs:/spec" \
  swaggerapi/swagger-ui
```

Ouvre <http://localhost:8081>.

### Importer dans Postman / Insomnia

Les deux outils acceptent l'import direct d'un fichier OpenAPI 3.0 — toutes
les routes et schémas seront disponibles avec un exemple de payload.

## Conventions

- Les routes protégées attendent un header `Authorization: Bearer <sessionToken>`.
  Le token est obtenu via `POST /users` (sign-up) ou `POST /auth/sign-in`.
- Les erreurs métier retournent un objet `{ message: string }` avec un code
  HTTP approprié (`400`, `401`, `404`).
- `POST /auth/forget-password` répond toujours `204`, qu'un compte existe ou
  non, pour éviter de divulguer l'existence d'un email.

## Maintenir la doc à jour

`docs/openapi.yaml` est un fichier statique et **n'est pas généré
automatiquement depuis le code**. Quand une route ou un schéma change dans
[`src/app/inbound/`](../src/app/inbound/), penser à mettre à jour la spec en
parallèle.
