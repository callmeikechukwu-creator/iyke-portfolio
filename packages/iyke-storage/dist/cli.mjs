#!/usr/bin/env node
import g from"fs";import k from"path";var $="https://iyke-storage-gateway.iyke-storage-gateway.workers.dev",d=process.env.STORAGE_GATEWAY_URL||$,f=process.env.STORAGE_ROOT_SECRET||"ik_root_master_7f8e9a2b1c4d",j=process.env.STORAGE_API_KEY||"ik_live_portfolio_master",p=process.argv.slice(2),u=p[0],m=p[1];function T(e){let o={};for(let s=0;s<e.length;s++){let n=e[s];if(n.startsWith("--")){let a=n.substring(2),i=e[s+1];i&&!i.startsWith("--")?(o[a]=i,s++):o[a]=!0}}return o}function y(){console.log(`
\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
\u2502  \u26A1 IYKE STORAGE PLATFORM CLI                                \u2502
\u2502  Gateway: ${d.padEnd(49)}\u2502
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518`)}function x(){y(),console.log(`
Usage:
  npx iyke-storage <command> [subcommand] [options]

Commands:
  keys list
    List all active project API keys in Cloudflare KV

  keys create --project <slug> --name "<label>" [--permissions read,write,delete]
    Generate a new scoped API key for a project

  keys revoke <keyId>
    Instantly revoke and invalidate an API key worldwide

  upload <filePath> [--project <slug>] [--folder <name>] [--key <key>]
    Upload any file directly to Cloudflare R2 via the gateway

Examples:
  npx iyke-storage keys create --project iyke-saas --name "SaaS Mobile App"
  npx iyke-storage keys list
  npx iyke-storage keys revoke key_7a9f1234
  npx iyke-storage upload ./screenshot.png --folder projects
`)}async function v(){y(),console.log(`\u{1F50D} Fetching active keys from Cloudflare KV edge...
`);try{let e=await fetch(`${d}/v1/admin/keys`,{method:"GET",headers:{Authorization:`Bearer ${f}`}}),o=await e.json();(!e.ok||!o.success)&&(console.error("\u274C Failed to list keys:",o.error||e.statusText),process.exit(1)),console.log(`Found ${o.count} active key(s):
`),console.table(o.keys.map(s=>({ID:s.id,Name:s.name,Project:s.project,Prefix:s.prefix,Permissions:(s.permissions||[]).join(", "),"Last Used":s.lastUsedAt?new Date(s.lastUsedAt).toLocaleString():"Never"})))}catch(e){console.error("\u274C Network error connecting to gateway:",e.message),process.exit(1)}}async function S(e){let o=e.project,s=e.name,n=e.permissions?e.permissions.split(",").map(t=>t.trim()):["read","write","delete"],a=e.folders?e.folders.split(",").map(t=>t.trim()):["*"],i=e.cdn;o||(console.error("\u274C Error: --project <slug> is required (e.g. --project iyke-saas)"),process.exit(1)),s||(console.error('\u274C Error: --name "<description>" is required (e.g. --name "SaaS App Client")'),process.exit(1)),y(),console.log(`\u{1F511} Generating dynamic API key for project '${o}'...
`);try{let t=await fetch(`${d}/v1/admin/keys`,{method:"POST",headers:{Authorization:`Bearer ${f}`,"Content-Type":"application/json"},body:JSON.stringify({project:o,name:s,permissions:n,allowedFolders:a,cdnHost:i})}),r=await t.json();(!t.ok||!r.success)&&(console.error("\u274C Failed to create key:",r.error||t.statusText),process.exit(1)),console.log(`\u2728 SUCCESS! New API Key generated:
`),console.log("\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501"),console.log(`\u{1F511} Secret Key : \x1B[32m${r.apiKey}\x1B[0m`),console.log("\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501"),console.log(`\x1B[33m\u26A0\uFE0F  IMPORTANT: Store this key securely now. For security reasons, it will NEVER be displayed again.\x1B[0m
`),console.log(`\u2022 Key ID         : ${r.key.id}`),console.log(`\u2022 Project Scope  : ${r.key.project}`),console.log(`\u2022 Display Prefix : ${r.key.prefix}`),console.log(`\u2022 Permissions    : ${r.key.permissions.join(", ")}`),console.log(`\u2022 Folders        : ${r.key.allowedFolders.join(", ")}`),console.log(`\u2022 Created At     : ${r.key.createdAt}
`)}catch(t){console.error("\u274C Network error connecting to gateway:",t.message),process.exit(1)}}async function h(e){e||(console.error("\u274C Error: Key ID is required (e.g. npx iyke-storage keys revoke key_12345)"),process.exit(1)),y(),console.log(`\u{1F5D1}\uFE0F  Revoking key '${e}' from Cloudflare KV...
`);try{let o=await fetch(`${d}/v1/admin/keys/${encodeURIComponent(e)}`,{method:"DELETE",headers:{Authorization:`Bearer ${f}`}}),s=await o.json();(!o.ok||!s.success)&&(console.error("\u274C Failed to revoke key:",s.error||o.statusText),process.exit(1)),console.log(`\u2705 \x1B[32m${s.message}\x1B[0m
`)}catch(o){console.error("\u274C Network error connecting to gateway:",o.message),process.exit(1)}}async function b(e,o){(!e||!g.existsSync(e))&&(console.error(`\u274C Error: File not found at path '${e}'`),process.exit(1));let s=g.statSync(e);s.isDirectory()&&(console.error(`\u274C Error: '${e}' is a directory. Please specify a file path.`),process.exit(1));let n=k.basename(e),a=o.folder||"general",i=o.key||j,t=o.tags||"",r=o.alt||`Asset ${n}`;y(),console.log(`\u{1F4E4} Uploading '${n}' (${(s.size/1024).toFixed(1)} KB) to folder '${a}'...
`);let w=g.readFileSync(e),A=k.extname(n).toLowerCase(),E={".png":"image/png",".jpg":"image/jpeg",".jpeg":"image/jpeg",".webp":"image/webp",".svg":"image/svg+xml",".gif":"image/gif",".mp4":"video/mp4",".webm":"video/webm",".pdf":"application/pdf",".json":"application/json"}[A]||"application/octet-stream";try{let l=await fetch(`${d}/v1/upload`,{method:"POST",headers:{Authorization:`Bearer ${i}`,"Content-Type":E,"x-filename":n,"x-folder":a,"x-tags":t,"x-alt":r},body:w}),c=await l.json();(!l.ok||!c.success)&&(console.error("\u274C Upload failed:",c.error||l.statusText),process.exit(1)),console.log(`\u2705 \x1B[32mUpload Successful!\x1B[0m
`),console.log(`\u2022 Object Key : ${c.data.key}`),console.log(`\u2022 CDN URL    : \x1B[36m${c.data.cdnUrl}\x1B[0m`),console.log(`\u2022 Size       : ${(c.data.size/1024).toFixed(1)} KB`),console.log(`\u2022 Mime Type  : ${c.data.contentType}
`)}catch(l){console.error("\u274C Network error during upload:",l.message),process.exit(1)}}async function R(){let e=T(p);if(u==="keys")if(m==="list")await v();else if(m==="create")await S(e);else if(m==="revoke"){let o=p[2];await h(o)}else x();else if(u==="upload"){let o=p[1];await b(o,e)}else x()}R().catch(console.error);
//# sourceMappingURL=cli.mjs.map