import React from "react";

interface IconProps {
  className?: string;
}

export function ReactIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg className={`${className} text-[#61DAFB] shrink-0`} viewBox="-10.5 -9.45 21 18.9" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="0" cy="0" r="2" fill="currentColor" />
      <ellipse rx="10" ry="4.5" stroke="currentColor" strokeWidth="1.2" />
      <ellipse rx="10" ry="4.5" stroke="currentColor" strokeWidth="1.2" transform="rotate(60)" />
      <ellipse rx="10" ry="4.5" stroke="currentColor" strokeWidth="1.2" transform="rotate(120)" />
    </svg>
  );
}

export function TypescriptIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg className={`${className} rounded-[2px] shrink-0`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="#3178C6" />
      <text x="88" y="90" fill="white" fontSize="56" fontWeight="bold" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" textAnchor="end">TS</text>
    </svg>
  );
}

export function NextjsIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg className={`${className} text-[var(--color-ink)] shrink-0`} viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="90" cy="90" r="90" fill="currentColor" />
      <path d="M128 135L90 85V135H80V55H90L128 105V55H138V135H128Z" fill="var(--color-base)" />
    </svg>
  );
}

export function NodejsIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg className={`${className} text-[#5FA04E] shrink-0`} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L3.5 7v10L12 22l8.5-5V7L12 2zm-1 16.5l-5-2.9v-5.8l5 2.9v5.8zm1-7.2L7 8.4l5-2.9 5 2.9-5 2.9zm6 4.3l-5 2.9V12.2l5-2.9v5.8z" />
    </svg>
  );
}

export function TailwindIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg className={`${className} text-[#06B6D4] shrink-0`} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 14.881 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 15.121 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.392 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 9.121 12 6.001 12z" />
    </svg>
  );
}

export function PostgresqlIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg className={`${className} text-[#336791] shrink-0`} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M37.9 23.4c.5-1.5.8-2.9.8-4.4V10.8c-2.9.7-5.5.7-8.1 0-1.8.8-3.7 1.3-5.6 1.5-1.4-.4-2.9-.6-4.4-.6h-.6c-1.5 0-3 .2-4.4.6-1.9-.2-3.8-.7-5.6-1.5-2.6.7-5.2.7-8.1 0v8.2c0 1.5.3 2.9.8 4.4.7 1.8 1.8 3.5 3.2 4.9C7.3 30 9.2 31.2 11.3 32c1.4.5 2.9.8 4.4.8h1.1l3 7.8c.2.5.7.8 1.2.8h6c.5 0 1-.3 1.2-.8l3-7.8h1.1c1.5 0 3-.3 4.4-.8 2.1-.8 4-2 5.4-3.6 1.4-1.4 2.5-3.1 3.2-4.9z" fill="currentColor"/>
      <path d="M18.8 22c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm14.4 0c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z" fill="var(--color-base)"/>
    </svg>
  );
}

export function PrismaIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg className={`${className} text-[#2D3748] dark:text-[#E2E8F0] shrink-0`} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.5 15.5L12 2L1.5 15.5L12 22l10.5-6.5zM12 5.5l7 9-7 4.5-7-4.5 7-9z" />
    </svg>
  );
}

export function RedisIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg className={`${className} text-[#D82C20] shrink-0`} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 7l10 5 10-5-10-5zm0 15.5l-8-4v3l8 4 8-4v-3l-8 4zm0-6l-8-4v3l8 4 8-4v-3l-8 4z" />
    </svg>
  );
}

export function MongodbIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg className={`${className} text-[#47A248] shrink-0`} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C11.5 2 7 8 7 13c0 2.8 2.2 5 5 5s5-2.2 5-5c0-5-4.5-11-5-11zm0 14c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z" />
    </svg>
  );
}

export function ExpressIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg className={`${className} text-[var(--color-ink)] shrink-0`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

export function SocketioIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg className={`${className} text-[var(--color-ink)] shrink-0`} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" />
    </svg>
  );
}

export function PuppeteerIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg className={`${className} text-[#00D8FF] shrink-0`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="3" width="20" height="18" rx="2" ry="2" />
      <line x1="2" y1="8" x2="22" y2="8" />
      <line x1="6" y1="21" x2="6" y2="8" />
    </svg>
  );
}

export function WebsocketsIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg className={`${className} text-[var(--color-ink)] shrink-0`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h6a5 5 0 0 0 5-5V9a1 1 0 0 0-1-1h-1z" />
      <path d="M15 2v4" />
      <path d="M9 2v4" />
    </svg>
  );
}

export function FallbackIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg className={`${className} text-muted shrink-0`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  );
}

export function getTechIconComponent(techName: string, className = "w-3.5 h-3.5") {
  const name = techName.toLowerCase();

  if (name.includes("react")) return <ReactIcon className={className} />;
  if (name.includes("typescript") || name === "ts") return <TypescriptIcon className={className} />;
  if (name.includes("next.js") || name.includes("nextjs")) return <NextjsIcon className={className} />;
  if (name.includes("node")) return <NodejsIcon className={className} />;
  if (name.includes("tailwind")) return <TailwindIcon className={className} />;
  if (name.includes("postgresql") || name.includes("postgres")) return <PostgresqlIcon className={className} />;
  if (name.includes("prisma")) return <PrismaIcon className={className} />;
  if (name.includes("redis")) return <RedisIcon className={className} />;
  if (name.includes("mongodb") || name.includes("mongo")) return <MongodbIcon className={className} />;
  if (name.includes("express")) return <ExpressIcon className={className} />;
  if (name.includes("socket")) return <SocketioIcon className={className} />;
  if (name.includes("puppeteer")) return <PuppeteerIcon className={className} />;
  if (name.includes("websocket")) return <WebsocketsIcon className={className} />;

  return <FallbackIcon className={className} />;
}
