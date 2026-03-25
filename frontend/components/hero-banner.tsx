"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const DEFAULT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1642792595416-3273bd04d14b?auto=format&fit=crop&w=1920&q=80";

type HeroBannerProps = {
  label?: string;
  className?: string;
};

export function HeroBanner({ label = "Crypto Instrument platform", className }: HeroBannerProps) {
  const imageSrc = process.env.NEXT_PUBLIC_HERO_IMAGE_URL ?? DEFAULT_HERO_IMAGE;
  const videoSrc = process.env.NEXT_PUBLIC_HERO_VIDEO_URL;
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const showVideo = Boolean(videoSrc) && !reduceMotion;

  return (
    <div
      className={["pointer-events-none absolute inset-0 overflow-hidden", className ?? ""].join(" ")}
      aria-hidden
    >
      <span className="sr-only">{label}</span>

      {showVideo ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={imageSrc}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : (
        <Image
          src={imageSrc}
          alt=""
          fill
          priority
          fetchPriority="high"
          className="object-cover"
          sizes="100vw"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/40" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-transparent to-ink/50" aria-hidden />
      <div className="absolute inset-0 bg-gold-500/5 mix-blend-soft-light" aria-hidden />
    </div>
  );
}
