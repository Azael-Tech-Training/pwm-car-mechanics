# TICKET-PWM-004: Research hosting & deployment

Label: `wayfinder:research`
Assignee:
Status: OPEN
Blocked By: None

## Question

Where should the PWM website live, and how should it get there? The deck already carries `netlify.toml` and `vercel.json`. Research and compare:

- **Hosting platforms**: Vercel vs Netlify vs Cloudflare Pages — free tier limits, static-site support (and support for the rendering model chosen in the tooling ticket), custom domain handling.
- **CI/CD**: continuous deployment from the GitHub repo (push to `main` → deploy), preview deploys for PRs.

Note: the final pick must be compatible with the tooling/rendering decision from the tooling research — flag if any hosting choice conflicts with a likely tooling winner. Deliverable: `docs/RESEARCH-HOSTING-DEPLOYMENT.md` with a comparison table, a recommended platform, and a one-paragraph CI/CD setup outline.
