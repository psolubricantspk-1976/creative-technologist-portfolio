import Image from "next/image";
import Link from "next/link";

/**
 * Brand lockup: the FG / bull monogram plus the "ForgeX Global" wordmark.
 *
 * Both are transparent PNGs cut from the supplied artwork. The wordmark is
 * recoloured to a warm paper white (with the X left ember orange) so the
 * lockup sits correctly on the dark UI — the original navy would disappear.
 */
export function Logo({
  compact = false,
  href = "/",
}: {
  compact?: boolean;
  href?: string;
}) {
  return (
    <Link href={href} className="gfx-logo" aria-label="ForgeX Global home">
      <Image
        className="gfx-logo-mark"
        src="/brand/forgex-mark.png"
        alt=""
        width={239}
        height={220}
        sizes="48px"
        loading="eager"
        fetchPriority="high"
      />
      {!compact && (
        <Image
          className="gfx-logo-word"
          src="/brand/forgex-word.png"
          alt=""
          width={595}
          height={96}
          sizes="120px"
        />
      )}
    </Link>
  );
}
