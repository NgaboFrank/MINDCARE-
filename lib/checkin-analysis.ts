export type Language = "EN" | "FR"
type Topic = { id: string; label: Record<Language, string>; advice: Record<Language, string>; followup: Record<Language, string> }
const topics: Topic[] = [
 {id:"mood",label:{EN:"Mood and enjoyment",FR:"Humeur et intérêt"},advice:{EN:"Try one manageable activity you usually enjoy, and consider sharing how you feel with someone you trust.",FR:"Essayez une activité agréable et accessible, et parlez de vos émotions à une personne de confiance."},followup:{EN:"If low mood or loss of interest persists, discuss it with a healthcare professional.",FR:"Si la tristesse ou la perte d’intérêt persiste, parlez-en à un professionnel de santé."}},
 {id:"worry",label:{EN:"Worry and anxiety",FR:"Inquiétudes et anxiété"},advice:{EN:"Take a short pause, breathe slowly, and write down one worry you can address today.",FR:"Faites une courte pause, respirez lentement et notez une inquiétude sur laquelle vous pouvez agir aujourd’hui."},followup:{EN:"If worries feel hard to control or affect daily life, seek professional support.",FR:"Si les inquiétudes deviennent difficiles à gérer ou perturbent votre quotidien, demandez de l’aide."}},
 {id:"stress",label:{EN:"Daily stress",FR:"Stress quotidien"},advice:{EN:"Choose one priority, break it into a small next step, and plan a short break.",FR:"Choisissez une priorité, divisez-la en une petite étape et prévoyez une courte pause."},followup:{EN:"If stress keeps interfering with daily activities, talk to a qualified professional.",FR:"Si le stress continue de perturber vos activités, consultez un professionnel qualifié."}},
 {id:"sleep",label:{EN:"Sleep",FR:"Sommeil"},advice:{EN:"Try a consistent wake time and a calming routine before bed.",FR:"Essayez de vous lever à heure régulière et d’adopter une routine apaisante avant de dormir."},followup:{EN:"Persistent sleep problems deserve a discussion with a healthcare professional.",FR:"Des troubles du sommeil persistants méritent une consultation médicale."}},
 {id:"focus",label:{EN:"Concentration",FR:"Concentration"},advice:{EN:"Work on one task at a time for a short period, with distractions reduced.",FR:"Concentrez-vous sur une seule tâche pendant une courte période, en limitant les distractions."},followup:{EN:"If concentration difficulties affect school, work or everyday tasks, seek advice.",FR:"Si les difficultés de concentration perturbent vos études, votre travail ou votre quotidien, demandez conseil."}},
 {id:"support",label:{EN:"Connection and support",FR:"Lien social et soutien"},advice:{EN:"Consider contacting a trusted friend, family member, or supportive adult.",FR:"Envisagez de contacter un ami, un membre de votre famille ou un adulte de confiance."},followup:{EN:"If isolation is ongoing, a counselor or local support service may help.",FR:"Si l’isolement persiste, un conseiller ou un service d’aide local peut vous accompagner."}},
 {id:"energy",label:{EN:"Energy",FR:"Énergie"},advice:{EN:"Aim for regular meals, rest, and gentle movement when possible.",FR:"Essayez de manger régulièrement, de vous reposer et de bouger doucement si possible."},followup:{EN:"Ongoing unusual tiredness can have many causes; a healthcare professional can assess them.",FR:"Une fatigue inhabituelle persistante peut avoir plusieurs causes ; un professionnel peut les évaluer."}},
 {id:"function",label:{EN:"Impact on daily life",FR:"Impact sur le quotidien"},advice:{EN:"Identify which daily activity feels hardest and ask for practical support with it.",FR:"Identifiez l’activité quotidienne la plus difficile et demandez une aide concrète."},followup:{EN:"When difficulties affect daily functioning, arranging a professional assessment is especially useful.",FR:"Lorsque les difficultés perturbent le quotidien, une évaluation professionnelle est particulièrement utile."}},
]
export function analyzeCheckin(answers: number[], language: Language) {
 if (answers.length !== topics.length || answers.some(v => !Number.isInteger(v) || v < 0 || v > 3)) return null
 const ranked = topics.map((topic,index)=>({...topic,score:answers[index]})).sort((a,b)=>b.score-a.score)
 const notable = ranked.filter(item=>item.score>=1)
 const main = notable.slice(0,3)
 const frequency = (score:number)=> language==="FR" ? ["Jamais","Parfois","Souvent","Presque tous les jours"][score] : ["Never","Sometimes","Often","Almost every day"][score]
 const impact = answers[7]
 const frequent = answers.filter(value=>value>=2).length
 const topLabel = (id:string) => topics.find(t=>t.id===id)?.label[language] ?? id
 const keyAreas = main.map(x=>topLabel(x.id)).join(", ")
 const concern = impact>=2 || frequent>=4 ? "elevated" : frequent>=2 || impact===1 ? "notable" : notable.length ? "some" : "few"
 const recommendations:Record<string,Record<Language,string>> = {
 elevated:{EN:"Your answers show several frequent difficulties or significant disruption to everyday activities. Arrange an assessment with a qualified healthcare professional. If you feel unable to manage daily activities, seek support promptly.",FR:"Vos réponses indiquent plusieurs difficultés fréquentes ou un impact important sur le quotidien. Prenez rendez-vous avec un professionnel de santé qualifié. Si vous n’arrivez plus à gérer vos activités, demandez rapidement de l’aide."},
 notable:{EN:"Some difficulties are affecting your wellbeing. Try the suggestions for your most reported concerns below. Consider professional support, especially if these difficulties persist, increase, or interfere with everyday life.",FR:"Certaines difficultés affectent votre bien-être. Essayez les conseils adaptés ci-dessous. Envisagez un soutien professionnel, surtout si elles persistent, s’aggravent ou perturbent votre quotidien."},
 some:{EN:"You reported occasional difficulties. Choose one practical suggestion below and check how you feel over the coming days. You can seek professional advice at any time if concerned.",FR:"Vous avez signalé des difficultés occasionnelles. Choisissez un conseil pratique ci-dessous et observez comment vous vous sentez dans les prochains jours. Vous pouvez demander conseil à tout moment."},
 few:{EN:"You reported few difficulties over the past two weeks. Continue routines that support your wellbeing. A low score cannot rule out a health concern.",FR:"Vous avez signalé peu de difficultés au cours des deux dernières semaines. Continuez les habitudes favorables à votre bien-être. Un faible score n’exclut pas un problème de santé."}
 }
 const recommendation=recommendations[concern][language]
 const explanation=main.length ? (language==="FR" ? `Les réponses les plus marquées concernent : ${keyAreas}. Les conseils ci-dessous correspondent à ces réponses.` : `Your most reported areas were: ${keyAreas}. The suggestions below are selected from those answers.`) : (language==="FR"?"Aucune difficulté n’a été signalée dans ce questionnaire.":"No difficulties were reported in this check-in.")
 const careLevel=concern==="elevated"?"recommended":concern==="notable"?"consider":"optional"
 const actionList=main.map(item=>item.advice[language])
 const finalAdvice = concern==="elevated"
  ? (language==="FR"?"Vos réponses montrent plusieurs difficultés fréquentes ou un impact important sur votre quotidien. La meilleure prochaine étape est de prendre rendez-vous avec un professionnel de santé qualifié pour une évaluation. En attendant, commencez par une petite action adaptée à votre principale difficulté.":"Your answers show frequent difficulties or a meaningful impact on daily life. Your best next step is to arrange an assessment with a qualified healthcare professional. Meanwhile, start with one manageable action for your main concern.")
  : concern==="notable"
  ? (language==="FR"?"Commencez par les conseils pratiques ci-dessous, en priorité pour les difficultés que vous avez le plus signalées. Si elles persistent, s’aggravent ou perturbent votre quotidien, prenez rendez-vous avec un professionnel de santé.":"Start with the practical steps below, focusing on your most reported difficulties. If they persist, worsen, or affect daily life, arrange an appointment with a qualified healthcare professional.")
  : concern==="some"
  ? (language==="FR"?"Vos réponses suggèrent des difficultés occasionnelles. Choisissez une action simple ci-dessous et voyez si elle vous aide dans les prochains jours. Demandez un avis professionnel si les difficultés persistent, s’aggravent ou vous préoccupent.":"Your answers suggest occasional difficulties. Choose one simple action below and see whether it helps over the coming days. Seek professional advice if problems persist, worsen, or concern you.")
  : (language==="FR"?"Vous avez signalé peu de difficultés. Continuez les habitudes qui favorisent votre bien-être. Si quelque chose vous préoccupe malgré ce résultat, demandez conseil à un professionnel.":"You reported few difficulties. Continue the habits that support your wellbeing. If something still concerns you despite this result, seek professional advice.")
 const pairKey = [main[0]?.id,main[1]?.id].filter(Boolean).sort().join("|")
 const pairInsights:Record<string,Record<Language,string>> = {
  "focus|worry":{EN:"Worry can make it harder to focus. Writing down one concern before starting a short task may help.",FR:"Les inquiétudes peuvent rendre la concentration difficile. Noter une préoccupation avant une courte tâche peut aider."},
  "energy|sleep":{EN:"Sleep difficulties and tiredness can affect each other. A regular sleep routine may help, although persistent fatigue can have other causes.",FR:"Les difficultés de sommeil et la fatigue peuvent s’influencer. Une routine régulière peut aider, mais une fatigue persistante peut avoir d’autres causes."},
  "mood|support":{EN:"Feeling disconnected can make low mood harder to manage. Consider reaching out to a trusted person.",FR:"L’isolement peut compliquer la gestion d’une baisse de moral. Pensez à contacter une personne de confiance."},
  "sleep|stress":{EN:"Stress may affect sleep. A calmer evening routine and a short plan for tomorrow may help.",FR:"Le stress peut perturber le sommeil. Une routine calme le soir et un petit plan pour demain peuvent aider."},
  "energy|mood":{EN:"Low mood and low energy may occur together. Start with a small, manageable activity rather than expecting a full change at once.",FR:"Une baisse de moral et d’énergie peuvent survenir ensemble. Commencez par une petite activité réalisable."}
 }
 const insight=pairInsights[pairKey]?.[language] ?? (main.length>=2 ? (language==="FR"?"Plusieurs difficultés ont été signalées. Elles peuvent parfois s’influencer, mais ce questionnaire ne permet pas d’en déterminer la cause.":"You reported more than one difficulty. They may influence one another, but this check-in cannot establish their cause.") : main.length===1 ? (language==="FR"?"Cette difficulté mérite votre attention, surtout si elle persiste.":"This concern is worth paying attention to, especially if it continues.") : (language==="FR"?"Vous n’avez signalé aucune difficulté dans ces questions.":"You did not report difficulties on these questions."))
 const actionPlan=main.length ? [...new Set(main.map(item=>item.advice[language]))].slice(0,3) : [language==="FR"?"Continuez les routines de sommeil et de repos qui vous conviennent.":"Continue the sleep and rest routines that work for you.",language==="FR"?"Restez en contact avec des personnes de confiance.":"Stay connected with people you trust."]
 const followup=concern==="elevated" ? (language==="FR"?"Prenez contact avec un professionnel de santé prochainement, surtout si vos activités quotidiennes sont perturbées. Si vous avez besoin d’une aide immédiate, contactez les services d’urgence locaux ou une personne de confiance.":"Arrange a professional assessment soon, especially if daily activities are affected. If you need immediate help, contact local emergency services or a trusted person.") : (language==="FR"?"Refaites le point dans environ deux semaines, ou plus tôt si les difficultés s’aggravent. Si elles persistent ou perturbent votre quotidien, demandez un avis professionnel.":"Check in with yourself again in about two weeks, or sooner if things worsen. Seek professional advice if concerns persist or affect daily life.")
 const finalConclusion=main.length ? (language==="FR"?`Vos réponses indiquent surtout : ${keyAreas}. ${recommendation}`:`Your answers mainly highlight: ${keyAreas}. ${recommendation}`) : recommendation
 const finalHeading=language==="FR"?"Votre conseil final personnalisé":"Your personalized final advice"
 const nextStep=language==="FR"?"Votre prochaine étape":"Your next step"

 return {
  title: language==="FR" ? "Résumé personnalisé de vos réponses" : "Your personalized response summary",
  recommendation,
  explanation,
  careLevel,
  finalAdvice,
  finalConclusion,
  insight,
  actionPlan,
  followup,
  finalHeading,
  nextStep,
  actionList,
  details: main.map(item=>({id:item.id,label:item.label[language],frequency:frequency(item.score),advice:item.advice[language],followup:item.followup[language]})),
  noConcerns: notable.length===0,
  notice: language==="FR" ? "Ce questionnaire informel n’est pas un outil clinique validé. Il ne permet pas de diagnostiquer une maladie ni de mesurer un niveau de risque médical." : "This informal questionnaire is not a validated clinical tool. It cannot diagnose a condition or determine a medical risk level."
 }
}
