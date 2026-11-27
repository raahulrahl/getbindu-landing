"use client";

import Image from "next/image";
import { useState } from "react";

export function IntegrationLogo({ name, src }: { name: string; src: string }) {
  const [failedSrc, setFailedSrc] = useState<string>();

  return (
    <span className="integration-logo" aria-hidden="true">
      {failedSrc === src ? (
        <span className="integration-logo-fallback">{name.match(/[\p{L}\p{N}]/u)?.[0]?.toUpperCase() ?? "?"}</span>
      ) : (
        <Image
          src={src}
          alt=""
          width={48}
          height={48}
          unoptimized
          referrerPolicy="no-referrer"
          onError={() => setFailedSrc(src)}
        />
      )}
    </span>
  );
}
