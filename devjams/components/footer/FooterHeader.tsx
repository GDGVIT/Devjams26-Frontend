"use client";

import { motion } from "motion/react";

export function FooterHeader() {
  return (
    <div className="w-full flex flex-col gap-3 sm:gap-4 md:gap-6 mb-1 sm:mb-2">
      {/* Top Row: Headline + Social Media Icons */}
      <div className="w-full flex flex-col md:flex-row md:items-start justify-between gap-3 sm:gap-4">
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-bold text-white tracking-tight max-w-4xl leading-[1.08] break-words"
          style={{ fontSize: "clamp(2rem, 5.2vw, 84px)" }}
        >
          Wanna build something cool?
        </motion.h2>

        {/* Social Icons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center gap-2.5 sm:gap-3.5 self-start md:self-auto pt-1 sm:pt-2 flex-wrap"
        >
          {/* Medium */}
          <a
            href="https://medium.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Medium"
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/80 hover:text-white transition-all hover:scale-110"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
              <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42c1.87 0 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
            </svg>
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/80 hover:text-white transition-all hover:scale-110"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>

          {/* X / Twitter */}
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X (Twitter)"
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/80 hover:text-white transition-all hover:scale-110"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/80 hover:text-white transition-all hover:scale-110"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
            </svg>
          </a>
        </motion.div>
      </div>

      {/* Second Row: Let's talk tech + Contact Us aligned horizontally */}
      <div className="w-full flex flex-col md:flex-row md:items-start justify-between gap-3 sm:gap-4 pt-1">
        {/* Let's talk tech */}
        <motion.a
          href="mailto:contact@devjams.in"
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="font-normal text-white hover:text-white flex items-center gap-3 group transition-colors cursor-pointer leading-tight self-start"
          style={{ fontSize: "clamp(1.25rem, 2.8vw, 42px)" }}
        >
          <span>Let’s talk tech</span>
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">
            →
          </span>
        </motion.a>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col items-start md:items-end text-left md:text-right gap-1.5"
        >
          <h3
            className="font-normal text-white tracking-tight leading-tight"
            style={{ fontSize: "clamp(1.25rem, 2.8vw, 42px)" }}
          >
            Contact us
          </h3>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-gray-300">
            {/* Person 1 */}
            <div className="flex flex-col gap-0.5">
              <span
                className="font-normal text-white leading-snug"
                style={{ fontSize: "clamp(0.85rem, 1.4vw, 20px)" }}
              >
                Meda Varshith Kumar Reddy
              </span>
              <a
                href="tel:+919686352426"
                className="hover:text-white transition-colors text-gray-400 leading-snug"
                style={{ fontSize: "clamp(0.8rem, 1.25vw, 18px)" }}
              >
                +919686352426
              </a>
              <a
                href="mailto:varshithisworking@gmail.com"
                className="hover:text-white transition-colors text-gray-400 break-all sm:break-normal leading-snug"
                style={{ fontSize: "clamp(0.8rem, 1.25vw, 18px)" }}
              >
                varshithisworking@gmail.com
              </a>
            </div>

            {/* Person 2 */}
            <div className="flex flex-col gap-0.5">
              <span
                className="font-normal text-white leading-snug"
                style={{ fontSize: "clamp(0.85rem, 1.4vw, 20px)" }}
              >
                Reenu B
              </span>
              <a
                href="tel:+919656463672"
                className="hover:text-white transition-colors text-gray-400 leading-snug"
                style={{ fontSize: "clamp(0.8rem, 1.25vw, 18px)" }}
              >
                +919656463672
              </a>
              <a
                href="mailto:reenubiju10@gmail.com"
                className="hover:text-white transition-colors text-gray-400 break-all sm:break-normal leading-snug"
                style={{ fontSize: "clamp(0.8rem, 1.25vw, 18px)" }}
              >
                reenubiju10@gmail.com
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
