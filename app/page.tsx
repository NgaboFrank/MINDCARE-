"use client"

import { useMemo, useState } from "react"
import { generateGuidance } from "@/lib/assessment-engine"
import {
  Activity,
  ArrowUpRight,
  Bell,
  BookOpen,
  Brain,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  ClipboardCheck,
  HeartPulse,
  LayoutDashboard,
  LifeBuoy,
  Menu,
  MessageCircleQuestion,
  Search,
  Settings,
  Globe2,
  LogOut,
  UserRound,
  ShieldCheck,
  Sparkles,
  Target,
  X,
} from "lucide-react"

const french: Record<string, string> = {
  "Workspace": "Espace personnel",
  "Support": "Assistance",
  "Overview": "Vue d’ensemble",
  "Start assessment": "Commencer une évaluation",
  "My assessments": "Mes évaluations",
  "Assessment history": "Historique des évaluations",
  "Wellness insights": "Suivi du bien-être",
  "Resources": "Ressources",
  "My profile": "Mon profil",
  "Settings": "Paramètres",
  "Help & support": "Aide et assistance",
  "Log out": "Se déconnecter",
  "Your privacy matters": "Votre confidentialité compte",
  "Your reflections are private and never used to diagnose you.": "Vos réflexions sont privées et ne servent jamais à établir un diagnostic.",
  "Learn about privacy →": "En savoir plus sur la confidentialité →",
  "Patient portal": "Espace patient",
  "Search your space": "Rechercher",
  "Switch language": "Changer de langue",
  "Notifications": "Notifications",
  "Your weekly reflection is ready to review.": "Votre bilan hebdomadaire est prêt à être consulté.",
  "View updates": "Voir les nouveautés",
  "Open profile menu": "Ouvrir le menu du profil",
  "Good morning, Alex": "Bonjour, Alex",
  "A clear view of your wellbeing, one small step at a time.": "Une vision claire de votre bien-être, un pas à la fois.",
  "Start check-in": "Commencer le bilan",
  "Wellbeing score": "Score de bien-être",
  "Check-in streak": "Jours de suivi consécutifs",
  "Next reflection": "Prochain bilan",
  "Weekly progress": "Progression hebdomadaire",
  "+8% this month": "+8 % ce mois-ci",
  "Best: 18 days": "Record : 18 jours",
  "In 2 days": "Dans 2 jours",
  "Almost there": "Presque terminé",
  "Your wellbeing overview": "Aperçu de votre bien-être",
  "Your self-reported check-ins over the last 30 days": "Vos bilans déclarés au cours des 30 derniers jours",
  "View details": "Voir les détails",
  "Your score": "Votre score",
  "Baseline": "Référence",
  "Trending positively": "Tendance positive",
  "Today's focus": "Objectif du jour",
  "Protect your energy": "Préservez votre énergie",
  "Choose one boundary that gives you a little more room today.": "Fixez une limite qui vous laisse un peu plus d’espace aujourd’hui.",
  "2-minute practice": "Exercice de 2 minutes",
  "Write down one thing you can say no to.": "Notez une chose à laquelle vous pouvez dire non.",
  "Open guided practice": "Ouvrir l’exercice guidé",
  "Ask MindCare": "Demander à MindCare",
  "Guided support": "Accompagnement guidé",
  "Ask a wellbeing question. You'll receive practical, safety-aware guidance — not a diagnosis.": "Posez une question sur votre bien-être. Vous recevrez des conseils pratiques et prudents, pas un diagnostic.",
  "For example: How can I calm down before a difficult conversation?": "Par exemple : Comment me calmer avant une conversation difficile ?",
  "Private and confidential": "Privé et confidentiel",
  "Get guidance": "Obtenir des conseils",
  "Weekly check-in": "Bilan hebdomadaire",
  "A quick pulse on how you're doing": "Un bref point sur votre état actuel",
  "Check-in saved": "Bilan enregistré",
  "Thanks for making space for yourself today.": "Merci d’avoir pris un moment pour vous aujourd’hui.",
  "Start another": "Recommencer",
  "Save check-in": "Enregistrer le bilan",
  "Continue": "Continuer",
  "Not at all": "Pas du tout",
  "Several days": "Plusieurs jours",
  "More than half the days": "Plus de la moitié des jours",
  "Nearly every day": "Presque tous les jours",
  "How have you been feeling most days this week?": "Comment vous êtes-vous senti(e) la plupart des jours cette semaine ?",
  "How easy has it been to focus on everyday tasks?": "Avez-vous réussi à vous concentrer sur vos tâches quotidiennes ?",
  "How supported do you feel right now?": "Vous sentez-vous soutenu(e) en ce moment ?",
  "Low": "Faible",
  "High": "Élevé",
  "Today": "Aujourd’hui",
  "Thu": "Jeu",
  "days": "jours",
  "October": "octobre",
}

const translate = (value: string, language: "EN" | "FR") => language === "FR" ? french[value] ?? value : value

const answers = [
  { label: "Not at all", score: 0 },
  { label: "Several days", score: 1 },
  { label: "More than half the days", score: 2 },
  { label: "Nearly every day", score: 3 },
]

const prompts = [
  "How have you been feeling most days this week?",
  "How easy has it been to focus on everyday tasks?",
  "How supported do you feel right now?",
]

export default function Page() {
  const [mobileNav, setMobileNav] = useState(false)
  const [active, setActive] = useState("Overview")
  const [language, setLanguage] = useState<"EN" | "FR">("EN")
  const t = (value: string) => translate(value, language)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [response, setResponse] = useState("")
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const guidance = useMemo(() => response.trim() ? generateGuidance(response) : null, [response])

  function submitCheckIn() {
    if (selected === null) return
    setSubmitted(true)
  }

  return (
    <main className="min-h-screen bg-[#f5f8fa] text-[#17324a]">
      <div className="flex min-h-screen">
        <aside className={`fixed inset-y-0 left-0 z-20 flex w-[252px] flex-col border-r border-[#dfe9ee] bg-white px-5 py-6 transition-transform lg:static lg:translate-x-0 ${mobileNav ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex items-center justify-between px-2"><a href="#overview" className="flex items-center gap-2.5"><span className="grid size-9 place-items-center rounded-xl bg-[#0d8fa5] text-white"><HeartPulse className="size-5" /></span><span className="text-xl font-bold tracking-[-.04em]">mindcare<span className="text-[#0d9eb7]">.</span></span></a><button className="lg:hidden" onClick={() => setMobileNav(false)} aria-label="Close menu"><X className="size-5" /></button></div>
          <p className="mt-10 px-3 text-[10px] font-bold uppercase tracking-[.16em] text-[#96a9b4]">{t("Workspace")}</p>
          <nav className="mt-3 flex flex-col gap-1">{[{ icon: LayoutDashboard, label: "Overview" }, { icon: Sparkles, label: "Start assessment" }, { icon: ClipboardCheck, label: "My assessments" }, { icon: Activity, label: "Assessment history" }, { icon: Target, label: "Wellness insights" }, { icon: BookOpen, label: "Resources" }].map(({ icon: Icon, label }) => <button key={label} onClick={() => { setActive(label); setMobileNav(false) }} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${active === label ? "bg-[#e9f8fa] text-[#087f95]" : "text-[#647987] hover:bg-[#f4f8f9]"}`}><Icon className="size-[18px]" />{t(label)}{label === "My assessments" && <span className="ml-auto rounded-full bg-[#dff4f5] px-2 py-0.5 text-[10px]">2</span>}</button>)}</nav>
          <p className="mt-9 px-3 text-[10px] font-bold uppercase tracking-[.16em] text-[#96a9b4]">{t("Support")}</p>
          <nav className="mt-3 flex flex-col gap-1"><button className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-[#647987] hover:bg-[#f4f8f9]"><UserRound className="size-[18px]" />{t("My profile")}</button><button className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-[#647987] hover:bg-[#f4f8f9]"><Settings className="size-[18px]" />{t("Settings")}</button><button className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-[#647987] hover:bg-[#f4f8f9]"><LifeBuoy className="size-[18px]" />{t("Help & support")}</button><button className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-[#647987] hover:bg-[#f4f8f9]"><LogOut className="size-[18px]" />{t("Log out")}</button></nav>
          <div className="mt-auto rounded-2xl bg-[#17324a] p-4 text-white"><ShieldCheck className="size-5 text-[#82d8df]" /><p className="mt-3 text-sm font-bold">{t("Your privacy matters")}</p><p className="mt-1 text-[11px] leading-5 text-[#b6cbd4]">{t("Your reflections are private and never used to diagnose you.")}</p><button className="mt-3 text-[11px] font-bold text-[#82d8df]">{t("Learn about privacy →")}</button></div>
        </aside>

        <section className="min-w-0 flex-1"><header className="sticky top-0 z-10 flex h-[76px] items-center justify-between border-b border-[#dfe9ee] bg-white/95 px-5 backdrop-blur sm:px-8"><div className="flex items-center gap-4"><button className="lg:hidden" onClick={() => setMobileNav(true)} aria-label="Open menu"><Menu /></button><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#91a4ad]">{t("Patient portal")}</p><p className="text-sm font-bold text-[#17324a]">{t("Overview")}</p></div><div className="relative ml-2 hidden md:block"><Search className="absolute left-3 top-2.5 size-4 text-[#9badb6]" /><input aria-label="Search" placeholder={t("Search your space")} className="h-9 w-56 rounded-lg border border-[#e4edf0] bg-[#f8fafb] pl-9 text-sm outline-none focus:border-[#77cbd3]" /></div></div><div className="flex items-center gap-3"><button onClick={() => setLanguage(language === "EN" ? "FR" : "EN")} className="hidden items-center gap-1.5 rounded-lg border border-[#e4edf0] px-2.5 py-2 text-[11px] font-bold text-[#647987] sm:flex" aria-label={t("Switch language")}><Globe2 className="size-3.5" />{language}<ChevronDown className="size-3" /></button><div className="relative"><button aria-label={t("Notifications")} onClick={() => setShowNotifications(!showNotifications)} className="relative rounded-lg p-2 text-[#6b808c] hover:bg-[#f4f8f9]"><Bell className="size-[19px]" /><span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-[#e25d5d]" /></button>{showNotifications && <div className="absolute right-0 top-11 z-20 w-64 rounded-xl border border-[#dfe9ee] bg-white p-4 shadow-[0_14px_35px_rgba(18,48,71,.12)]"><p className="text-xs font-bold text-[#17324a]">{t("Notifications")}</p><p className="mt-3 text-xs leading-5 text-[#647987]">{t("Your weekly reflection is ready to review.")}</p><button className="mt-3 text-[11px] font-bold text-[#0d8fa5]">{t("View updates")}</button></div>}</div><div className="h-7 w-px bg-[#e2eaed]" /><div className="relative"><button onClick={() => setShowProfile(!showProfile)} className="flex items-center gap-2 text-left" aria-label={t("Open profile menu")}><span className="grid size-8 place-items-center rounded-full bg-[#d7eef0] text-xs font-bold text-[#087f95]">AM</span><span className="hidden text-sm font-bold sm:block">Alex Morgan</span><ChevronDown className="size-4 text-[#8ca0aa]" /></button>{showProfile && <div className="absolute right-0 top-11 z-20 w-44 rounded-xl border border-[#dfe9ee] bg-white p-2 shadow-[0_14px_35px_rgba(18,48,71,.12)]"><button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold text-[#647987] hover:bg-[#f4f8f9]"><UserRound className="size-4" /> My profile</button><button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold text-[#647987] hover:bg-[#f4f8f9]"><Settings className="size-4" /> Settings</button></div>}</div></div></header>

          <div className="mx-auto max-w-[1360px] px-5 py-7 sm:px-8 lg:px-10"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold text-[#8498a3]">{language === "FR" ? "Mercredi 4 novembre 2026" : "Wednesday, November 4, 2026"}</p><h1 className="mt-1 text-2xl font-bold tracking-[-.04em] sm:text-3xl">{t("Good morning, Alex")}</h1><p className="mt-2 text-sm text-[#708691]">{t("A clear view of your wellbeing, one small step at a time.")}</p></div><button onClick={() => document.getElementById("guided-checkin")?.scrollIntoView({ behavior: "smooth" })} className="flex w-fit items-center gap-2 rounded-xl bg-[#0d8fa5] px-4 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(13,143,165,.18)] hover:bg-[#087f95]"><Sparkles className="size-4" />{t("Start check-in")}</button></div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric icon={HeartPulse} label={t("Wellbeing score")} value="72" suffix="/100" trend={t("+8% this month")} color="teal" /><Metric icon={Target} label={t("Check-in streak")} value="12" suffix={language === "FR" ? " jours" : " days"} trend={t("Best: 18 days")} color="blue" /><Metric icon={CalendarDays} label={t("Next reflection")} value={t("Thu")} suffix=" · 9:00 AM" trend={t("In 2 days")} color="purple" /><Metric icon={CheckCircle2} label={t("Weekly progress")} value="4" suffix=" / 5" trend={t("Almost there")} color="green" /></div>

            <div className="mt-5 grid gap-5 xl:grid-cols-[1.45fr_.8fr]"><section className="rounded-2xl border border-[#dfe9ee] bg-white p-5 sm:p-6"><div className="flex items-start justify-between"><div><div className="flex items-center gap-2"><span className="grid size-8 place-items-center rounded-lg bg-[#e9f8fa] text-[#0d8fa5]"><Activity className="size-4" /></span><h2 className="font-bold">{t("Your wellbeing overview")}</h2></div><p className="mt-2 text-xs text-[#81959f]">{t("Your self-reported check-ins over the last 30 days")}</p></div><button className="flex items-center gap-1 text-xs font-bold text-[#0d8fa5]">{t("View details")} <ArrowUpRight className="size-3.5" /></button></div><div className="mt-7 flex h-44 items-end gap-2 sm:gap-4">{[38,48,45,58,52,67,62,70,65,76,72,82,78,88,84,91].map((height, index) => <div key={index} className="group flex h-full flex-1 flex-col justify-end gap-2"><div className="relative w-full rounded-t-md bg-[#d9f1f3] transition group-hover:bg-[#8bd4da]" style={{ height: `${height}%` }}><span className="absolute -top-6 left-1/2 hidden -translate-x-1/2 rounded bg-[#17324a] px-1.5 py-1 text-[9px] text-white group-hover:block">{height}</span></div>{index % 3 === 0 && <span className="text-center text-[9px] text-[#9badb6]">{index === 0 ? "Oct 21" : index === 15 ? "Today" : `Oct ${21 + index}`}</span>}</div>)}</div><div className="mt-5 flex items-center gap-5 border-t border-[#eef3f5] pt-4 text-[11px] text-[#81959f]"><span className="flex items-center gap-2"><i className="size-2 rounded-full bg-[#0d8fa5]" />{t("Your score")}</span><span className="flex items-center gap-2"><i className="size-2 rounded-full bg-[#d9f1f3]" />{t("Baseline")}</span><span className="ml-auto font-semibold text-[#0d8fa5]">{t("Trending positively")}</span></div></section><section className="rounded-2xl bg-[#17324a] p-6 text-white"><div className="flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#82d8df]">Today&apos;s focus</p><h2 className="mt-3 text-xl font-bold">{t("Protect your energy")}</h2></div><Brain className="size-6 text-[#82d8df]" /></div><p className="mt-4 text-sm leading-6 text-[#bed0d7]">{t("Choose one boundary that gives you a little more room today.")}</p><div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4"><p className="text-xs font-semibold text-[#82d8df]">{t("2-minute practice")}</p><p className="mt-2 text-sm font-semibold">{t("Write down one thing you can say no to.")}</p></div><button className="mt-5 w-full rounded-lg bg-[#82d8df] py-3 text-xs font-bold text-[#17324a]">{t("Open guided practice")}</button></section></div>

            <div id="guided-checkin" className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_.85fr]"><section className="rounded-2xl border border-[#dfe9ee] bg-white p-5 sm:p-6"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="grid size-8 place-items-center rounded-lg bg-[#fff3df] text-[#cf8a25]"><MessageCircleQuestion className="size-4" /></span><h2 className="font-bold">{t("Ask MindCare")}</h2></div><span className="rounded-full bg-[#edf7f8] px-2.5 py-1 text-[10px] font-bold text-[#0d8fa5]">{t("Guided support")}</span></div><p className="mt-2 text-xs leading-5 text-[#81959f]">Ask a wellbeing question. You&apos;ll receive practical, safety-aware guidance — not a diagnosis.</p><textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder={t("For example: How can I calm down before a difficult conversation?")} className="mt-5 min-h-24 w-full resize-none rounded-xl border border-[#e1ebee] bg-[#fafcfc] p-4 text-sm outline-none placeholder:text-[#9badb6] focus:border-[#72cbd2]" /><div className="mt-3 flex items-center justify-between"><span className="flex items-center gap-1.5 text-[10px] text-[#8ba0aa]"><ShieldCheck className="size-3.5 text-[#0d8fa5]" />{t("Private and confidential")}</span><button onClick={() => setResponse(prompt)} disabled={!prompt.trim()} className="rounded-lg bg-[#0d8fa5] px-4 py-2.5 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">{t("Get guidance")} <ArrowUpRight className="ml-1 inline size-3.5" /></button></div>{guidance && <div className={`mt-5 rounded-xl border p-4 ${guidance.urgency === "urgent" ? "border-[#f1caca] bg-[#fff5f5]" : "border-[#ccebed] bg-[#f1fbfb]"}`}><p className="text-sm font-bold">{guidance.title}</p><p className="mt-1 text-xs leading-5 text-[#607883]">{guidance.response}</p></div>}</section><section className="rounded-2xl border border-[#dfe9ee] bg-white p-5 sm:p-6"><div className="flex items-center justify-between"><div><h2 className="font-bold">{t("Weekly check-in")}</h2><p className="mt-1 text-xs text-[#81959f]">A quick pulse on how you&apos;re doing</p></div><span className="text-xs font-bold text-[#0d8fa5]">{step + 1} / {prompts.length}</span></div><div className="mt-4 h-1.5 rounded-full bg-[#edf3f4]"><div className="h-full rounded-full bg-[#0d8fa5] transition-all" style={{ width: `${((step + 1) / prompts.length) * 100}%` }} /></div>{submitted ? <div className="py-10 text-center"><CheckCircle2 className="mx-auto size-10 text-[#1c9b79]" /><p className="mt-3 font-bold">{t("Check-in saved")}</p><p className="mt-1 text-xs text-[#81959f]">{t("Thanks for making space for yourself today.")}</p><button onClick={() => { setSubmitted(false); setSelected(null) }} className="mt-4 text-xs font-bold text-[#0d8fa5]">{t("Start another")}</button></div> : <><h3 className="mt-6 text-base font-bold leading-6">{t(prompts[step])}</h3><div className="mt-5 flex flex-col gap-2">{answers.map((answer) => <button key={answer.label} onClick={() => setSelected(answer.score)} className={`rounded-lg border px-3 py-2.5 text-left text-xs font-semibold transition ${selected === answer.score ? "border-[#0d8fa5] bg-[#edf9fa] text-[#087f95]" : "border-[#e4edef] text-[#657d88] hover:border-[#9ad8dd]"}`}>{t(answer.label)}<span className="float-right text-[10px] text-[#9badb6]">{answer.score === 0 ? t("Low") : answer.score === 3 ? t("High") : ""}</span></button>)}</div><button onClick={() => { if (step === prompts.length - 1) submitCheckIn(); else { setStep(step + 1); setSelected(null) } }} className="mt-5 w-full rounded-lg bg-[#17324a] py-3 text-xs font-bold text-white disabled:opacity-40" disabled={selected === null}>{t(step === prompts.length - 1 ? "Save check-in" : "Continue")}</button></>}</section></div>
          </div>
        </section>
      </div>
    </main>
  )
}

function Metric({ icon: Icon, label, value, suffix, trend, color }: { icon: typeof HeartPulse; label: string; value: string; suffix: string; trend: string; color: string }) {
  const colors: Record<string, string> = { teal: "bg-[#e9f8fa] text-[#0d8fa5]", blue: "bg-[#edf3ff] text-[#5275c5]", purple: "bg-[#f3efff] text-[#8064c2]", green: "bg-[#eaf8f1] text-[#26936f]" }
  return <div className="rounded-2xl border border-[#dfe9ee] bg-white p-5"><span className={`grid size-9 place-items-center rounded-lg ${colors[color]}`}><Icon className="size-[18px]" /></span><p className="mt-4 text-xs font-semibold text-[#81959f]">{label}</p><p className="mt-1 text-2xl font-bold tracking-[-.04em]">{value}<span className="text-sm font-semibold text-[#81959f]">{suffix}</span></p><p className="mt-2 text-[10px] font-bold text-[#26936f]">{trend}</p></div>
}
