"use client"

import { useMemo, useState } from "react"
import { useMindCareLanguage } from "@/lib/use-mindcare-language"
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
  { id:"G1",scale:"GAD-7",rw:"Guhorana impungenge, guhangayika cyangwa se kudashyira umutima hamwe.",en:"Feeling nervous, anxious, or on edge.",fr:"Se sentir nerveux, anxieux ou à cran." },
  { id:"G2",scale:"GAD-7",rw:"Kudashobora guhagarika ibitekerezo byo kugira ubwoba.",en:"Not being able to stop or control worrying.",fr:"Ne pas pouvoir arrêter ou contrôler ses inquiétudes." },
  { id:"G3",scale:"GAD-7",rw:"Kugira ubwoba bwinshi cyane ku bintu bitandukanye.",en:"Worrying too much about different things.",fr:"Trop s’inquiéter à propos de différentes choses." },
  { id:"G4",scale:"GAD-7",rw:"Kutabasha kuruhuka.",en:"Trouble relaxing.",fr:"Avoir du mal à se détendre." },
  { id:"G5",scale:"GAD-7",rw:"Kumva utabasha kuruhuka ukananirwa kwicara hamwe ngo utuze.",en:"Being so restless that it is hard to sit still.",fr:"Être si agité(e) qu’il est difficile de rester assis(e)." },
  { id:"G6",scale:"GAD-7",rw:"Kurakazwa n'ubusa, kumva ubangamiwe n'ibintu bidafite agaciro.",en:"Becoming easily annoyed or irritable.",fr:"Être facilement contrarié(e) ou irritable." },
  { id:"G7",scale:"GAD-7",rw:"Kugira ubwoba ko hari ikintu kibi gishobora kuba.",en:"Feeling afraid that something awful might happen.",fr:"Avoir peur qu’un événement terrible se produise." },
]

const copy = {
 RW:{title:"Isuzuma ry'ubuzima bwo mu mutwe",intro:"Hitamo isuzuma ushaka gukora: PHQ-9 cyangwa GAD-7.",period:"Mu byumweru 2 bishize, ibi bibazo byakubayeho kangahe?",options:["Nta na gato","Iminsi mike","Iminsi irenga kimwe cya kabiri cy'ibyumweru bibiri bishize","Hafi ya buri munsi"],next:"Komeza",back:"Subira inyuma",submit:"Reba ibisubizo",complete:"Ibisubizo by'isuzuma",depression:"Ibimenyetso bijyanye n'umubabaro",anxiety:"Ibimenyetso bijyanye n'impungenge",impairment:"Ibi bibazo byakugoye ku rugero rungana iki mu kazi, mu rugo cyangwa mu mibanire?",impact:["Ntago bikomeye","Bikomeyeho gato","Birakomeye","Birakomeye cyane"],startAgain:"Ongera utangire",caution:"Ibi ni ibipimo byo gusuzuma ibimenyetso, si isuzuma rya muganga cyangwa icyemezo cy'uburwayi.",support:"Niba ibimenyetso bikugoye, ganira n'umuganga cyangwa inzobere mu buzima bwo mu mutwe.",urgent:"Igisubizo cyawe ku kibazo cy'umutekano kigaragaza ko ugomba kuvugana n'umuntu ubishoboye ubu. Bwira umuntu mukuru cyangwa umuntu wizeye, kandi ushake ubufasha bwihutirwa niba utameze neza.",severity:["Bike cyane","Bike","Biringaniye","Bikomeye","Bikomeye cyane"],privacy:"Ibisubizo bigumye kuri uru rupapuro gusa; ntibibikwa muri konti yawe."},
 EN:{title:"Mental health questionnaire",intro:"Choose one screening questionnaire to complete independently.",period:"Over the last 2 weeks, how often have you been bothered by these problems?",options:["Not at all","Several days","More than half the days","Nearly every day"],next:"Continue",back:"Back",submit:"View results",complete:"Your screening results",depression:"Low-mood symptom screening",anxiety:"Anxiety symptom screening",impairment:"How difficult have these problems made work, home responsibilities, or relationships?",impact:["Not difficult at all","Somewhat difficult","Very difficult","Extremely difficult"],startAgain:"Start again",caution:"These are screening scores, not a diagnosis or a substitute for clinical assessment.",support:"If symptoms are affecting your life, consider speaking with a qualified healthcare professional.",urgent:"Your answer to the safety question suggests that you should speak to a trusted adult or qualified professional now. Seek urgent local help if you are in immediate danger.",severity:["Minimal","Mild","Moderate","Moderately severe","Severe"],privacy:"Responses stay on this page only and are not saved to your account."},
 FR:{title:"Questionnaire de santé mentale",intro:"Choisissez un questionnaire de dépistage à remplir séparément.",period:"Au cours des 2 dernières semaines, à quelle fréquence avez-vous rencontré ces difficultés ?",options:["Jamais","Plusieurs jours","Plus de la moitié des jours","Presque tous les jours"],next:"Continuer",back:"Retour",submit:"Voir les résultats",complete:"Vos résultats de dépistage",depression:"Dépistage des symptômes dépressifs",anxiety:"Dépistage des symptômes anxieux",impairment:"À quel point ces difficultés ont-elles perturbé vos activités ou vos relations ?",impact:["Pas du tout","Un peu","Beaucoup","Énormément"],startAgain:"Recommencer",caution:"Ces scores servent au dépistage, pas au diagnostic médical.",support:"Si ces difficultés affectent votre vie, parlez-en à un professionnel de santé qualifié.",urgent:"Votre réponse à la question de sécurité indique qu'il est important d'en parler maintenant à un adulte de confiance ou à un professionnel. En cas de danger immédiat, demandez une aide urgente locale.",severity:["Minime","Léger","Modéré","Modérément sévère","Sévère"],privacy:"Les réponses restent sur cette page et ne sont pas enregistrées dans votre compte."}
}

function severity(score:number, scale:Scale):number {
 if (scale==="PHQ-9") return score<5?0:score<10?1:score<15?2:score<20?3:4
 return score<5?0:score<10?1:score<15?2:3
}

export default function AssessmentPage(){
 const [language,setLanguage]=useMindCareLanguage()
 const [scale,setScale]=useState<Scale|null>(()=>{if(typeof window==="undefined")return null;const s=new URLSearchParams(window.location.search).get("scale");return s==="PHQ-9"||s==="GAD-7"?s:null})
 const [responses,setResponses]=useState<Record<string,number>>({})
 const [index,setIndex]=useState(0)
 const [impact,setImpact]=useState<number|null>(null)
 const [done,setDone]=useState(false)
 const t=copy[language]
 const selectedQuestions=questions.filter(q=>q.scale===scale)
 const question=selectedQuestions[index]
 const count=selectedQuestions.filter(q=>responses[q.id]!==undefined).length
 const totals=useMemo(()=>({
  phq:questions.filter(q=>q.scale==="PHQ-9").reduce((s,q)=>s+(responses[q.id]??0),0),
  gad:questions.filter(q=>q.scale==="GAD-7").reduce((s,q)=>s+(responses[q.id]??0),0)
 }),[responses])
 const reset=()=>{setResponses({});setIndex(0);setImpact(null);setDone(false)}
 const choose=(selected:Scale)=>{reset();setScale(selected)}
 const next=()=>{if(index<selectedQuestions.length-1)setIndex(i=>i+1);else setDone(true)}
 return <main className="min-h-screen bg-[#f5f8fa] px-4 py-8 text-[#17324a] sm:py-12">
  <div className="mx-auto max-w-3xl">
   <header className="mb-8 flex items-center justify-between gap-3">
    <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0D4A8A] hover:underline"><ArrowLeft className="size-4"/>MindCare</Link>
    <select aria-label="Questionnaire language" value={language} onChange={e=>setLanguage(e.target.value as Language)} className="rounded-lg border border-[#dfe9ee] bg-white px-3 py-2 text-sm font-semibold"><option value="RW">Kinyarwanda</option><option value="EN">English</option><option value="FR">Français</option></select>
   </header>
   <section className="rounded-3xl border border-[#dfe9ee] bg-white p-6 shadow-sm sm:p-9">
    <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-[#EAF2FC] text-[#0D4A8A]"><HeartPulse className="size-6"/></span><div><h1 className="text-xl font-bold sm:text-2xl">{t.title}</h1><p className="mt-1 text-xs text-[#748996]">{t.intro}</p></div></div>
    {!scale ? <div className="mt-8 grid gap-4 sm:grid-cols-2">{(["PHQ-9","GAD-7"] as const).map(item=><button key={item} type="button" onClick={()=>choose(item)} className="rounded-2xl border border-[#D5E4F6] bg-[#F5F8FE] p-6 text-left transition hover:border-[#0D4A8A] hover:shadow-md"><span className="text-xl font-bold text-[#0D4A8A]">{item}</span><p className="mt-2 text-sm font-semibold">{item==="PHQ-9"?t.depression:t.anxiety}</p><p className="mt-2 text-xs text-[#748996]">{item==="PHQ-9"?"9":"7"} {language==="RW"?"ibibazo":language==="FR"?"questions":"questions"}</p></button>)}<Link href="/assessment/audit" className="rounded-2xl border border-[#D5E4F6] bg-[#F5F8FE] p-6 text-left hover:border-[#0D4A8A]"><span className="text-xl font-bold text-[#0D4A8A]">AUDIT</span><p className="mt-2 text-sm font-semibold">{language==="RW"?"Isuzuma ry'ingaruka z'inzoga":language==="FR"?"Dépistage des risques liés à l’alcool":"Alcohol risk screening"}</p></Link><div className="rounded-2xl border border-[#D5E4F6] bg-[#F5F8FE] p-6"><span className="text-xl font-bold text-[#0D4A8A]">CIWA-Ar</span><p className="mt-2 text-sm">{language==="RW"?"Isuzuma rikorwa n'inzobere mu buzima gusa.":language==="FR"?"Évaluation réservée aux professionnels de santé.":"Clinician-administered withdrawal assessment only."}</p></div></div> : !done ? <>
      <div className="mt-8 flex items-center justify-between text-xs font-semibold text-[#718896]"><span>{scale} · {question.id}</span><span>{count} / {selectedQuestions.length}</span></div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E5EDF8]"><div className="h-full rounded-full bg-[#0D4A8A] transition-all" style={{width:`${count/selectedQuestions.length*100}%`}}/></div>
      <p className="mt-8 text-sm font-medium text-[#718896]">{t.period}</p>
      <h2 className="mt-3 text-lg font-bold leading-8">{question[language.toLowerCase() as "rw"|"en"|"fr"]}</h2>
      <fieldset className="mt-6 space-y-3"><legend className="sr-only">{question.id}</legend>{t.options.map((option,score)=><label key={score} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm font-semibold transition ${responses[question.id]===score?"border-[#0D4A8A] bg-[#EDF3FB] text-[#093B70]":"border-[#e4edef] hover:border-[#A4C5EA]"}`}><input type="radio" name={question.id} value={score} checked={responses[question.id]===score} onChange={()=>setResponses(old=>({...old,[question.id]:score}))} className="size-4 accent-[#0D4A8A]"/><span>{option}</span><span className="ml-auto text-xs text-[#8096a2]">{score}</span></label>)}</fieldset>
      <div className="mt-8 flex gap-3"><button type="button" onClick={()=>setIndex(i=>Math.max(0,i-1))} disabled={index===0} className="rounded-xl border border-[#dfe9ee] px-5 py-3 text-sm font-semibold disabled:opacity-40">{t.back}</button><button type="button" onClick={next} disabled={responses[question.id]===undefined} className="ml-auto inline-flex items-center gap-2 rounded-xl bg-[#0D4A8A] px-6 py-3 text-sm font-bold text-white disabled:opacity-40">{index===selectedQuestions.length-1?t.submit:t.next}<ArrowRight className="size-4"/></button></div>
    </> : <>
      <div className="mt-8 flex items-center gap-2 text-[#0D4A8A]"><CheckCircle2 className="size-5"/><h2 className="text-lg font-bold">{t.complete}</h2></div>
      <div className="mt-5 space-y-4">
       {([{scale:"PHQ-9",score:totals.phq,max:27,title:t.depression},{scale:"GAD-7",score:totals.gad,max:21,title:t.anxiety}] as const).filter(r=>r.scale===scale).map(r=>{
         const level=severity(r.score,r.scale)
         const answer=r.scale==="GAD-7" ? (language==="RW" ? ["Ntago bikomeye","Bikomeyeho gato","Birakomeye","Birakomeye cyane"] : language==="FR" ? ["Minime","Léger","Modéré","Sévère"] : ["Minimal","Mild","Moderate","Severe"])[level] : t.severity[level]
         const explanation = r.scale==="GAD-7"
           ? (language==="RW" ? ["Ibisubizo byawe byerekana ibimenyetso bike cyane by'impungenge.","Ibisubizo byawe byerekana ibimenyetso byoroheje by'impungenge.","Ibisubizo byawe byerekana ibimenyetso biringaniye by'impungenge.","Ibisubizo byawe byerekana ibimenyetso bikomeye by'impungenge."] : language==="FR" ? ["Vos réponses indiquent très peu de symptômes anxieux.","Vos réponses indiquent des symptômes anxieux légers.","Vos réponses indiquent des symptômes anxieux modérés.","Vos réponses indiquent des symptômes anxieux importants."] : ["Your answers suggest minimal anxiety symptoms.","Your answers suggest mild anxiety symptoms.","Your answers suggest moderate anxiety symptoms.","Your answers suggest severe anxiety symptoms."])[level]
           : (language==="RW" ? ["Ibisubizo byawe byerekana ibimenyetso bike cyane by'agahinda.","Ibisubizo byawe byerekana ibimenyetso byoroheje by'agahinda.","Ibisubizo byawe byerekana ibimenyetso biringaniye by'agahinda.","Ibisubizo byawe byerekana ibimenyetso bikomeye mu rugero ruciriritse by'agahinda.","Ibisubizo byawe byerekana ibimenyetso bikomeye by'agahinda."] : language==="FR" ? ["Vos réponses suggèrent des symptômes dépressifs minimes.","Vos réponses suggèrent des symptômes dépressifs légers.","Vos réponses suggèrent des symptômes dépressifs modérés.","Vos réponses suggèrent des symptômes dépressifs modérément sévères.","Vos réponses suggèrent des symptômes dépressifs sévères."] : ["Your answers suggest minimal depressive symptoms.","Your answers suggest mild depressive symptoms.","Your answers suggest moderate depressive symptoms.","Your answers suggest moderately severe depressive symptoms.","Your answers suggest severe depressive symptoms."])[level]
         const gadAdvice = language==="RW"
           ? ["Komeza kwita ku mibereho yawe no kuruhuka bihagije. Niba impungenge zikomeje, ganira n'umuntu wizeye cyangwa inzobere.","Gerageza kuruhuka, gukora imyitozo yo guhumeka buhoro no kuganira n'umuntu wizeye. Niba impungenge zikomeje, shaka ubufasha bw'inzobere.","Impungenge zishobora kugira ingaruka ku buzima bwa buri munsi. Ganira n'umuganga cyangwa inzobere mu buzima bwo mu mutwe kugira ngo ubone ubufasha bukwiye.","Ibisubizo byawe byerekana impungenge nyinshi. Ni byiza kugana umuganga cyangwa inzobere mu buzima bwo mu mutwe vuba kugira ngo muganire ku bufasha bukwiye."]
           : language==="FR"
           ? ["Continuez à prendre soin de vous. Si l'inquiétude persiste, parlez-en à une personne de confiance ou à un professionnel.","Essayez des exercices de respiration et parlez à une personne de confiance. Si les symptômes persistent, consultez un professionnel.","L'anxiété peut perturber la vie quotidienne. Discutez de vos résultats avec un professionnel de santé.","Vos réponses indiquent des symptômes anxieux importants. Consultez prochainement un professionnel de santé pour un accompagnement adapté."]
           : ["Continue caring for your wellbeing. If worry persists, talk with someone you trust or a professional.","Try gentle breathing exercises and talk with someone you trust. Seek professional support if symptoms persist.","Anxiety symptoms can affect everyday life. Consider discussing your results with a qualified healthcare professional.","Your answers suggest significant anxiety symptoms. Arrange to speak with a qualified healthcare professional soon."]
         const nextStep = r.scale==="GAD-7" ? gadAdvice[level] : level>=2
           ? (language==="RW" ? "Byaba byiza uganiriye n'umuganga cyangwa inzobere mu buzima bwo mu mutwe kugira ngo ubone ubufasha bukwiye." : language==="FR" ? "Parlez de vos résultats à un professionnel de santé pour obtenir un accompagnement adapté." : "Consider discussing these results with a qualified healthcare professional for appropriate support.")
           : (language==="RW" ? "Komeza kwita ku buzima bwawe. Niba ibimenyetso bikomeje cyangwa bikugora, ganira n'inzobere mu buzima." : language==="FR" ? "Continuez à prendre soin de vous. Si les symptômes persistent ou vous gênent, parlez-en à un professionnel." : "Keep looking after your wellbeing. If symptoms persist or affect daily life, speak with a professional.")
         return <div key={r.scale} aria-live="polite" className="rounded-2xl border border-[#D5E4F6] bg-[#F5F8FE] p-6">
           <div className="flex items-center justify-between gap-3"><p className="text-xs font-bold text-[#0D4A8A]">{r.scale} · {r.title}</p><span className="text-sm font-bold text-[#0D4A8A]">{r.score}/{r.max}</span></div>
           <h3 className="mt-4 text-2xl font-extrabold text-[#17324a]">{answer}</h3>
           <p className="mt-3 text-sm leading-6 text-[#4E6480]">{explanation} {language==="RW"?"Ibi ni ibimenyetso byagaragajwe n'isuzuma, si icyemezo cy'umuganga.":language==="FR"?"Ce dépistage ne constitue pas un diagnostic médical.":"This screening result is not a medical diagnosis."}</p>
           <div className="mt-4 border-t border-[#D5E4F6] pt-4"><p className="text-sm font-bold text-[#17324a]">{language==="RW"?"Icyo wakora":language==="FR"?"Que faire ensuite":"What to do next"}</p><p className="mt-2 text-sm leading-6 text-[#4E6480]">{nextStep}</p>{r.scale==="PHQ-9" && responses.P9!==undefined && responses.P9>0 && <p role="alert" className="mt-3 text-sm leading-6 font-semibold text-[#17324a]">{t.urgent}</p>}</div>
         </div>
       })}
      </div>
      
      <div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={reset} className="rounded-xl bg-[#17324a] px-5 py-3 text-sm font-bold text-white">{t.startAgain}</button><button type="button" onClick={()=>{reset();setScale(null)}} className="rounded-xl border border-[#D5E4F6] px-5 py-3 text-sm font-bold">{language==="RW"?"Hitamo irindi suzuma":language==="FR"?"Choisir un autre test":"Choose another assessment"}</button></div>
    </>}
    <div className="mt-8 flex items-start gap-2 border-t border-[#e8eff1] pt-5 text-xs leading-5 text-[#748996]"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#0D4A8A]"/>{t.privacy}</div>
   </section>
  </div>
 </main>
}
