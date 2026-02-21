import { NextResponse } from "next/server"

export async function POST() {
  // In a real app, validate credentials here.
  // For demo, accept any payload and set a simple session cookie.
  const res = NextResponse.json({ ok: true })
  res.cookies.set("auth", "yes", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
  return res
}
