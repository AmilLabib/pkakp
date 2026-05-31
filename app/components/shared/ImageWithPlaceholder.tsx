"use client";

import React, { useState } from "react";
import Image from "next/image";

export default function ImageWithPlaceholder({
  src,
  alt,
  className,
  fill = false,
  width,
  height,
}: {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
}) {
  const [loaded, setLoaded] = useState(false);

  const isRemote = /^https?:\/\//i.test(src) || /^\/\//.test(src);

  return (
    <div className={`relative ${fill ? "w-full h-full" : ""}`}>
      {!loaded && (
        <div
          aria-hidden
          className="absolute inset-0 bg-gray-100 animate-pulse z-0"
        />
      )}
      <Image
        src={src}
        alt={alt}
        {...(fill ? { fill: true } : {})}
        onLoad={() => setLoaded(true)}
        className={`${className || ""} transition-opacity duration-300 ease-out ${
          loaded ? "opacity-100 z-10" : "opacity-0 z-10"
        }`}
        {...(width ? { width } : {})}
        {...(height ? { height } : {})}
        {...(isRemote ? { unoptimized: true } : {})}
      />
    </div>
  );
}
