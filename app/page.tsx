"use client"

import { useEffect, useState } from "react"
import { analyzeCheckin } from "@/lib/checkin-analysis"
import { screeners, frequencyOptions, scoreScreener, type ScreenId } from "@/lib/clinical-screeners"
import { ArrowRight, CheckCircle2, ChevronDown, Check, HeartPulse, Menu, MessageCircleQuestion, ShieldCheck, X } from "lucide-react"

type Language = "EN" | "FR"
const translations = {
  EN: {
    dashboard: "Dashboard", welcome: "Welcome to MindCare", intro: "Take a moment to check in with yourself. You can start with a short check-in or ask a wellbeing question.",
    checkin: "Quick check-in", checkinInfo: "Eight short questions about the past two weeks. Choose what best describes your experience.",
    question: ["How often have you felt down or lost interest in activities?", "How often have worries been difficult to manage?", "How often has stress affected your daily routine?", "How often have you had difficulty sleeping?", "How often have you found it difficult to concentrate?", "How often have you felt isolated or unsupported?", "How often have you felt unusually tired?", "How often have your feelings interfered with school, work, or relationships?"],
    choices: ["Never", "Sometimes", "Often", "Almost every day"],
    next: "Next question", finish: "Finish check-in", back: "Back", complete: "Check-in complete", completeInfo: "Thank you for taking a moment to reflect. Your answers are not a diagnosis.",
    again: "Start again", step: "Question", of: "of", guidance: "Ask MindCare", guidanceInfo: "Have a wellbeing question? Get general guidance, not a medical diagnosis.",
    placeholder: "Type your question here...", ask: "Get guidance", privacy: "Your privacy matters", privacyInfo: "Avoid sharing identifying or sensitive personal information in this question box.",
    note: "This is an informal, non-validated wellbeing check-in, not a clinical screening or diagnosis. Your answers are not saved to an account.", menu: "Open menu", close: "Close menu", language: "Switch language", home: "Home", assessment: "Check-in", help: "Ask MindCare",
  },
  FR: {
    dashboard: "Tableau de bord", welcome: "Bienvenue sur MindCare", intro: "Prenez un moment pour faire le point. Commencez par un court bilan ou posez une question sur le bien-être.",
    checkin: "Bilan rapide", checkinInfo: "Huit questions courtes sur les deux dernières semaines. Choisissez ce qui vous correspond.",
    question: ["À quelle fréquence vous êtes-vous senti(e) triste ou avez-vous perdu tout intérêt ?", "À quelle fréquence vos inquiétudes ont-elles été difficiles à gérer ?", "À quelle fréquence le stress a-t-il perturbé votre quotidien ?", "À quelle fréquence avez-vous eu du mal à dormir ?", "À quelle fréquence avez-vous eu du mal à vous concentrer ?", "À quelle fréquence vous êtes-vous senti(e) isolé(e) ou sans soutien ?", "À quelle fréquence vous êtes-vous senti(e) anormalement fatigué(e) ?", "À quelle fréquence vos émotions ont-elles perturbé vos études, votre travail ou vos relations ?"],
    choices: ["Jamais", "Parfois", "Souvent", "Presque tous les jours"],
    next: "Question suivante", finish: "Terminer le bilan", back: "Retour", complete: "Bilan terminé", completeInfo: "Merci d’avoir pris un moment pour réfléchir. Vos réponses ne constituent pas un diagnostic.",
    again: "Recommencer", step: "Question", of: "sur", guidance: "Demander à MindCare", guidanceInfo: "Une question sur le bien-être ? Obtenez des conseils généraux, pas un diagnostic médical.",
    placeholder: "Écrivez votre question ici...", ask: "Obtenir des conseils", privacy: "Votre confidentialité compte", privacyInfo: "Évitez de partager des informations personnelles identifiantes ou sensibles dans cette zone.",
    note: "Ce bilan informel n’est pas un dépistage clinique validé ni un diagnostic. Les réponses ne sont pas enregistrées.", menu: "Ouvrir le menu", close: "Fermer le menu", language: "Changer de langue", home: "Accueil", assessment: "Bilan", help: "Demander à MindCare",
  },
} as const

export default function Page() {
  const [language, setLanguage] = useState<Language>("EN")
  const [menuOpen, setMenuOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [completed, setCompleted] = useState(false)
  const [responses, setResponses] = useState<number[]>([])
  const [screenId, setScreenId] = useState<ScreenId | null>(null)
  const [screenStep, setScreenStep] = useState(0)
  const [screenAnswers, setScreenAnswers] = useState<number[]>([])
  const [screenDone, setScreenDone] = useState(false)
  const [screenChoice, setScreenChoice] = useState<number | null>(null)
  const [prompt, setPrompt] = useState("")
  const [answer, setAnswer] = useState("")
  const [asking, setAsking] = useState(false)
  const [askError, setAskError] = useState("")
  const t = translations[language]
  const summary = completed ? analyzeCheckin(responses, language) : null
  const screenResult = screenId && screenDone ? scoreScreener(screenId,screenAnswers,language) : null
  function startScreen(id:ScreenId) {setScreenId(id);setScreenStep(0);setScreenAnswers([]);setScreenChoice(null);setScreenDone(false)}
  function advanceScreen() {if(screenChoice===null||!screenId)return;const next=[...screenAnswers];next[screenStep]=screenChoice;setScreenAnswers(next);if(screenStep===screeners[screenId].questions.length-1)setScreenDone(true);else {setScreenStep(screenStep+1);setScreenChoice(next[screenStep+1]??null)}}
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
  function chooseLanguage(next: Language) {
    setLanguage(next)
    setLanguageOpen(false)
    window.localStorage.setItem("mindcare-language", next)
  }
  function navigate(id: string) {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }
  function nextStep() {
    if (selected === null) return
    setResponses(previous => { const updated = [...previous]; updated[step] = selected; return updated })
    if (step === t.question.length - 1) setCompleted(true)
    else { setStep(step + 1); setSelected(responses[step + 1] ?? null) }
  }
  function restart() { setStep(0); setSelected(null); setCompleted(false); setResponses([]) }

  return (
    <main id="home" className="min-h-screen bg-[#f7fafb] text-[#17324a]">
      <header className="sticky top-0 z-20 border-b border-[#0d4a8a] bg-[#0d4a8a] text-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
          <a href="#home" className="flex items-center gap-2 text-lg font-bold tracking-tight"><span className="grid size-9 place-items-center rounded-xl bg-white/15 text-white"><HeartPulse size={19} /></span>mindcare<span className="-ml-2 text-white">.</span></a>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-white/85 sm:flex" aria-label="Main navigation">
            <button onClick={() => navigate("home")} className="hover:text-white">{t.home}</button>
            <button onClick={() => navigate("checkin")} className="hover:text-white">{t.assessment}</button>
            <button onClick={() => navigate("ask")} className="hover:text-white">{t.help}</button>
          </nav>
          <div className="flex items-center gap-2">
            <div className="relative"><button type="button" aria-label={t.language} aria-expanded={languageOpen} aria-haspopup="menu" onClick={() => setLanguageOpen(!languageOpen)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-white hover:bg-white/15">{language}<ChevronDown size={15} className={`transition-transform ${languageOpen?"rotate-180":""}`}/></button>{languageOpen && <div role="menu" aria-label={t.language} className="absolute right-0 top-full z-40 mt-2 w-40 overflow-hidden rounded-xl border border-[#dce5ee] bg-white py-1 text-[#34465b] shadow-xl">{(["EN","FR"] as Language[]).map(code=><button type="button" role="menuitemradio" aria-checked={language===code} key={code} onClick={()=>chooseLanguage(code)} className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold hover:bg-[#edf4fb] ${language===code?"bg-[#e8f1fb] text-[#0d4a8a]":""}`}>{code==="EN"?"English":"Français"}{language===code && <Check size={16}/>}</button>)}</div>}</div>
            <button type="button" className="rounded-lg p-2 sm:hidden" aria-label={menuOpen ? t.close : t.menu} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={22}/> : <Menu size={22}/>}</button>
          </div>
        </div>
        {menuOpen && <nav className="flex flex-col gap-1 border-t border-white/20 bg-[#0d4a8a] px-4 py-3 text-white sm:hidden"><button className="rounded-lg px-3 py-2 text-left" onClick={() => navigate("home")}>{t.home}</button><button className="rounded-lg px-3 py-2 text-left" onClick={() => navigate("checkin")}>{t.assessment}</button><button className="rounded-lg px-3 py-2 text-left" onClick={() => navigate("ask")}>{t.help}</button></nav>}
      </header>
      <div className="mx-auto max-w-5xl px-4 pb-16 pt-9 sm:px-6 sm:pt-12">
        <section className="rounded-3xl border border-[#dcebed] bg-white px-6 py-9 sm:px-10">
          <p className="text-xs font-bold uppercase tracking-[.15em] text-[#0d8fa5]">{t.dashboard}</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{t.welcome}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#637d8a] sm:text-base">{t.intro}</p>
          <button onClick={() => navigate("checkin")} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0d8fa5] px-5 py-3 text-sm font-bold text-white hover:bg-[#087f95]">{t.checkin}<ArrowRight size={17}/></button>
        </section>
        <section id="screenings" className="mt-6 scroll-mt-24 rounded-2xl border border-[#dcebed] bg-white p-6 sm:p-7">
          <h2 className="text-xl font-bold">{language==="FR"?"Dépistage des symptômes":"Symptom screening"}</h2>
          <p className="mt-2 text-sm leading-6 text-[#6b8490]">{language==="FR"?"Choisissez un questionnaire. Les résultats apparaissent immédiatement et ne constituent pas un diagnostic.":"Choose a questionnaire. Results appear immediately and are not a diagnosis."}</p>
          <div className="mt-4 flex flex-wrap gap-2">{(["phq8","gad7"] as ScreenId[]).map(id=><button key={id} onClick={()=>startScreen(id)} className={`rounded-xl border px-4 py-3 text-sm font-semibold ${screenId===id?"border-[#0d8fa5] bg-[#e9f8fa]":"border-[#dcebed]"}`}>{screeners[id].title[language]}</button>)}</div>
          {screenId && !screenDone && <div className="mt-5 rounded-xl border border-[#dcebed] p-4">
            <p className="text-xs font-semibold text-[#647d88]">{screeners[screenId].description[language]}</p>
            <p className="mt-4 text-xs font-semibold">{screenStep+1} / {screeners[screenId].questions.length}</p>
            <div className="mt-2 h-2 rounded-full bg-[#edf3f4]"><div className="h-2 rounded-full bg-[#0d8fa5]" style={{width:`${100*screenStep/screeners[screenId].questions.length}%`}}/></div>
            <h3 className="mt-5 font-bold">{screeners[screenId].questions[screenStep][language]}</h3>
            <div className="mt-4 grid gap-2">{frequencyOptions[language].map((choice,index)=><button key={index} onClick={()=>setScreenChoice(index)} aria-pressed={screenChoice===index} className={`rounded-xl border p-3 text-left text-sm ${screenChoice===index?"border-[#0d8fa5] bg-[#edf9fa] font-semibold":"border-[#dcebed]"}`}>{choice}</button>)}</div>
            <div className="mt-4 flex justify-between gap-3"><button disabled={screenStep===0} onClick={()=>{setScreenStep(screenStep-1);setScreenChoice(screenAnswers[screenStep-1]??null)}} className="rounded-xl border px-4 py-2 text-sm disabled:opacity-40">{language==="FR"?"Retour":"Back"}</button><button disabled={screenChoice===null} onClick={advanceScreen} className="rounded-xl bg-[#0d8fa5] px-4 py-2 text-sm font-bold text-white disabled:opacity-40">{screenStep===screeners[screenId].questions.length-1?(language==="FR"?"Voir les résultats":"See results"):(language==="FR"?"Suivant":"Next")}</button></div>
          </div>}
          {screenResult && <div className="mt-5 rounded-xl border border-[#dcebed] p-5" aria-live="polite">
            <h3 className="text-lg font-bold">{language==="FR"?"Vos résultats de dépistage":"Your screening results"}</h3>
            <p className="mt-3 text-2xl font-bold text-[#0d8fa5]">{screenResult.score} / {screenResult.max}</p>
            <p className="mt-1 text-sm font-semibold">{screenResult.severity}</p>
            <p className="mt-4 text-sm leading-6">{screenResult.advice}</p>
            {screenResult.top.length>0 && <div className="mt-4"><p className="text-sm font-bold">{language==="FR"?"Symptômes les plus signalés":"Most reported symptoms"}</p>{screenResult.top.map((item,index)=><p key={index} className="mt-2 text-sm text-[#536e7b]">{item.question} — {item.frequency}</p>)}</div>}
            <p className="mt-4 text-xs leading-5 text-[#647d88]">{language==="FR"?"Les résultats sont indicatifs et ne remplacent pas une évaluation clinique. Si vous avez besoin d'aide, parlez à un professionnel de santé ou à une personne de confiance.":"Screening scores are not a diagnosis and cannot rule out a condition. If you need help, talk to a qualified healthcare professional or someone you trust."}</p>
            <a href="https://www.google.com/maps/search/?api=1&query=mental+health+clinic" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex rounded-xl bg-[#0d8fa5] px-4 py-3 text-sm font-bold text-white">{language==="FR"?"Trouver un service de santé":"Find a health service"}</a>
            <button onClick={()=>startScreen(screenId)} className="ml-2 mt-4 rounded-xl border border-[#dcebed] px-4 py-3 text-sm font-bold">{language==="FR"?"Recommencer":"Start again"}</button>
          </div>}
        </section>
        <div className="mt-6 grid items-start gap-6 lg:grid-cols-2">
          <section id="checkin" className="scroll-mt-24 rounded-2xl border border-[#dcebed] bg-white p-6 sm:p-7">
            <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#e9f8fa] text-[#0d8fa5]"><CheckCircle2 size={21}/></span><h2 className="text-xl font-bold">{t.checkin}</h2></div>
            <p className="mt-3 text-sm leading-6 text-[#6b8490]">{t.checkinInfo}</p>
            {completed ? <div className="py-5"><h3 className="text-lg font-bold">{language==="FR"?"Résultats du bilan rapide":"Your quick check-in results"}</h3><p className="mt-3 text-2xl font-bold text-[#0d8fa5]">{responses.reduce((total,value)=>total+value,0)} / 24</p><p className="mt-1 text-sm font-semibold">{language==="FR"?"Total des fréquences signalées (non clinique)":"Reported frequency total (non-clinical)"}</p><p className="mt-3 text-xs leading-5 text-[#647d88]">{language==="FR"?"Ce total n’est pas un score diagnostique ni une mesure de gravité validée.":"This total is not a diagnostic score or a validated severity measure."}</p><p className="mt-4 rounded-xl bg-[#edf8f9] p-4 text-sm leading-6">{summary?.recommendation}</p><details className="mt-4 rounded-xl border border-[#dcebed] p-4"><summary className="cursor-pointer text-sm font-bold">{language==="FR"?"Voir votre analyse personnalisée et vos conseils":"View your personalized analysis and advice"}</summary><div className="mt-4"><p className="mt-3 text-sm leading-6 text-[#536e7b]">{summary?.explanation}</p>{summary?.details.map(item => <div key={item.id} className="mt-3 rounded-xl border border-[#dcebed] p-4"><div className="flex flex-wrap items-center justify-between gap-2"><h4 className="font-bold">{item.label}</h4><span className="rounded-lg bg-[#edf8f9] px-2 py-1 text-xs font-semibold text-[#087f95]">{item.frequency}</span></div><p className="mt-3 text-sm leading-6 text-[#536e7b]">{item.advice}</p><p className="mt-2 text-xs leading-5 text-[#647d88]">{item.followup}</p></div>)}<div className="mt-5 rounded-xl border-2 border-[#0d8fa5] bg-[#f3fafb] p-5" aria-live="polite"><h4 className="text-lg font-bold">{summary?.finalHeading}</h4><h5 className="mt-4 text-sm font-bold">{language==="FR"?"Conclusion de l’évaluation":"Assessment conclusion"}</h5><p className="mt-2 text-sm leading-7">{summary?.finalConclusion}</p><h5 className="mt-4 text-sm font-bold">{language==="FR"?"Comment vos difficultés peuvent être liées":"How your concerns may connect"}</h5><p className="mt-2 text-sm leading-7">{summary?.insight}</p><h5 className="mt-4 text-sm font-bold">{language==="FR"?"Votre plan d’action personnalisé":"Your personalized action plan"}</h5><ol className="mt-2 list-decimal space-y-2 pl-5 text-sm leading-6">{summary?.actionPlan.map((action,index)=><li key={index}>{action}</li>)}</ol><h5 className="mt-4 text-sm font-bold">{language==="FR"?"Suivi et prochaines étapes":"Follow-up and next steps"}</h5><p className="mt-2 text-sm leading-7">{summary?.followup}</p></div><p className="mt-4 text-xs leading-5 text-[#647d88]">{summary?.notice}</p><div className="mt-4 rounded-xl border border-[#dcebed] p-4"><p className="font-semibold">{summary?.careLevel === "recommended" ? (language === "FR" ? "Évaluation professionnelle recommandée" : "Professional assessment recommended") : summary?.careLevel === "consider" ? (language === "FR" ? "Envisager un avis professionnel" : "Consider professional advice") : (language === "FR" ? "Soutien disponible si nécessaire" : "Support is available if needed")}</p><p className="mt-2 text-sm leading-6 text-[#6b8490]">{language === "FR" ? "Pour obtenir une évaluation, contactez un médecin ou un psychologue qualifié. MindCare ne prend pas encore de rendez-vous." : "For a professional assessment, contact a qualified doctor or psychologist. MindCare does not yet book appointments."}</p><a href="https://www.google.com/maps/search/?api=1&query=mental+health+clinic" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex rounded-xl bg-[#0d8fa5] px-4 py-3 text-sm font-bold text-white">{language === "FR" ? "Trouver un service de santé" : "Find a health service"}</a></div></div></details><button onClick={restart} className="mt-5 rounded-xl border border-[#dcebed] px-5 py-3 text-sm font-bold">{t.again}</button></div> :
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs font-semibold text-[#66808c]"><span>{t.step} {step + 1} {t.of} {t.question.length}</span><span>{Math.round((step / t.question.length) * 100)}%</span></div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#edf3f4]"><div className="h-full rounded-full bg-[#0d8fa5] transition-all" style={{width: `${(step / t.question.length) * 100}%`}} /></div>
              <h3 className="mt-6 text-base font-bold leading-7">{t.question[step]}</h3>
              <div className="mt-4 grid gap-2">{t.choices.map((choice, index) => <button key={index} onClick={() => setSelected(index)} aria-pressed={selected === index} className={`rounded-xl border px-4 py-3 text-left text-sm transition ${selected === index ? "border-[#0d8fa5] bg-[#edf9fa] font-semibold text-[#087f95]" : "border-[#e0eaed] hover:border-[#0d8fa5]"}`}>{choice}</button>)}</div>
              <div className="mt-5 flex items-center justify-between gap-3">{step > 0 ? <button onClick={() => {setStep(step-1);setSelected(responses[step-1] ?? null)}} className="rounded-xl border border-[#dcebed] px-4 py-3 text-sm font-semibold">{t.back}</button> : <span/>}<button disabled={selected === null} onClick={nextStep} className="rounded-xl bg-[#0d8fa5] px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">{step === t.question.length-1 ? t.finish : t.next}</button></div>
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
