# URL Shortener API

A GraphQL API backend service for shortening URLs, built with Node.js, Apollo Server, Prisma, and PostgreSQL.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **GraphQL:** Apollo Server
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** JWT + bcrypt

## Features

- URL shortening with optional custom short codes
- Anonymous URL shortening (no account required)
- User authentication (register / login / profile)
- URL ownership management (create, read, update, delete)
- Click tracking and analytics
- URL expiration support
- Paginated URL listing
- Short code redirect endpoint

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm

### Installation

```bash
git clone <repo-url>
cd url-shorts
npm install
npx prisma generate
```

### Configuration

Copy the environment file and adjust values:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/urlshortener` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `your-super-secret-jwt-key-change-in-production` |
| `PORT` | Server port | `4000` |

### Database

```bash
# Push schema to database (creates tables)
npx prisma db push

# Or run a migration
npx prisma migrate dev --name init

# Open Prisma Studio (GUI)
npx prisma studio
```

### Running

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

Server starts at `http://localhost:4000`.

GraphQL playground at `http://localhost:4000/graphql`.

Redirect endpoint at `http://localhost:4000/:shortCode`.

---

## GraphQL API

### Queries

#### `me`

Returns the currently authenticated user.

```graphql
query Me {
  me {
    id
    email
    createdAt
    updatedAt
  }
}
```

Headers: `Authorization: Bearer <token>`

---

#### `myUrls`

Returns paginated URLs owned by the authenticated user (newest first).

```graphql
query MyUrls($page: Int, $limit: Int) {
  myUrls(page: $page, limit: $limit) {
    items {
      id
      originalUrl
      shortCode
      clicks
      expiresAt
      createdAt
      updatedAt
    }
    totalItems
    totalPages
    currentPage
  }
}
```

Variables:
```json
{
  "page": 1,
  "limit": 10
}
```

| Argument | Type | Default | Max |
|---|---|---|---|
| `page` | Int | `1` | — |
| `limit` | Int | `10` | `100` |

---

#### `url`

Returns a single URL by ID (must be owned by the authenticated user).

```graphql
query Url($id: ID!) {
  url(id: $id) {
    id
    originalUrl
    shortCode
    clicks
    expiresAt
    createdAt
    updatedAt
  }
}
```

---

#### `analytics`

Returns analytics for a single URL (must be owned by the authenticated user).

```graphql
query Analytics($id: ID!) {
  analytics(id: $id) {
    originalUrl
    shortCode
    clicks
    createdAt
    expiresAt
    updatedAt
  }
}
```

---

### Mutations

#### `register`

Creates a new user account.

```graphql
mutation Register($email: String!, $password: String!) {
  register(email: $email, password: $password) {
    token
    user {
      id
      email
      createdAt
    }
  }
}
```

Variables:
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

| Rule | Detail |
|---|---|
| Email | Must be a valid email format, must be unique |
| Password | Minimum 8 characters |

---

#### `login`

Authenticates an existing user.

```graphql
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      id
      email
      createdAt
    }
  }
}
```

Variables:
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

Returns a JWT token that must be sent as `Authorization: Bearer <token>` for authenticated requests.

---

#### `createShortUrl`

Creates a shortened URL. Works for both authenticated and anonymous users.

```graphql
mutation CreateShortUrl($originalUrl: String!, $shortCode: String, $expiresAt: String) {
  createShortUrl(originalUrl: $originalUrl, shortCode: $shortCode, expiresAt: $expiresAt) {
    id
    originalUrl
    shortCode
    clicks
    expiresAt
    createdAt
    updatedAt
  }
}
```

Variables:
```json
{
  "originalUrl": "https://example.com/very/long/url",
  "shortCode": "abc123",
  "expiresAt": "2025-12-31T23:59:59Z"
}
```

| Argument | Type | Required | Description |
|---|---|---|---|
| `originalUrl` | String! | Yes | Must be a valid HTTP/HTTPS URL |
| `shortCode` | String | No | 6–8 alphanumeric chars; auto-generated if omitted |
| `expiresAt` | String | No | ISO 8601 datetime; must be in the future |

Authenticated users become the owner. Anonymous URLs have no owner.

---

#### `updateUrl`

Updates a URL's original URL and/or expiration date (authenticated only, owned URL only).

```graphql
mutation UpdateUrl($id: ID!, $originalUrl: String, $expiresAt: String) {
  updateUrl(id: $id, originalUrl: $originalUrl, expiresAt: $expiresAt) {
    id
    originalUrl
    shortCode
    expiresAt
    updatedAt
  }
}
```

Variables:
```json
{
  "id": "clx...",
  "originalUrl": "https://new-url.com",
  "expiresAt": null
}
```

Pass `null` to `expiresAt` to remove an expiration date. Omit fields you don't want to change.

---

#### `deleteUrl`

Deletes a URL (authenticated only, owned URL only).

```graphql
mutation DeleteUrl($id: ID!) {
  deleteUrl(id: $id) {
    message
  }
}
```

---

### Redirect Endpoint

`GET /:shortCode`

Visiting `http://localhost:4000/abc123` in a browser will:

1. Look up the short code
2. If expired → 404
3. If not found → 404
4. Increment click count
5. Return a 301 redirect to the original URL

---

## Authentication

Include the JWT token in request headers for authenticated operations:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

The token is obtained from `register` or `login` mutations.

Anonymous users can only use `createShortUrl`. All other queries and mutations require authentication.

---

## Error Handling

All errors return JSON in a consistent format.

### Business Logic Errors (4xx)

```json
{
  "message": "Email already exists"
}
```

Common error messages:

| Scenario | Message | Status |
|---|---|---|
| Duplicate email | `Email already exists` | 409 |
| Invalid credentials | `Invalid credentials` | 401 |
| Missing auth token | `Unauthorized` | 401 |
| Accessing another user's URL | `Forbidden` | 403 |
| URL not found | `URL not found` | 404 |
| Duplicate short code | `Short code already exists` | 400 |
| Invalid URL format | `Invalid URL format` | 400 |
| Expired URL | `URL not found` | 404 |

### Server Errors (5xx)

```json
{
  "message": "Internal server error"
}
```

No stack traces or implementation details are exposed.

---

## Short Code Rules

- **Length:** 6–8 characters
- **Characters:** `A–Z`, `a–z`, `0–9`
- **Uniqueness:** Must be globally unique
- **Generation:** Randomly generated if not provided

---

## URL Expiration

- Expired URLs remain in the database
- Expired URLs cannot redirect (return 404)
- Expired URLs cannot have their click count incremented
- Setting `expiresAt` to `null` removes expiration

---

## Database Schema

### User

| Field | Type | Notes |
|---|---|---|
| `id` | String (CUID) | Primary key |
| `email` | String | Unique |
| `password` | String | bcrypt hashed |
| `createdAt` | DateTime | Auto |
| `updatedAt` | DateTime | Auto |

### URL

| Field | Type | Notes |
|---|---|---|
| `id` | String (CUID) | Primary key |
| `originalUrl` | String | The target URL |
| `shortCode` | String | Unique, 6–8 chars |
| `clicks` | Int | Default 0 |
| `expiresAt` | DateTime? | Nullable |
| `userId` | String? | Nullable for anonymous URLs |
| `createdAt` | DateTime | Auto |
| `updatedAt` | DateTime | Auto |

---

## Project Structure

```
src/
├── config/          # Environment configuration
├── constants/       # App-wide constants
├── context/         # GraphQL context factory
├── errors/          # Custom error classes
├── graphql/         # Schema, resolvers, type definitions
│   ├── resolvers/
│   ├── schema/
│   └── types/
├── middleware/      # Express middleware
├── repositories/    # Data access layer (Prisma queries)
├── routes/          # Express routes (redirect endpoint)
├── services/        # Business logic layer
├── utils/           # Shared utilities (JWT, bcrypt, Prisma client)
├── validators/      # Input validation
├── app.js           # Express + Apollo Server setup
└── server.js        # Entry point
```

### Architecture

```
Resolver → Service → Repository → Prisma Client → Database
```

- **Resolvers** are thin — they validate input and delegate to services
- **Services** contain all business logic
- **Repositories** contain all database queries
- **Prisma Client** is used through a single shared instance

---

## NPM Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start with nodemon (hot reload) |
| `npm start` | Start production server |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:push` | Push schema to database |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:studio` | Open Prisma Studio |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
