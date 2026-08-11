"use server";

import { cookies } from "next/headers";
import { type Locale, locales } from "./config";

export async function setLocale(locale: Locale) {
  const cookieStore = await cookies();
  cookieStore.set("locale", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 año
    sameSite: "lax",
  });
}

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value;
  if (locale && locales.includes(locale as Locale)) {
    return locale as Locale;
  }
  return "es";
}
