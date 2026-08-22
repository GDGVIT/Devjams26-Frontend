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
      <Image
        src="/assets/gdg-logo-white.svg"
        alt="GDG Logo"
        width={46}
        height={23}
        priority
        className="hero-gdg-lockup__icon transition-transform group-hover:scale-105"
      />
      <span className="hero-gdg-lockup__wordmark" aria-hidden="true">
        <Image
          src="/assets/gdg-lockup-line.png"
          alt="Google Developer Groups"
          width={3003}
          height={300}
          priority
          className="hero-gdg-lockup__wordmark-image"
        />
      </span>
      <span className="hero-gdg-lockup__name">
        On Campus VIT Vellore
      </span>
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
