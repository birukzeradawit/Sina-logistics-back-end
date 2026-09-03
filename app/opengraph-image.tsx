import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "SINA Supplies and Logistics PLC";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#111112",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          fontFamily: "system-ui, sans-serif",
          border: "12px solid #1c1c1e",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "8px",
                background: "#FFCB47",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                fontWeight: 900,
                color: "#111112",
              }}
            >
              S
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ color: "#F7F5F1", fontSize: "28px", fontWeight: 800, letterSpacing: "0.08em" }}>
                SINA
              </span>
              <span style={{ color: "#8b8a85", fontSize: "14px", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                Supplies &amp; Logistics PLC
              </span>
            </div>
          </div>

          <div
            style={{
              background: "rgba(232, 148, 12, 0.15)",
              border: "1px solid rgba(232, 148, 12, 0.4)",
              color: "#FFCB47",
              padding: "8px 18px",
              borderRadius: "999px",
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Addis Ababa &bull; Ethiopia
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "950px" }}>
          <div
            style={{
              color: "#E8940C",
              fontSize: "18px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Single-Source Corporate Partner
          </div>
          <div
            style={{
              color: "#FFFFFF",
              fontSize: "52px",
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}
          >
            Your goods, our priority.
          </div>
          <div
            style={{
              color: "#9C9A94",
              fontSize: "22px",
              lineHeight: 1.45,
            }}
          >
            Integrated procurement, logistics coordination, event organizing, property management, and commercial trade across Ethiopia.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255, 255, 255, 0.12)",
            paddingTop: "24px",
            color: "#8b8a85",
            fontSize: "16px",
          }}
        >
          <span>🌐 www.sinatrading.et</span>
          <span>📍 Lemi Kura Sub-city, Addis Ababa</span>
          <span>📞 +251 90-969-6932</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
