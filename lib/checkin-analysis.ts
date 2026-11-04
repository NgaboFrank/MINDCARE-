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
 const recommendation = impact>=2 || frequent>=3
   ? (language==="FR" ? "Plusieurs difficultés ou un impact sur le quotidien ont été signalés. Envisagez de prendre rendez-vous avec un professionnel qualifié." : "Several frequent difficulties or an impact on daily life were reported. Consider arranging an appointment with a qualified professional.")
   : notable.length ? (language==="FR" ? "Quelques difficultés ont été signalées. Essayez les conseils ci-dessous et demandez de l’aide si elles persistent ou s’aggravent." : "You reported some difficulties. Try the suggestions below and seek support if they persist or worsen.")
   : (language==="FR" ? "Vous avez signalé peu de difficultés pendant cette période. Continuez les habitudes qui vous aident à vous sentir bien." : "You reported few difficulties during this period. Keep up the habits that support your wellbeing.")
 return {
  title: language==="FR" ? "Résumé personnalisé de vos réponses" : "Your personalized response summary",
  recommendation,
  details: main.map(item=>({id:item.id,label:item.label[language],frequency:frequency(item.score),advice:item.advice[language],followup:item.followup[language]})),
  noConcerns: notable.length===0,
  notice: language==="FR" ? "Ce questionnaire informel n’est pas un outil clinique validé. Il ne permet pas de diagnostiquer une maladie ni de mesurer un niveau de risque médical." : "This informal questionnaire is not a validated clinical tool. It cannot diagnose a condition or determine a medical risk level."
 }
}
