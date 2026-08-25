"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { motion } from "../gsap-motion";
import { SponsorCard } from "../sponsors/SponsorCard";
import { SPONSORS } from "../sponsors/SponsorsData";

/**
 * Client-only: the scatter rolls fresh random positions on every page load,
 * so it must never run during SSR (a server/client split would desync the
 * hydration styles). It mounts right after hydration.
 */
const SponsorDecorations = dynamic(
  () => import("../sponsors/SponsorDecorations"),
  { ssr: false },
);

export function Sponsors() {
  if (SPONSORS.length === 0) return null;

  return (
    <div className="sponsors-wrap">
      <section id="sponsors" className="sponsors">
        <SponsorDecorations />

        <motion.h2
          className="sponsors__title"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          Our Sponsors
        </motion.h2>

        {/* Centres whatever is announced. One card sits mid-section; adding
            Silver and Bronze fills out the row without a layout change. */}
        <div className="sponsors__row">
          {SPONSORS.map((sponsor, index) => (
            <SponsorCard key={sponsor.id} sponsor={sponsor} index={index} />
          ))}
        </div>
      </section>

      {/* Decorative starburst. Rendered outside the section (the wrapper does
          not clip) so its top half can straddle the boundary with the
          previous section instead of being cut by .sponsors' overflow. It
          stays hidden from the accessibility tree and never takes pointer
          events. */}
      <Image
        src="/sun-spons.svg"
        alt=""
        width={214}
        height={121}
        aria-hidden="true"
        className="sponsors__sun sponsors__sun--lead"
      />
    </div>
  );
}
