"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, CheckCircle2, HeartPulse, ShieldCheck } from "lucide-react"

type Language = "RW" | "EN" | "FR"
type Scale = "PHQ-9" | "GAD-7"
type Question = { id: string; scale: Scale; rw: string; en: string; fr: string }

const questions: Question[] = [
  { id:"P1",scale:"PHQ-9",rw:"Kudashishikarira ibyo ukora cyangwa ntunishimishwe na byo.",en:"Little interest or pleasure in doing things.",fr:"Peu d’intérêt ou de plaisir à faire les choses." },
  { id:"P2",scale:"PHQ-9",rw:"Kumva utameze neza, kugira agahinda gakabije cyangwa se kwiheba.",en:"Feeling down, depressed, or hopeless.",fr:"Se sentir triste, déprimé(e) ou sans espoir." },
  { id:"P3",scale:"PHQ-9",rw:"Kubura ibitotsi cyangwa se kudashobora gusinzira, cyangwa se gusinzira bikabije.",en:"Trouble falling or staying asleep, or sleeping too much.",fr:"Difficultés à dormir ou sommeil excessif." },
  { id:"P4",scale:"PHQ-9",rw:"Kumva unaniwe cyangwa ufite imbaraga nke cyane.",en:"Feeling tired or having little energy.",fr:"Se sentir fatigué(e) ou manquer d’énergie." },
  { id:"P5",scale:"PHQ-9",rw:"Kumva udashaka kurya cyangwa kurya birenze urugero.",en:"Poor appetite or overeating.",fr:"Manque d’appétit ou manger excessivement." },
  { id:"P6",scale:"PHQ-9",rw:"Kwitekerezaho cyane kandi nabi, kumva nta kamaro ufite, kumva ntacyo wimariye cyangwa umariye umuryango wawe.",en:"Feeling bad about yourself or that you have let yourself or your family down.",fr:"Avoir une mauvaise opinion de soi ou penser avoir déçu ses proches." },
  { id:"P7",scale:"PHQ-9",rw:"Kunanirwa gukurikira ibintu, nko gusoma cyangwa kureba televiziyo.",en:"Trouble concentrating, for example when reading or watching television.",fr:"Difficulté à se concentrer, par exemple en lisant ou en regardant la télévision." },
  { id:"P8",scale:"PHQ-9",rw:"Kugenda cyangwa kuvuga buhoro bidasanzwe, cyangwa kubura umutuzo no guhora ugendagenda.",en:"Moving or speaking unusually slowly, or feeling unusually restless.",fr:"Bouger ou parler anormalement lentement, ou être particulièrement agité(e)." },
  { id:"P9",scale:"PHQ-9",rw:"Ibitekerezo bijyanye no kwigirira nabi cyangwa umutekano wawe.",en:"Thoughts about harming yourself or your personal safety.",fr:"Pensées concernant le fait de vous faire du mal ou votre sécurité." },
  { id:"G1",scale:"GAD-7",rw:"Guhorana impungenge, guhangayika cyangwa se kudashobora umutima hamwe.",en:"Feeling nervous, anxious, or on edge.",fr:"Se sentir nerveux, anxieux ou à cran." },
  { id:"G2",scale:"GAD-7",rw:"Kudashobora guhagarika ibitekerezo byo kugira ubwoba.",en:"Not being able to stop or control worrying.",fr:"Ne pas pouvoir arrêter ou contrôler ses inquiétudes." },
  { id:"G3",scale:"GAD-7",rw:"Kugira ubwoba bwinshi cyane ku bintu bitandukanye.",en:"Worrying too much about different things.",fr:"Trop s’inquiéter à propos de différentes choses." },
  { id:"G4",scale:"GAD-7",rw:"Kutabasha kuruhuka.",en:"Trouble relaxing.",fr:"Avoir du mal à se détendre." },
  { id:"G5",scale:"GAD-7",rw:"Kumva utabasha kuruhuka ukananirwa kwicara hamwe ngo utuze.",en:"Being so restless that it is hard to sit still.",fr:"Être si agité(e) qu’il est difficile de rester assis(e)." },
  { id:"G6",scale:"GAD-7",rw:"Kurakazwa n'ubusa, kumva ubangamiwe n'ibintu bidafite agaciro.",en:"Becoming easily annoyed or irritable.",fr:"Être facilement contrarié(e) ou irritable." },
  { id:"G7",scale:"GAD-7",rw:"Kugira ubwoba ko hari ikintu kibi gishobora kuba.",en:"Feeling afraid that something awful might happen.",fr:"Avoir peur qu’un événement terrible se produise." },
]

const copy = {
 RW:{title:"Isuzuma ry'ubuzima bwo mu mutwe",intro:"Ibibazo byo muri PHQ-9 na GAD-7 byo mu nyandiko watanze.",period:"Mu byumweru 2 bishize, ibi bibazo byakubayeho kangahe?",options:["Nta na gato","Iminsi mike","Iminsi irenga kimwe cya kabiri cy'ibyumweru bibiri bishize","Hafi ya buri munsi"],next:"Komeza",back:"Subira inyuma",submit:"Reba ibisubizo",complete:"Ibisubizo by'isuzuma",depression:"Ibimenyetso bijyanye n'umubabaro",anxiety:"Ibimenyetso bijyanye n'impungenge",impairment:"Ibi bibazo byakugoye ku rugero rungana iki mu kazi, mu rugo cyangwa mu mibanire?",impact:["Ntago bikomeye","Bikomeyeho gato","Birakomeye","Birakomeye cyane"],startAgain:"Ongera utangire",caution:"Ibi ni ibipimo byo gusuzuma ibimenyetso, si isuzuma rya muganga cyangwa icyemezo cy'uburwayi.",support:"Niba ibimenyetso bikugoye, ganira n'umuganga cyangwa inzobere mu buzima bwo mu mutwe.",urgent:"Igisubizo cyawe ku kibazo cy'umutekano kigaragaza ko ugomba kuvugana n'umuntu ubishoboye ubu. Bwira umuntu mukuru cyangwa umuntu wizeye, kandi ushake ubufasha bwihutirwa niba utameze neza.",severity:["Bike cyane","Bike","Biringaniye","Bikomeye","Bikomeye cyane"],privacy:"Ibisubizo bigumye kuri uru rupapuro gusa; ntibibikwa muri konti yawe."},
 EN:{title:"Mental health questionnaire",intro:"PHQ-9 and GAD-7 questions adapted from your scanned document.",period:"Over the last 2 weeks, how often have you been bothered by these problems?",options:["Not at all","Several days","More than half the days","Nearly every day"],next:"Continue",back:"Back",submit:"View results",complete:"Your screening results",depression:"Low-mood symptom screening",anxiety:"Anxiety symptom screening",impairment:"How difficult have these problems made work, home responsibilities, or relationships?",impact:["Not difficult at all","Somewhat difficult","Very difficult","Extremely difficult"],startAgain:"Start again",caution:"These are screening scores, not a diagnosis or a substitute for clinical assessment.",support:"If symptoms are affecting your life, consider speaking with a qualified healthcare professional.",urgent:"Your answer to the safety question suggests that you should speak to a trusted adult or qualified professional now. Seek urgent local help if you are in immediate danger.",severity:["Minimal","Mild","Moderate","Moderately severe","Severe"],privacy:"Responses stay on this page only and are not saved to your account."},
 FR:{title:"Questionnaire de santé mentale",intro:"Questions PHQ-9 et GAD-7 adaptées du document numérisé.",period:"Au cours des 2 dernières semaines, à quelle fréquence avez-vous rencontré ces difficultés ?",options:["Jamais","Plusieurs jours","Plus de la moitié des jours","Presque tous les jours"],next:"Continuer",back:"Retour",submit:"Voir les résultats",complete:"Vos résultats de dépistage",depression:"Dépistage des symptômes dépressifs",anxiety:"Dépistage des symptômes anxieux",impairment:"À quel point ces difficultés ont-elles perturbé vos activités ou vos relations ?",impact:["Pas du tout","Un peu","Beaucoup","Énormément"],startAgain:"Recommencer",caution:"Ces scores servent au dépistage, pas au diagnostic médical.",support:"Si ces difficultés affectent votre vie, parlez-en à un professionnel de santé qualifié.",urgent:"Votre réponse à la question de sécurité indique qu'il est important d'en parler maintenant à un adulte de confiance ou à un professionnel. En cas de danger immédiat, demandez une aide urgente locale.",severity:["Minime","Léger","Modéré","Modérément sévère","Sévère"],privacy:"Les réponses restent sur cette page et ne sont pas enregistrées dans votre compte."}
}

function severity(score:number, scale:Scale):number {
 if (scale==="PHQ-9") return score<5?0:score<10?1:score<15?2:score<20?3:4
 return score<5?0:score<10?1:score<15?2:4
}

export default function AssessmentPage(){
 const [language,setLanguage]=useState<Language>("RW")
 const [responses,setResponses]=useState<Record<string,number>>({})
 const [index,setIndex]=useState(0)
 const [impact,setImpact]=useState<number|null>(null)
 const [done,setDone]=useState(false)
 const t=copy[language]
 const question=questions[index]
 const count=Object.keys(responses).length
 const totals=useMemo(()=>({
  phq:questions.filter(q=>q.scale==="PHQ-9").reduce((s,q)=>s+(responses[q.id]??0),0),
  gad:questions.filter(q=>q.scale==="GAD-7").reduce((s,q)=>s+(responses[q.id]??0),0)
 }),[responses])
 const reset=()=>{setResponses({});setIndex(0);setImpact(null);setDone(false)}
 const next=()=>{if(index<questions.length-1)setIndex(i=>i+1);else setDone(true)}
 return <main className="min-h-screen bg-[#f5f8fa] px-4 py-8 text-[#17324a] sm:py-12">
  <div className="mx-auto max-w-3xl">
   <header className="mb-8 flex items-center justify-between gap-3">
    <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0d8fa5] hover:underline"><ArrowLeft className="size-4"/>MindCare</Link>
    <select aria-label="Questionnaire language" value={language} onChange={e=>setLanguage(e.target.value as Language)} className="rounded-lg border border-[#dfe9ee] bg-white px-3 py-2 text-sm font-semibold"><option value="RW">Kinyarwanda</option><option value="EN">English</option><option value="FR">Français</option></select>
   </header>
   <section className="rounded-3xl border border-[#dfe9ee] bg-white p-6 shadow-sm sm:p-9">
    <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-[#e9f8fa] text-[#0d8fa5]"><HeartPulse className="size-6"/></span><div><h1 className="text-xl font-bold sm:text-2xl">{t.title}</h1><p className="mt-1 text-xs text-[#748996]">{t.intro}</p></div></div>
    {!done ? <>
      <div className="mt-8 flex items-center justify-between text-xs font-semibold text-[#718896]"><span>{question.scale} · {question.id}</span><span>{count} / {questions.length}</span></div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#ebf2f4]"><div className="h-full rounded-full bg-[#0d8fa5] transition-all" style={{width:`${count/questions.length*100}%`}}/></div>
      <p className="mt-8 text-sm font-medium text-[#718896]">{t.period}</p>
      <h2 className="mt-3 text-lg font-bold leading-8">{question[language.toLowerCase() as "rw"|"en"|"fr"]}</h2>
      <fieldset className="mt-6 space-y-3"><legend className="sr-only">{question.id}</legend>{t.options.map((option,score)=><label key={score} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm font-semibold transition ${responses[question.id]===score?"border-[#0d8fa5] bg-[#edf9fa] text-[#087f95]":"border-[#e4edef] hover:border-[#9ad8dd]"}`}><input type="radio" name={question.id} value={score} checked={responses[question.id]===score} onChange={()=>setResponses(old=>({...old,[question.id]:score}))} className="size-4 accent-[#0d8fa5]"/><span>{option}</span><span className="ml-auto text-xs text-[#8096a2]">{score}</span></label>)}</fieldset>
      <div className="mt-8 flex gap-3"><button type="button" onClick={()=>setIndex(i=>Math.max(0,i-1))} disabled={index===0} className="rounded-xl border border-[#dfe9ee] px-5 py-3 text-sm font-semibold disabled:opacity-40">{t.back}</button><button type="button" onClick={next} disabled={responses[question.id]===undefined} className="ml-auto inline-flex items-center gap-2 rounded-xl bg-[#0d8fa5] px-6 py-3 text-sm font-bold text-white disabled:opacity-40">{index===questions.length-1?t.submit:t.next}<ArrowRight className="size-4"/></button></div>
    </> : <>
      <div className="mt-8 flex items-center gap-2 text-[#168e7c]"><CheckCircle2 className="size-5"/><h2 className="text-lg font-bold">{t.complete}</h2></div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
       {([{scale:"PHQ-9",score:totals.phq,max:27,title:t.depression},{scale:"GAD-7",score:totals.gad,max:21,title:t.anxiety}] as const).map(r=><div key={r.scale} className="rounded-2xl border border-[#dce9ed] bg-[#f7fbfc] p-5"><p className="text-xs font-bold text-[#0d8fa5]">{r.scale}</p><p className="mt-2 text-sm font-semibold">{r.title}</p><p className="mt-3 text-3xl font-bold">{r.score}<span className="text-sm font-normal text-[#8296a0]"> / {r.max}</span></p><p className="mt-1 text-xs font-semibold text-[#607c87]">{t.severity[severity(r.score,r.scale)]}</p></div>)}
      </div>
      {responses.P9!==undefined && responses.P9>0 && <div role="alert" className="mt-5 rounded-xl border border-[#e9c7c7] bg-[#fff7f7] p-5 text-sm leading-6 text-[#793b3b]">{t.urgent}</div>}
      <div className="mt-6"><p className="text-sm font-semibold">{t.impairment}</p><div className="mt-3 grid gap-2 sm:grid-cols-2">{t.impact.map((v,i)=><label key={i} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-3 text-xs ${impact===i?"border-[#0d8fa5] bg-[#edf9fa]":"border-[#e4edef]"}`}><input type="radio" name="impact" checked={impact===i} onChange={()=>setImpact(i)} className="accent-[#0d8fa5]"/>{v}</label>)}</div></div>
      <div className="mt-6 rounded-xl bg-[#edf9fa] p-5"><p className="text-sm font-bold">{t.caution}</p><p className="mt-2 text-sm leading-6">{t.support}</p></div>
      <button type="button" onClick={reset} className="mt-6 rounded-xl bg-[#17324a] px-5 py-3 text-sm font-bold text-white">{t.startAgain}</button>
    </>}
    <div className="mt-8 flex items-start gap-2 border-t border-[#e8eff1] pt-5 text-xs leading-5 text-[#748996]"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#0d8fa5]"/>{t.privacy}</div>
   </section>
  </div>
 </main>
}
