"use client";

import Image from "next/image";
import { motion } from "../gsap-motion";
import { SponsorCard } from "../sponsors/SponsorCard";
import { SPONSORS } from "../sponsors/SponsorsData";

export function Sponsors() {
  if (SPONSORS.length === 0) return null;

  return (
    <section id="sponsors" className="sponsors">
      {/* Decorative starburst. Purely ornamental, so it is hidden from the
          accessibility tree and never takes pointer events. */}
      <Image
        src="/sun-spons.svg"
        alt=""
        width={214}
        height={121}
        aria-hidden="true"
        className="sponsors__sun sponsors__sun--lead"
      />

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
  );
}
