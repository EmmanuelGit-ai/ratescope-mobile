# API Layer Rules

Applies to all files in src/api/

- client.ts: single Axios instance with baseURL from constants, 10s timeout, response interceptor that extracts data from { success, data } envelope
- Each endpoint file exports async functions that return typed data (not raw Axios responses)
- All functions must handle errors and throw typed errors
- NEVER call fetch() or axios directly from screens — always go through src/api/ functions
- NEVER hardcode URLs — use constants from src/constants/api.ts
