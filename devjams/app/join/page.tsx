"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import ResponsiveSvg from "../../components/ResponsiveSvg";
import { motion, AnimatePresence } from "../../components/gsap-motion";

export default function JoinPage() {
  const [teamCode, setTeamCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const scaleX = window.innerWidth / 1440;
      const scaleY = window.innerHeight / 1024;
      // Fit within viewport cleanly on any desktop screen height/width
      const fitted = Math.min(1, scaleX, scaleY);
      setScale(fitted);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamCode.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <main className="fixed inset-0 h-screen w-screen bg-black text-white flex items-center justify-center overflow-hidden select-none">
      {/* Top Left GDG Lockup (Exact same as landing) */}
      <header className="hero-header z-30 pointer-events-auto" aria-label="Google Developer Groups">
        <div className="hero-header__row">
          <Link href="/" className="cursor-pointer">
            <motion.div
              className="hero-gdg-lockup"
              initial={false}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src="/assets/gdg-logo-white.svg"
                alt=""
                width={46}
                height={23}
                priority
                className="hero-gdg-lockup__icon"
              />
              <span className="hero-gdg-lockup__wordmark" aria-hidden="true">
                <Image
                  src="/assets/gdg-lockup-line.png"
                  alt=""
                  width={3003}
                  height={300}
                  priority
                  className="hero-gdg-lockup__wordmark-image"
                />
              </span>
              <span className="hero-gdg-lockup__name">
                Vellore Institute of Technology
              </span>
            </motion.div>
          </Link>
        </div>
      </header>

      {/* Top Right Dino Menu Button (Exact same as landing) */}
      <motion.button
        type="button"
        initial={false}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.55, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className={`hero-menu${menuOpen ? " hero-menu--open" : ""} z-40`}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        aria-controls="primary-navigation-sheet"
        aria-pressed={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <ResponsiveSvg
          src="/assets/dino-menu.svg"
          alt=""
          width={63.955}
          height={68.768}
          priority
          className="hero-menu__dino"
        />
        <svg
          className="hero-menu__mark"
          xmlns="http://www.w3.org/2000/svg"
          width="60"
          height="55"
          viewBox="0 0 60 55"
          fill="none"
          aria-hidden="true"
        >
          <path d="M17.465 0.615787L19.1528 1.68895L17.1208 11.336L25.008 5.41198L26.6957 6.48514L20.8016 15.7548L19.6332 15.0119L24.5367 7.30012L24.5107 7.2836L16.7121 13.1545L15.6605 12.4858L17.6688 2.93318L17.6428 2.91667L12.7393 10.6284L11.5709 9.88547L17.465 0.615787Z" fill="white"/>
          <path d="M32.2433 24.9556C31.4734 25.4392 30.7203 25.6186 29.9841 25.4938C29.2479 25.369 28.5709 24.9776 27.9532 24.3196C27.5179 23.856 27.2136 23.382 27.0402 22.8976C26.8738 22.4207 26.8165 21.94 26.868 21.4555C26.9196 20.9709 27.0761 20.4933 27.3377 20.0227C27.6063 19.5595 27.9541 19.1133 28.3813 18.6842C28.8224 18.27 29.2894 17.9582 29.7822 17.7488C30.275 17.5394 30.7683 17.428 31.2621 17.4145C31.763 17.4085 32.2426 17.4999 32.7011 17.6885C33.1665 17.8845 33.5853 18.1807 33.9574 18.5771C34.4418 19.093 34.7335 19.621 34.8326 20.1611C34.9461 20.7016 34.9332 21.2273 34.7937 21.7381C34.6613 22.2564 34.4357 22.7354 34.1171 23.1752C33.8055 23.6226 33.4669 24.0037 33.1014 24.3187L29.0262 19.978C28.7649 20.2092 28.55 20.4672 28.3813 20.7522C28.2201 21.0372 28.1065 21.3283 28.0405 21.6255C27.9806 21.9228 27.989 22.2045 28.0658 22.4707C28.1487 22.7369 28.3072 22.9734 28.5413 23.1802C28.7753 23.3871 29.0664 23.5358 29.4145 23.6263C29.7626 23.7169 30.1345 23.7252 30.5302 23.6513C30.932 23.5712 31.3256 23.3888 31.7109 23.1041L32.2433 24.9556Z" fill="black"/>
          <path d="M39.9783 29.8745L40.4978 30.9903L39.3542 31.5228L39.3671 31.5507C40.4706 31.6365 41.2713 32.2141 41.7692 33.2834C41.99 33.7576 42.1089 34.183 42.1259 34.5598C42.1429 34.9365 42.0803 35.2767 41.9391 35.5802C41.7976 35.8837 41.5814 36.1484 41.2906 36.3743C41.0135 36.6052 40.6796 36.8115 40.2891 36.9933L35.547 39.2013L34.995 38.0158L39.8766 35.7429C40.3229 35.5351 40.6156 35.2404 40.7547 34.8588C40.8939 34.4772 40.8574 34.0587 40.6452 33.603C40.4764 33.2404 40.2734 32.9503 40.0362 32.7326C39.8034 32.5242 39.5436 32.3793 39.2568 32.2978C38.97 32.2163 38.6655 32.1942 38.3432 32.2311C38.0346 32.2729 37.7177 32.3696 37.3922 32.5212L33.3196 34.4174L32.7676 33.2319L39.9783 29.8745Z" fill="white"/>
          <path d="M36.5274 51.7389L36.4904 50.5087L37.7514 50.4707L37.7505 50.44C37.2501 50.178 36.8755 49.8352 36.6267 49.4117C36.3882 48.9879 36.2602 48.4838 36.2426 47.8995C36.2269 47.3766 36.2804 46.9389 36.4032 46.5863C36.5365 46.2334 36.7276 45.9455 36.9775 45.7225C37.2273 45.4995 37.5251 45.3366 37.8709 45.2339C38.2272 45.141 38.6207 45.0881 39.0513 45.0752L44.2798 44.9179L44.3192 46.225L38.9369 46.387C38.4448 46.4018 38.0595 46.557 37.7811 46.8527C37.5027 47.1484 37.371 47.5474 37.3861 48.0498C37.3982 48.4496 37.47 48.7912 37.6017 49.0745C37.7336 49.3682 37.9153 49.6089 38.1467 49.7969C38.3781 49.9849 38.6439 50.1206 38.944 50.2039C39.2546 50.2972 39.5893 50.3384 39.9482 50.3277L44.4386 50.1925L44.4779 51.4997L36.5274 51.7389Z" fill="white"/>
          <path d="M32.7789 22.4843C32.97 22.283 33.1196 22.0572 33.2278 21.8068C33.3422 21.5632 33.4013 21.3141 33.4052 21.0595C33.422 20.8054 33.3833 20.5524 33.2891 20.3003C33.2078 20.0488 33.0671 19.8144 32.8669 19.5972C32.6604 19.3733 32.432 19.2072 32.1816 19.099C31.9443 18.9914 31.6984 18.9356 31.4437 18.9318C31.1891 18.928 30.9358 18.9732 30.6837 19.0675C30.4384 19.1555 30.2077 19.2866 29.9916 19.4607L32.7789 22.4843Z" fill="black"/>
        </svg>
      </motion.button>

      {/* Navigation Drawer Menu (Exact same as landing) */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              type="button"
              className="hero-nav__backdrop z-40"
              aria-label="Close navigation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.nav
              id="primary-navigation-sheet"
              className="hero-nav z-50"
              initial={{ width: "68px", opacity: 0 }}
              animate={{ width: "var(--hero-nav-open-width)", opacity: 1 }}
              exit={{ width: "68px", opacity: 0 }}
              transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: "right center" }}
              aria-label="Primary navigation"
            >
              <div className="hero-nav__sheet-head">
                <h2 className="hero-nav__sheet-title">Menu</h2>
                <button
                  type="button"
                  className="hero-nav__close"
                  aria-label="Close navigation"
                  onClick={() => setMenuOpen(false)}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <motion.div
                className="hero-nav__links"
                initial={{ opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.22, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link className="hero-nav__link" href="/#home" onClick={() => setMenuOpen(false)}>
                  Home
                </Link>
                <Link className="hero-nav__link" href="/#about" onClick={() => setMenuOpen(false)}>
                  About
                </Link>
                <Link className="hero-nav__link" href="/#tracks" onClick={() => setMenuOpen(false)}>
                  Tracks
                </Link>
                <Link className="hero-nav__link" href="/#gallery" onClick={() => setMenuOpen(false)}>
                  Gallery
                </Link>
                <Link className="hero-nav__link" href="/#faqs" onClick={() => setMenuOpen(false)}>
                  FAQs
                </Link>
                <Link className="hero-nav__link" href="/#contact" onClick={() => setMenuOpen(false)}>
                  Contact
                </Link>
                <Link className="hero-nav__link hero-nav__link--active" href="/join" onClick={() => setMenuOpen(false)}>
                  Join Team
                </Link>
              </motion.div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* 1440x1024 Canvas Container that scales smoothly to fit viewport with zero scroll */}
      <div
        className="relative origin-center overflow-hidden flex-shrink-0"
        style={{
          width: "1440px",
          height: "1024px",
          transform: `scale(${scale})`,
        }}
      >
        {/* Group 1948755623 - Left Form Container */}
        <div
          className="absolute z-20 flex flex-col justify-between"
          style={{
            width: "590px",
            height: "296px",
            left: "94px",
            top: "calc(50% - 296px / 2)",
          }}
        >
          {/* Title: Join A Team */}
          <h1
            className="text-white font-bold tracking-normal leading-none select-none m-0"
            style={{
              fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif',
              fontSize: "64px",
              width: "457.996px",
              height: "81px",
              display: "flex",
              alignItems: "center",
            }}
          >
            Join A Team
          </h1>

          {/* Subtitle / Prompt: Enter Your Team's Code */}
          <p
            className="text-white font-normal m-0 select-none"
            style={{
              fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif',
              fontSize: "24px",
              lineHeight: "1.2",
              width: "561.3px",
              height: "36px",
              display: "flex",
              alignItems: "center",
            }}
          >
            Enter Your Team’s Code
          </p>

          {/* Form with Input and Submit Button */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-[590px]">
            {/* Input Field */}
            <input
              type="text"
              value={teamCode}
              onChange={(e) => setTeamCode(e.target.value)}
              placeholder="Enter code here"
              className="w-[590px] h-[59px] bg-transparent text-white placeholder-white/40 border border-white/40 focus:border-white focus:outline-none transition-colors"
              style={{
                borderRadius: "9.08px",
                padding: "7.26px 36.31px",
                fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif',
                fontSize: "20px",
              }}
              required
            />

            {/* Frame 1948754780 - Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              className="w-[590px] h-[48px] bg-white text-black font-bold flex items-center justify-center cursor-pointer hover:bg-neutral-100 transition-all border-none"
              style={{
                borderRadius: "35px",
                padding: "9px 111px",
                fontFamily: 'var(--font-google-sans), "Google Sans", sans-serif',
                fontSize: "18px",
                gap: "14px",
              }}
            >
              {isSubmitting ? "Joining..." : "Join Team"}
            </motion.button>
          </form>
        </div>

        {/* Right Side 3 Logos Stack (Landing Frame 2 Logos) */}
        <div
          className="absolute pointer-events-none z-10"
          style={{
            width: "467.63px",
            height: "1024.58px",
            left: "880px",
            top: "-1px",
          }}
          aria-hidden="true"
        >
          {/* Web Track Logo */}
          <div
            className="absolute"
            style={{
              width: "453.89px",
              height: "453.89px",
              left: "6.8px",
              top: "0px",
              mixBlendMode: "screen",
            }}
          >
            <ResponsiveSvg
              src="/assets/web.svg"
              alt="Web Track"
              width={454}
              height={454}
              priority
              className="w-full h-full object-contain"
            />
          </div>

          {/* Maps Logo */}
          <div
            className="absolute"
            style={{
              width: "364.11px",
              height: "464.37px",
              left: "51.16px",
              top: "386.83px",
            }}
          >
            <ResponsiveSvg
              src="/assets/maps.svg"
              alt="Google Maps"
              width={365}
              height={465}
              priority
              className="w-full h-full object-contain"
            />
          </div>

          {/* Android Track Logo */}
          <div
            className="absolute"
            style={{
              width: "467.63px",
              height: "285.74px",
              left: "0px",
              top: "738.83px",
              mixBlendMode: "screen",
            }}
          >
            <ResponsiveSvg
              src="/assets/android.svg"
              alt="Android Track"
              width={468}
              height={286}
              priority
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
