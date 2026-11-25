"use client"
import Link from "next/link"
import { useMindCareLanguage } from "@/lib/use-mindcare-language"
export default function AuditPage(){
 const [language]=useMindCareLanguage()
 const t=language==="RW"?{title:"Isuzuma ry'ingaruka z'inzoga",body:"AUDIT ni isuzuma rifasha inzobere kumenya ingaruka zijyanye n'inzoga. Ganira n'umuganga kugira ngo ukore isuzuma rikubereye.",back:"Subira inyuma"}:language==="FR"?{title:"Dépistage des risques liés à l’alcool",body:"AUDIT aide à identifier les risques liés à l’alcool. Un professionnel de santé peut vous proposer un dépistage adapté à votre âge.",back:"Retour"}:{title:"Alcohol risk screening",body:"AUDIT helps identify alcohol-related risks. A healthcare professional can provide screening appropriate to your age and circumstances.",back:"Back"}
 return <main className="min-h-screen bg-[#f5f8fa] p-6 text-[#17324a]"><section className="mx-auto max-w-3xl rounded-3xl border bg-white p-8"><Link href="/assessment" className="text-sm font-bold text-[#0D4A8A]">{t.back}</Link><h1 className="mt-6 text-2xl font-bold">AUDIT · {t.title}</h1><p className="mt-4 leading-7">{t.body}</p></section></main>
}