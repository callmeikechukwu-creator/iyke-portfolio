# Iyke Storage Gateway (Edge Media Cloud)

A centralized edge media storage gateway and CDN built on Cloudflare Workers and R2.

## Architecture

- **Engine**: Cloudflare Workers (Edge compute, 0 cold-starts)
- **Bucket**: Cloudflare R2 (`iyke-cloud`)
- **Egress Cost**: \$0.00 / month forever
- **Security**: Project-scoped API keys (`Authorization: Bearer <KEY>`)

## Directory Structure

All media is strictly namespaced by project:

```
iyke-cloud/
└── <project>/
    └── <folder>/
        └── <filename>
```

For the portfolio:
- `iyke-portfolio/projects/*`
- `iyke-portfolio/blog/*`
- `iyke-portfolio/brand/*`
- `iyke-portfolio/resume/*`

## API Endpoints

### 1. Health Check
`GET /health`

### 2. Upload File (with Dynamic Metadata)
`POST /v1/upload`
- **Headers**:
  - `Authorization: Bearer <API_KEY>`
  - `Content-Type: multipart/form-data`
- **Form Fields**:
  - `file`: The binary file (Image, Video, PDF, SVG)
  - `folder`: Subfolder (e.g. `projects`, `blog`, `brand`, `resume`)
  - `tags`: Comma-separated tags (e.g. `hero,dark-mode`)
  - `alt`: Descriptive alt text
  - `width`, `height`: Image dimensions
  - `blurDataURL`: Base64 blur placeholder

### 3. List Files (Project Scoped)
`GET /v1/files?folder=projects&limit=50&tag=hero`
- **Headers**:
  - `Authorization: Bearer <API_KEY>`

### 4. Delete File
`DELETE /v1/files/<key>`
- **Headers**:
  - `Authorization: Bearer <API_KEY>`

### 5. Edge CDN Delivery
`GET /cdn/<key>`
- Streams file directly from R2 with `Cache-Control: public, max-age=31536000, immutable` and ETag caching.

## Deployment

From the `services/storage-gateway` directory:

```bash
npx wrangler deploy
```
