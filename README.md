# Homelab Dashboard

This is a dashboard for managing your homelab services.

## Deployment

This project is deployed to Cloudflare Pages. The following build settings are used:

*   **Framework preset:** Select **Next.js**. Cloudflare will automatically detect the static export configuration.
*   **Build command:** `npm run build`
*   **Build output directory:** `out`

When changes are pushed to the `main` branch, Cloudflare will automatically build and deploy the new version of the site.
