# TICKET-PWM-004: Research hosting & deployment

Label: `wayfinder:research`
Assignee:
Status: CLOSED
Blocked By: None

## Question

Where should the PWM website live, and how should it get there? The deck already carries `netlify.toml` and `vercel.json`. Research and compare:

- **Hosting platforms**: Vercel vs Netlify vs Cloudflare Pages — free tier limits, static-site support (and support for the rendering model chosen in the tooling ticket), custom domain handling.
- **CI/CD**: continuous deployment from the GitHub repo (push to `main` → deploy), preview deploys for PRs.

Note: the final pick must be compatible with the tooling/rendering decision from the tooling research — flag if any hosting choice conflicts with a likely tooling winner. Deliverable: `docs/RESEARCH-HOSTING-DEPLOYMENT.md` with a comparison table, a recommended platform, and a one-paragraph CI/CD setup outline.



## Resolution

**Decision:** Defer hosting and deployment research.

Hosting platform selection and CI/CD configuration are not currently part of the PWM website scope. The immediate goal is to improve and structure the Vite-based website locally before making deployment decisions.

The website will continue to use the Vite build configuration established by TICKET-PWM-002, producing a static `dist/` directory through `npm run build`.

### Scope

The following topics are intentionally deferred:

- Hosting platform selection (Vercel, Netlify, Cloudflare Pages, or other).
- Custom domain configuration.
- Continuous deployment from GitHub.
- Pull request preview deployments.
- Production deployment configuration.

Existing `netlify.toml` and `vercel.json` files should not be treated as architectural requirements. Their future use can be evaluated when deployment becomes part of the project scope.

### Rationale

There is no current requirement to choose a production hosting provider or configure CI/CD. Since the selected rendering model is a static Vite MPA, the resulting `dist/` directory will remain compatible with standard static hosting platforms, so postponing this decision does not block the current development work.

### Status

**CLOSED — Deferred**

**Reason:** Hosting and CI/CD are currently out of scope and can be researched when production deployment becomes a project requirement.