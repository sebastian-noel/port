import { ImageResponse } from "next/og";
export const alt = "Sebastian Noel · snoel.dev";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function SocialImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: "#6395ee",
        color: "#142b4a",
        padding: 80,
      }}
    >
      <div
        style={{
          fontSize: 96,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
        }}
      >
        Sebastian Noel
        <div
          style={{
            width: 12,
            height: 90,
            marginLeft: 20,
            background: "#ff8a75",
          }}
        />
      </div>
      <div style={{ fontSize: 30, marginTop: 36 }}>snoel.dev</div>
    </div>,
    size,
  );
}
