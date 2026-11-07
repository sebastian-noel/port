import { ImageResponse } from "next/og";

export const alt = "Sebastian Noel. Software, hardware, and curiosity.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function SocialImage() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", background: "#6395ee", padding: 48 }}><div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "100%", background: "#244c86", color: "white", padding: 64 }}><div style={{ fontSize: 24, marginBottom: 28 }}>SOFTWARE, HARDWARE & CURIOSITY</div><div style={{ fontSize: 96, fontWeight: 700 }}>Sebastian Noel</div><div style={{ fontSize: 30, color: "#ffcc66", marginTop: 36 }}>snoel.dev</div></div></div>, size);
}
