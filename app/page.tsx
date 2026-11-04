"use client"

import { useEffect, useState } from "react"
import { ArrowRight, CheckCircle2, Globe2, HeartPulse, Menu, MessageCircleQuestion, ShieldCheck, X } from "lucide-react"

type Language = "EN" | "FR"
const translations = {
  EN: {
    dashboard: "Dashboard", welcome: "Welcome to MindCare", intro: "Take a moment to check in with yourself. You can start with a short check-in or ask a wellbeing question.",
    checkin: "Quick check-in", checkinInfo: "Three simple questions. Choose the answer that feels right for you.",
    question: ["How have you been feeling most days this week?", "How easy has it been to focus on everyday tasks?", "How supported do you feel right now?"],
    choices: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
    next: "Next question", finish: "Finish check-in", back: "Back", complete: "Check-in complete", completeInfo: "Thank you for taking a moment to reflect. Your answers are not a diagnosis.",
    again: "Start again", step: "Question", of: "of", guidance: "Ask MindCare", guidanceInfo: "Have a wellbeing question? Get general guidance, not a medical diagnosis.",
    placeholder: "Type your question here...", ask: "Get guidance", privacy: "Your privacy matters", privacyInfo: "Avoid sharing identifying or sensitive personal information in this question box.",
    note: "This check-in is for reflection only. Answers are not saved to a patient account.", menu: "Open menu", close: "Close menu", language: "Switch language", home: "Home", assessment: "Check-in", help: "Ask MindCare",
  },
  FR: {
    dashboard: "Tableau de bord", welcome: "Bienvenue sur MindCare", intro: "Prenez un moment pour faire le point. Commencez par un court bilan ou posez une question sur le bien-être.",
    checkin: "Bilan rapide", checkinInfo: "Trois questions simples. Choisissez la réponse qui vous correspond.",
    question: ["Comment vous êtes-vous senti(e) la plupart des jours cette semaine ?", "Avez-vous réussi à vous concentrer sur vos tâches quotidiennes ?", "Vous sentez-vous soutenu(e) en ce moment ?"],
    choices: ["Pas du tout", "Plusieurs jours", "Plus de la moitié des jours", "Presque tous les jours"],
    next: "Question suivante", finish: "Terminer le bilan", back: "Retour", complete: "Bilan terminé", completeInfo: "Merci d’avoir pris un moment pour réfléchir. Vos réponses ne constituent pas un diagnostic.",
    again: "Recommencer", step: "Question", of: "sur", guidance: "Demander à MindCare", guidanceInfo: "Une question sur le bien-être ? Obtenez des conseils généraux, pas un diagnostic médical.",
    placeholder: "Écrivez votre question ici...", ask: "Obtenir des conseils", privacy: "Votre confidentialité compte", privacyInfo: "Évitez de partager des informations personnelles identifiantes ou sensibles dans cette zone.",
    note: "Ce bilan sert uniquement à la réflexion. Les réponses ne sont pas enregistrées dans un compte patient.", menu: "Ouvrir le menu", close: "Fermer le menu", language: "Changer de langue", home: "Accueil", assessment: "Bilan", help: "Demander à MindCare",
  },
} as const

export default function Page() {
  const [language, setLanguage] = useState<Language>("EN")
  const [menuOpen, setMenuOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [completed, setCompleted] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [answer, setAnswer] = useState("")
  const [asking, setAsking] = useState(false)
  const [askError, setAskError] = useState("")
  const t = translations[language]
  async function askMindCare() {
    if (!prompt.trim() || asking) return
    setAsking(true); setAskError(""); setAnswer("")
    try {
      const res = await fetch("/api/ask", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: prompt.trim(), language }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Service unavailable")
      setAnswer(data.answer)
    } catch (error) { setAskError(error instanceof Error ? error.message : "Service unavailable") }
    finally { setAsking(false) }
  }

  useEffect(() => {
    const saved = window.localStorage.getItem("mindcare-language")
    if (saved === "EN" || saved === "FR") setLanguage(saved)
  }, [])
  function switchLanguage() {
    const next = language === "EN" ? "FR" : "EN"
    setLanguage(next)
    window.localStorage.setItem("mindcare-language", next)
  }
  function navigate(id: string) {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }
  function nextStep() {
    if (selected === null) return
    if (step === t.question.length - 1) setCompleted(true)
    else { setStep(step + 1); setSelected(null) }
  }
  function restart() { setStep(0); setSelected(null); setCompleted(false) }

  return (
    <main id="home" className="min-h-screen bg-[#f7fafb] text-[#17324a]">
      <header className="sticky top-0 z-20 border-b border-[#e0eaed] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
          <a href="#home" className="flex items-center gap-2 text-lg font-bold tracking-tight"><span className="grid size-9 place-items-center rounded-xl bg-[#0d8fa5] text-white"><HeartPulse size={19} /></span>mindcare<span className="-ml-2 text-[#0d8fa5]">.</span></a>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-[#5b7380] sm:flex" aria-label="Main navigation">
            <button onClick={() => navigate("home")} className="hover:text-[#0d8fa5]">{t.home}</button>
            <button onClick={() => navigate("checkin")} className="hover:text-[#0d8fa5]">{t.assessment}</button>
            <button onClick={() => navigate("ask")} className="hover:text-[#0d8fa5]">{t.help}</button>
          </nav>
          <div className="flex items-center gap-2">
            <button type="button" onClick={switchLanguage} aria-label={t.language} className="flex items-center gap-2 rounded-lg border border-[#dfe9ee] px-3 py-2 text-sm font-bold hover:bg-[#edf8f9]"><Globe2 size={16}/>{language} / {language === "EN" ? "FR" : "EN"}</button>
            <button type="button" className="rounded-lg p-2 sm:hidden" aria-label={menuOpen ? t.close : t.menu} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={22}/> : <Menu size={22}/>}</button>
          </div>
        </div>
        {menuOpen && <nav className="flex flex-col gap-1 border-t border-[#e0eaed] bg-white px-4 py-3 sm:hidden"><button className="rounded-lg px-3 py-2 text-left" onClick={() => navigate("home")}>{t.home}</button><button className="rounded-lg px-3 py-2 text-left" onClick={() => navigate("checkin")}>{t.assessment}</button><button className="rounded-lg px-3 py-2 text-left" onClick={() => navigate("ask")}>{t.help}</button></nav>}
      </header>
      <div className="mx-auto max-w-5xl px-4 pb-16 pt-9 sm:px-6 sm:pt-12">
        <section className="rounded-3xl border border-[#dcebed] bg-white px-6 py-9 sm:px-10">
          <p className="text-xs font-bold uppercase tracking-[.15em] text-[#0d8fa5]">{t.dashboard}</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{t.welcome}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#637d8a] sm:text-base">{t.intro}</p>
          <button onClick={() => navigate("checkin")} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0d8fa5] px-5 py-3 text-sm font-bold text-white hover:bg-[#087f95]">{t.checkin}<ArrowRight size={17}/></button>
        </section>
        <div className="mt-6 grid items-start gap-6 lg:grid-cols-2">
          <section id="checkin" className="scroll-mt-24 rounded-2xl border border-[#dcebed] bg-white p-6 sm:p-7">
            <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#e9f8fa] text-[#0d8fa5]"><CheckCircle2 size={21}/></span><h2 className="text-xl font-bold">{t.checkin}</h2></div>
            <p className="mt-3 text-sm leading-6 text-[#6b8490]">{t.checkinInfo}</p>
            {completed ? <div className="py-10 text-center"><CheckCircle2 size={40} className="mx-auto text-[#0d8fa5]"/><h3 className="mt-3 text-lg font-bold">{t.complete}</h3><p className="mt-2 text-sm leading-6 text-[#6b8490]">{t.completeInfo}</p><button onClick={restart} className="mt-5 rounded-xl bg-[#17324a] px-5 py-3 text-sm font-bold text-white">{t.again}</button></div> :
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs font-semibold text-[#66808c]"><span>{t.step} {step + 1} {t.of} {t.question.length}</span><span>{Math.round((step / t.question.length) * 100)}%</span></div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#edf3f4]"><div className="h-full rounded-full bg-[#0d8fa5] transition-all" style={{width: `${(step / t.question.length) * 100}%`}} /></div>
              <h3 className="mt-6 text-base font-bold leading-7">{t.question[step]}</h3>
              <div className="mt-4 grid gap-2">{t.choices.map((choice, index) => <button key={index} onClick={() => setSelected(index)} aria-pressed={selected === index} className={`rounded-xl border px-4 py-3 text-left text-sm transition ${selected === index ? "border-[#0d8fa5] bg-[#edf9fa] font-semibold text-[#087f95]" : "border-[#e0eaed] hover:border-[#0d8fa5]"}`}>{choice}</button>)}</div>
              <div className="mt-5 flex items-center justify-between gap-3">{step > 0 ? <button onClick={() => {setStep(step-1);setSelected(null)}} className="rounded-xl border border-[#dcebed] px-4 py-3 text-sm font-semibold">{t.back}</button> : <span/>}<button disabled={selected === null} onClick={nextStep} className="rounded-xl bg-[#0d8fa5] px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">{step === t.question.length-1 ? t.finish : t.next}</button></div>
            </div>}
            <p className="mt-6 border-t border-[#edf2f4] pt-4 text-xs leading-5 text-[#7b929e]">{t.note}</p>
          </section>
          <section id="ask" className="scroll-mt-24 rounded-2xl border border-[#dcebed] bg-white p-6 sm:p-7">
            <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#e9f8fa] text-[#0d8fa5]"><MessageCircleQuestion size={21}/></span><h2 className="text-xl font-bold">{t.guidance}</h2></div>
            <p className="mt-3 text-sm leading-6 text-[#6b8490]">{t.guidanceInfo}</p>
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder={t.placeholder} className="mt-5 min-h-32 w-full resize-y rounded-xl border border-[#dcebed] bg-[#fbfdfd] p-4 text-sm outline-none focus:border-[#0d8fa5]" />
            <button disabled={!prompt.trim() || asking} onClick={askMindCare} className="mt-3 w-full rounded-xl bg-[#17324a] px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">{asking ? (language === "FR" ? "Réponse en cours…" : "Thinking…") : t.ask}</button>
            {askError && <p role="alert" className="mt-3 text-sm text-red-700">{askError}</p>}{answer && <div className="mt-5 rounded-xl border border-[#dcebed] bg-[#f3fafb] p-4" aria-live="polite"><p className="whitespace-pre-wrap text-sm leading-6 text-[#607883]">{answer}</p></div>}
            <div className="mt-6 flex items-start gap-3 rounded-xl bg-[#f3f8f9] p-4"><ShieldCheck size={19} className="mt-0.5 shrink-0 text-[#0d8fa5]"/><div><p className="text-sm font-bold">{t.privacy}</p><p className="mt-1 text-xs leading-5 text-[#6b8490]">{t.privacyInfo}</p></div></div>
          </section>
        </div>
      </div>
    </main>
  )
}
