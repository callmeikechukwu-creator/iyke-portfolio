import React from "react";
import {
  SiReact,
  SiTypescript,
  SiNextdotjs,
  SiNodedotjs,
  SiTailwindcss,
  SiPostgresql,
  SiPrisma,
  SiRedis,
  SiMongodb,
  SiExpress,
  SiSocketdotio,
  SiPuppeteer,
  SiFigma,
  SiDocker,
} from "react-icons/si";
import { LuDatabase, LuCpu, LuRadio, LuCircleHelp } from "react-icons/lu";

interface IconProps {
  className?: string;
}

// Individual Exports for compatibility
export const ReactIcon = ({ className }: IconProps) => <SiReact className={className} />;
export const TypescriptIcon = ({ className }: IconProps) => <SiTypescript className={className} />;
export const NextjsIcon = ({ className }: IconProps) => <SiNextdotjs className={className} />;
export const NodejsIcon = ({ className }: IconProps) => <SiNodedotjs className={className} />;
export const TailwindIcon = ({ className }: IconProps) => <SiTailwindcss className={className} />;
export const PostgresqlIcon = ({ className }: IconProps) => <SiPostgresql className={className} />;
export const PrismaIcon = ({ className }: IconProps) => <SiPrisma className={className} />;
export const RedisIcon = ({ className }: IconProps) => <SiRedis className={className} />;
export const MongodbIcon = ({ className }: IconProps) => <SiMongodb className={className} />;
export const ExpressIcon = ({ className }: IconProps) => <SiExpress className={className} />;
export const SocketioIcon = ({ className }: IconProps) => <SiSocketdotio className={className} />;
export const PuppeteerIcon = ({ className }: IconProps) => <SiPuppeteer className={className} />;
export const WebsocketsIcon = ({ className }: IconProps) => <LuRadio className={className} />;
export const FallbackIcon = ({ className }: IconProps) => <LuCircleHelp className={className} />;

export function getTechIconComponent(techName: string, className = "w-3.5 h-3.5") {
  const name = techName.toLowerCase();

  if (name.includes("react")) {
    return <SiReact className={`${className} text-[#61DAFB] shrink-0`} />;
  }
  if (name.includes("typescript") || name === "ts") {
    return <SiTypescript className={`${className} text-[#3178C6] rounded-[2px] shrink-0`} />;
  }
  if (name.includes("next.js") || name.includes("nextjs")) {
    return <SiNextdotjs className={`${className} text-current shrink-0`} />;
  }
  if (name.includes("node")) {
    return <SiNodedotjs className={`${className} text-[#339933] shrink-0`} />;
  }
  if (name.includes("tailwind")) {
    return <SiTailwindcss className={`${className} text-[#06B6D4] shrink-0`} />;
  }
  if (name.includes("postgresql") || name.includes("postgres")) {
    return <SiPostgresql className={`${className} text-[#4169E1] shrink-0`} />;
  }
  if (name.includes("prisma")) {
    return <SiPrisma className={`${className} text-current shrink-0`} />;
  }
  if (name.includes("redis")) {
    return <SiRedis className={`${className} text-[#FF3E00] shrink-0`} />;
  }
  if (name.includes("mongodb") || name.includes("mongo")) {
    return <SiMongodb className={`${className} text-[#47A248] shrink-0`} />;
  }
  if (name.includes("express")) {
    return <SiExpress className={`${className} text-current shrink-0`} />;
  }
  if (name.includes("socket")) {
    return <SiSocketdotio className={`${className} text-current shrink-0`} />;
  }
  if (name.includes("puppeteer")) {
    return <SiPuppeteer className={`${className} text-[#04D414] shrink-0`} />;
  }
  if (name.includes("websocket")) {
    return <LuRadio className={`${className} text-[#FF007F] shrink-0`} />;
  }
  if (name.includes("figma") || name.includes("design") || name.includes("ui/ux") || name.includes("ux")) {
    return <SiFigma className={`${className} shrink-0`} />;
  }
  if (name.includes("devops") || name.includes("docker") || name.includes("ci/cd")) {
    return <SiDocker className={`${className} text-[#2496ED] shrink-0`} />;
  }
  if (name.includes("api") || name.includes("rest")) {
    return <LuCpu className={`${className} text-[#00D8FF] shrink-0`} />;
  }
  if (name.includes("stack") || name.includes("full")) {
    return <LuDatabase className={`${className} text-current shrink-0`} />;
  }

  return <LuCircleHelp className={`${className} text-muted shrink-0`} />;
}
