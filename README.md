# peppol-kit 🧰

A lightweight, zero-boilerplate utility library for JavaScript and TypeScript designed to take the friction out of working with Peppol networks. 

Whether you are performing SMP/SML lookups, validating Participant IDs, or parsing document identifiers, `peppol-kit` provides clean, reliable helper functions so you don't have to build custom DNS, REST, or XML parsers from scratch.

### Key Features

- 🔍 **SMP Record Resolution:** Easily query Service Metadata Publishers (SMP) for participant capabilities, endpoints, and transport profiles.
- 🌐 **SML DNS Lookup:** Automatic CNAME / NAPTR hashing and SML domain resolution (Production & Test networks).
- 🆔 **Identifier Parsing & Validation:** Validate and format Peppol Participant IDs.
- 📄 **Document Type Identification:** Parse and match Peppol BIS Billing and custom document specification identifiers seamlessly.
- ⚡ **Isomorphic & TypeScript Native:** Works out of the box in Node.js and modern browsers with full type definitions.