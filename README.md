# Auth System

`auth-system` est un coeur metier d'authentification reutilisable, pense pour rester independant du framework HTTP et du fournisseur d'authentification.

L'idee est simple: le domaine et les cas d'usage ne doivent pas dependre d'Express, de Hono, de Better Auth, ni d'un moteur de persistence particulier. Ces choix sont branches via des adaptateurs, afin de pouvoir remplacer la couche serveur ou le provider sans devoir reecrire le coeur applicatif.

Pour cette premiere iteration, le projet s'oriente vers:

- `Express` comme serveur HTTP cible
- `Better Auth` comme provider d'authentification
- `Drizzle + SQLite/libsql` pour la persistence

Ces choix restent remplacables par conception.

## Vision

Ce projet cherche a fournir une base d'authentification:

- modulaire
- testable
- decouplee
- reutilisable dans plusieurs runtimes ou projets

L'objectif n'est pas de construire une application monolithique liee a une stack precise, mais un noyau metier que l'on peut brancher sur plusieurs environnements:

- un serveur `Hono`
- un serveur `Express`
- un autre provider que `Better Auth`
- une autre implementation de repository ou de base de donnees

## Principes d'architecture

L'organisation suit une logique proche de l'architecture hexagonale / clean architecture:

- `core/domain` contient les entites et value objects metier
- `core/application` contient les ports et les use cases
- `inbound` contient les points d'entree applicatifs/HTTP
- `outbound` contient les adaptateurs vers les services externes
- `infrastructure` contient les details techniques de base de donnees

Le coeur metier depend d'abstractions (`ports`), et les implementations concretes viennent se brancher autour.

## Etat actuel

Le depot contient deja les briques principales suivantes:

- un domaine `User` avec des value objects comme `Email` et `Password`
- des use cases pour creer, lister, recuperer, mettre a jour et supprimer un utilisateur
- un port `AuthProvider` pour abstraire le provider d'authentification
- une implementation `BetterAuthAdapter`
- un repository `UserRepo` avec une implementation SQLite et une implementation en memoire
- un schema Drizzle compatible avec Better Auth
- des tests unitaires sur le domaine et l'application

Important: l'integration `Better Auth` est deja presente dans le code, mais le bootstrap serveur HTTP est encore en cours de finalisation. `Express` est la cible immediate, mais il n'est pas encore completement branche dans les fichiers d'entree actuels.

## Structure du projet

```text
src/
  app/
    core/
      application/
        ports/
        usesCases/
      domain/
        entities/
        value-objects/
      errors/
    inbound/
    outbound/
      persistence/
      services/
  infrastructure/
    db/
  main.ts
  server.ts
```

Quelques fichiers importants:

- `src/app/core/application/ports/auth.provider.ts`: contrat du provider d'authentification
- `src/app/outbound/services/betterAuthAdapter.ts`: adaptateur Better Auth vers le port applicatif
- `src/app/outbound/services/better-auth.ts`: configuration Better Auth
- `src/app/outbound/persistence/user.sqlite.ts`: repository SQLite
- `src/infrastructure/db/schema.ts`: schema Drizzle / Better Auth
- `src/app/index.ts`: composition actuelle des use cases et adaptateurs

## Pourquoi cette separation

Cette separation permet de:

- remplacer `Better Auth` par un autre provider sans toucher au domaine
- remplacer `Hono` par `Express` sans changer les use cases
- tester la logique metier sans lancer un serveur HTTP
- limiter l'impact des changements techniques sur le coeur applicatif

En pratique, le code metier manipule des interfaces comme `AuthProvider` et `UserRepo`, puis les adaptateurs concrets viennent fournir le comportement reel.

## Stack actuelle

- Runtime: `Bun`
- Langage: `TypeScript`
- Auth provider actuel: `Better Auth`
- ORM / DB toolkit: `Drizzle ORM`
- Base actuelle: `SQLite/libsql`
- Tests: `Vitest`
- Qualite: `ESLint` + `Prettier`

## Installation

```bash
bun install
```

## Configuration

Le projet utilise des variables d'environnement pour la base et Better Auth.

Exemple de `.env`:

```env
DB_FILE_NAME=file:local.db
BETTER_AUTH_SECRET=change-me-with-a-long-secret
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_TRUSTED_ORIGINS=http://localhost:3000
```

Variables actuellement attendues par le code:

- `DB_FILE_NAME`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `BETTER_AUTH_TRUSTED_ORIGINS`

## Scripts utiles

```bash
# developpement
bun run dev

# generation du schema Better Auth vers Drizzle
bun run auth:generate

# base de donnees
bun run db:generate
bun run db:migrate
bun run db:push
bun run db:studio

# qualite
bun run lint
bun test
bun run build
bun run check
```

Note: les scripts de qualite, de test et de build sont en place. Le point d'entree serveur est encore en cours de structuration, donc `bun run dev` correspond a une phase de montage en cours plutot qu'a un serveur Hono deja finalise.

## CI

Le workflow GitHub Actions execute actuellement:

- l'installation des dependances
- le lint
- les tests
- le build

## Philosophie de remplacement

Le projet est volontairement concu pour que les choix techniques soient interchangeables.

Exemples:

- si vous voulez `Express` a la place de `Hono`, vous remplacez surtout la couche `inbound`
- si vous voulez un autre provider que `Better Auth`, vous creez un autre adaptateur implementant `AuthProvider`
- si vous voulez une autre persistence, vous remplacez l'implementation de `UserRepo`

Le coeur metier, lui, doit rester stable.

## Roadmap proche

- brancher completement `Express` comme serveur HTTP principal
- finaliser la couche `inbound` et ses controllers/routes
- etendre les use cases autour de la connexion/session si necessaire
- ajouter d'autres adaptateurs serveur ou provider pour valider la remplacabilite

## En resume

`auth-system` n'est pas juste un setup d'auth pour une stack donnee. C'est une base d'authentification orientee domaine, pensee pour etre reutilisee, testee et adaptee a plusieurs contextes techniques.

La premiere integration visee est `Express + Better Auth`, mais l'architecture a ete construite pour que cette combinaison reste un detail d'implementation, pas une contrainte du coeur metier.
