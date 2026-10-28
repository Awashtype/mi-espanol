# Private account service

These are the authored API, MCP, merge and schema files for the existing Sites project `appgprj_6ae15b2d22a08191b4f8d4ea5c9a7750`. The complete deployable starter/source is in that Site’s private source repository. Use the Sites source workflow to open and update the existing project; do not register a second Site. The GitHub notebook stays public; account progress is stored privately in D1, never committed here.

API writes require ChatGPT identity, a matching Origin and version-based compare-and-swap. MCP tools are read-only. Local and deployed D1 databases are separate. Tests: `node tests/progress.test.mjs` from the main repo and the service’s schema/conflict checks. Browser sign-in and the first transfer must be completed by the user on their own study device; a test browser cannot access that device’s local history.
