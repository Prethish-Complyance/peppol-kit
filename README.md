# peppol-kit 🧰

A lightweight, TypeScript-first utility library for working with the **Peppol eDelivery network**.

`peppol-kit` provides simple APIs for participant discovery, SML/NAPTR resolution, SMP metadata lookup, and Peppol identifier handling — so you don't have to implement DNS lookups, hashing, XML parsing, and SMP requests yourself.

> 🚧 **Early development:** APIs are still evolving.

## Features

- 🔍 **Participant Discovery** — Resolve a Peppol Participant ID to its SMP.
- 🌐 **SML Resolution** — Perform SHA-256, Base32, and NAPTR-based SML lookups.
- 🏢 **SMP Lookup** — Retrieve service metadata, endpoints, and transport profiles.
- 🆔 **Participant IDs** — Utilities for working with Peppol Participant Identifiers.
- 📄 **Document Identifiers** — Helpers for working with Peppol document and process identifiers.
- 🧩 **TypeScript Native** — Fully typed API with generated type declarations.
- 🟢 **Node.js** — Designed for server-side JavaScript and TypeScript applications.

## Installation

```bash
npm install peppol-kit
```

## Quick Start

```ts
import { participantLookup } from "peppol-kit";

const result = await participantLookup(
  "0235:1341924489",
  "test"
);

console.log(result);
```

For the production network:

```ts
const result = await participantLookup(
  "0235:1341924489",
  "production"
);

console.log(result);
```

## Participant Discovery

`participantLookup()` handles the Peppol participant discovery process for you.

```ts
import { participantLookup } from "peppol-kit";

const result = await participantLookup(
  "0235:1341924489",
  "test"
);

console.log(result);
```

The discovery process:

```text
Participant ID
      │
      ▼
Normalize identifier
      │
      ▼
SHA-256 hash
      │
      ▼
Base32 encoding
      │
      ▼
SML DNS name
      │
      ▼
NAPTR lookup
      │
      ▼
SMP
      │
      ▼
Service Metadata
```

## SML Environments

`peppol-kit` supports both Peppol SML environments:

- `test`
- `production`

```ts
await participantLookup(
  "0235:1341924489",
  "test"
);
```

or:

```ts
await participantLookup(
  "0235:1341924489",
  "production"
);
```

## Node.js

`peppol-kit` is designed to run in Node.js because Peppol discovery requires DNS resolution.

It can be used with:

- Node.js applications
- Next.js API routes
- Express / Fastify servers
- Backend services
- CLI applications

### Example CLI

```ts
import { participantLookup } from "peppol-kit";

const participantID = process.argv[2];
const sml = process.argv[3] as "test" | "production";

const result = await participantLookup(
  participantID,
  sml
);

console.log(result);
```

Run:

```bash
node dist/example/cli/index.js "0235:1341924489" test
```

## Browser Usage

The discovery functionality currently relies on Node.js APIs such as DNS resolution.

For this reason, `peppol-kit` should be used **server-side** rather than directly inside a browser application.

A typical architecture looks like:

```text
Browser
   │
   │ HTTP
   ▼
Your Backend
   │
   ▼
peppol-kit
   │
   ├── DNS
   ├── SML
   └── SMP
```

For example, a Next.js application can use `peppol-kit` inside an API route and expose the lookup functionality to a frontend.

## TypeScript

`peppol-kit` is written in TypeScript and provides type definitions out of the box.

```ts
import { participantLookup } from "peppol-kit";
```

## Specification

The SML discovery implementation is based on the **Peppol EDN Service Metadata Locator (SML) specification 1.3.0**.

[Peppol EDN Service Metadata Locator 1.3.0](https://docs.peppol.eu/edelivery/sml/Peppol-EDN-Service-Metadata-Locator-1.3.0-2025-02-06.pdf)

## Development

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/peppol-kit.git
cd peppol-kit
```

Install dependencies:

```bash
npm install
```

Build:

```bash
npm run build
```

## Status

🚧 `peppol-kit` is currently under active development.

The API and functionality may change as additional Peppol functionality is implemented.

## License

MIT