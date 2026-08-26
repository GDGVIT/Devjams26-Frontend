"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "@/components/gsap-motion";

interface GDGLockupProps {
  className?: string;
  animate?: boolean;
}

export function GDGLockup({ className = "", animate = true }: GDGLockupProps) {
  const content = (
    <div className={`hero-gdg-lockup group select-none ${className}`}>
      {/* Same single lockup asset the site header uses, so the portal and the
          landing page cannot drift apart. */}
      <Image
        src="/assets/gdg-logo.svg"
        alt="Google Developer Groups On Campus, VIT Vellore"
        width={297}
        height={44}
        priority
        className="hero-gdg-lockup__image transition-transform group-hover:scale-105"
      />
    </div>
  );

  return (
    <Link href="/" className="cursor-pointer inline-flex items-center" aria-label="Google Developer Groups - Home">
      {animate ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {content}
        </motion.div>
      ) : (
        content
      )}
    </Link>
  );
}
