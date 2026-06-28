"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

/**
 * PageTransition Component
 * Provides clean, cinematic page exit and entry transitions
 * for Next.js client-side navigations using GSAP.
 *
 * Coordinates with the global Lenis instance to reset scroll position.
 */
export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState<React.ReactNode>(children);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevPathnameRef = useRef<string>(pathname);

  useEffect(() => {
    // If route pathname changed
    if (pathname !== prevPathnameRef.current) {
      prevPathnameRef.current = pathname;
      setIsTransitioning(true);

      const container = containerRef.current;
      if (container) {
        // 1. Exit animation: Fade out and slide up slightly
        gsap.to(container, {
          opacity: 0,
          y: -24,
          duration: 0.35,
          ease: "power2.in",
          onComplete: () => {
            // 2. Swap page content
            setDisplayChildren(children);

            // 3. Reset scroll position immediately
            window.scrollTo(0, 0);

            // Reset Lenis scroll instance if active
            const win = window as unknown as { lenisInstance?: { scrollTo: (target: number, options: { immediate: boolean }) => void } };
            if (win.lenisInstance) {
              win.lenisInstance.scrollTo(0, { immediate: true });
            }

            // 4. Initial entry state
            gsap.set(container, { y: 24, opacity: 0 });

            // 5. Entrance animation: Fade in and slide up to resting position
            gsap.to(container, {
              opacity: 1,
              y: 0,
              duration: 0.45,
              ease: "power3.out",
              onComplete: () => {
                setIsTransitioning(false);
              },
            });
          },
        });
      } else {
        setDisplayChildren(children);
        setIsTransitioning(false);
      }
    } else {
      // Keep static displayChildren in sync with parent updates when not transitioning
      if (!isTransitioning) {
        setDisplayChildren(children);
      }
    }
  }, [pathname, children, isTransitioning]);

  return (
    <div ref={containerRef} className="w-full min-h-screen origin-top">
      {displayChildren}
    </div>
  );
}
