# Ashlar Lane

Marketing site for [Ashlar Lane](https://www.ashlarlane.com), an investor-friendly real estate brokerage for agents.

## Local preview

Open `index.html` in a browser, or run a simple server:

```bash
python3 -m http.server 8080
```

Then visit http://localhost:8080

## Deploy (GitHub Pages)

This repo is configured for GitHub Pages with a custom domain.

1. Push this repo to `https://github.com/avinoz/ashlarlane`
2. In GitHub: **Settings → Pages**
   - Source: **Deploy from a branch**
   - Branch: **main** / **/(root)**
   - Custom domain: `www.ashlarlane.com`
   - Enable **Enforce HTTPS** once DNS is verified
3. Wait for DNS to propagate (often 15–60 minutes, up to 48 hours)

Live URLs after setup:

- https://www.ashlarlane.com
- https://avinoz.github.io/ashlarlane (until custom domain is configured)

## GoDaddy DNS setup

In GoDaddy → **My Products** → **ashlarlane.com** → **DNS**:

### Apex domain (`ashlarlane.com`)

Add **four A records** (Host `@`):

| Type | Name | Value           | TTL  |
|------|------|-----------------|------|
| A    | @    | 185.199.108.153 | 600  |
| A    | @    | 185.199.109.153 | 600  |
| A    | @    | 185.199.110.153 | 600  |
| A    | @    | 185.199.111.153 | 600  |

Optional IPv6: add four **AAAA** records for `@` pointing to GitHub’s IPv6 addresses (see [GitHub docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)).

### WWW subdomain

Add a **CNAME** record:

| Type  | Name | Value              | TTL |
|-------|------|--------------------|-----|
| CNAME | www  | avinoz.github.io   | 600 |

Remove conflicting records (old parking page A records, forwarding, or duplicate CNAMEs).

### Verify

```bash
dig ashlarlane.com +short
dig www.ashlarlane.com +short
```

You should see the four GitHub IP addresses for the apex and a CNAME to `avinoz.github.io` for www.

## Before launch checklist

- [ ] Replace placeholder phone `(415) 555-0100` with your real number
- [ ] Connect the path form handler in `index.html` (Formspree, Netlify Forms, etc.)
- [ ] Add license numbers, broker of record, and state disclosures in the footer
- [ ] Add Terms of Service and Privacy Policy pages
- [ ] Confirm pricing and regions match your actual brokerage plans

## Structure

- `index.html` — landing page (Pellego-style agent recruitment)
- `css/styles.css` — styles
- `js/main.js` — mobile nav and region tabs
- `CNAME` — custom domain for GitHub Pages
