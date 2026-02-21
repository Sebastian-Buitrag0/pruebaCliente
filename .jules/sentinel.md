## 2025-02-12 - Critical Sensitive Data Logging
**Vulnerability:** Full Request/Response objects and login credentials logged to console.
**Learning:** Developers often leave debug logs in interceptors for convenience, forgetting they expose Authorization headers and passwords.
**Prevention:** Use conditional logging or specific debug flags, and never log entire config/response objects in production.
