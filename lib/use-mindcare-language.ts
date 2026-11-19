"use client"

import { useEffect, useState } from "react"

export type MindCareLanguage = "EN" | "FR" | "RW"
const STORAGE_KEY = "mindcare-language"

export function useMindCareLanguage() {
  const [language, setLanguage] = useState<MindCareLanguage>("EN")

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (saved === "EN" || saved === "FR" || saved === "RW") setLanguage(saved)
    } catch {
      // Browser storage may be unavailable; keep English as the fallback.
    }
  }, [])

  function changeLanguage(next: MindCareLanguage) {
    setLanguage(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Continue using the selected language for the current page.
    }
  }

  return [language, changeLanguage] as const
}
