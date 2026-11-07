import Link from "next/link";

export default function NotFound() {
  return <div className="wrap page-heading"><p className="eyebrow">404</p><h1>This page wandered off.</h1><p>The address may have changed, or this page doesn’t exist yet.</p><Link className="button" href="/">Back to home →</Link></div>;
}
