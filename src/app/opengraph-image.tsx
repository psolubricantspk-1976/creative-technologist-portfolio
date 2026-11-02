import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "radial-gradient(900px 520px at 12% 8%, #2a1608 0%, #0b0c0f 55%, #08090b 100%)",
          fontFamily: "sans-serif",
          color: "#f7f3ec",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #ffc27d 0%, #ff7a1f 100%)",
              color: "#1b0c02",
              fontSize: 40,
              fontWeight: 700,
            }}
          >
            X
          </div>
          <div
            style={{
              fontSize: 30,
              letterSpacing: 3,
              fontWeight: 600,
              color: "#f7f3ec",
            }}
          >
            GLOBALFORGEX
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 82,
              fontWeight: 700,
              letterSpacing: -3.5,
              lineHeight: 1.02,
            }}
          >
            Forge your edge.
          </div>
          <div
            style={{
              fontSize: 82,
              fontWeight: 700,
              letterSpacing: -3.5,
              lineHeight: 1.02,
              background: "linear-gradient(100deg, #ffd2a3, #ff6a12)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Fund your ambition.
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 27,
              color: "#a8a49c",
              maxWidth: 900,
            }}
          >
            Simulated trading evaluations · up to $200K virtual capital · rewards
            up to 92%
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 16,
            fontSize: 21,
            color: "#ffb066",
            letterSpacing: 1.5,
          }}
        >
          <span>TRANSPARENT RULES</span>
          <span style={{ color: "#3d3a35" }}>·</span>
          <span>INSTANT ACCESS</span>
          <span style={{ color: "#3d3a35" }}>·</span>
          <span>SIMULATED ENVIRONMENT</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
