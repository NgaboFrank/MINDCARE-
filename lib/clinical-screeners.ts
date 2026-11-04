export type ScreenLanguage = "EN" | "FR"
export type ScreenId = "phq8" | "gad7"
type Localized = Record<ScreenLanguage,string>
export const screeners: Record<ScreenId,{title:Localized;description:Localized;questions:Localized[]}> = {
 phq8:{
  title:{EN:"Depression symptoms (PHQ-8)",FR:"Symptômes dépressifs (PHQ-8)"},
  description:{EN:"Think about the past two weeks. This is a screening tool, not a diagnosis.",FR:"Pensez aux deux dernières semaines. Ceci est un dépistage, pas un diagnostic."},
  questions:[
   {EN:"Little interest or pleasure in doing things",FR:"Peu d’intérêt ou de plaisir à faire les choses"},
   {EN:"Feeling down, depressed, or hopeless",FR:"Se sentir triste, déprimé(e) ou sans espoir"},
   {EN:"Trouble falling or staying asleep, or sleeping too much",FR:"Difficultés à dormir ou sommeil excessif"},
   {EN:"Feeling tired or having little energy",FR:"Fatigue ou manque d’énergie"},
   {EN:"Poor appetite or overeating",FR:"Manque d’appétit ou alimentation excessive"},
   {EN:"Feeling bad about yourself or feeling that you have let yourself or others down",FR:"Se sentir mal dans sa peau ou avoir l’impression d’avoir déçu les autres"},
   {EN:"Trouble concentrating on things, such as reading or watching television",FR:"Difficultés à se concentrer, par exemple pour lire ou regarder la télévision"},
   {EN:"Moving or speaking noticeably more slowly than usual, or being unusually restless",FR:"Bouger ou parler plus lentement que d’habitude, ou être particulièrement agité(e)"}
  ]
 },
 gad7:{
  title:{EN:"Anxiety symptoms (GAD-7)",FR:"Symptômes anxieux (GAD-7)"},
  description:{EN:"Think about the past two weeks. This is a screening tool, not a diagnosis.",FR:"Pensez aux deux dernières semaines. Ceci est un dépistage, pas un diagnostic."},
  questions:[
   {EN:"Feeling nervous, anxious, or on edge",FR:"Se sentir nerveux, anxieux ou à bout"},
   {EN:"Not being able to stop or control worrying",FR:"Ne pas pouvoir arrêter ou contrôler ses inquiétudes"},
   {EN:"Worrying too much about different things",FR:"Trop s’inquiéter à propos de différentes choses"},
   {EN:"Trouble relaxing",FR:"Avoir du mal à se détendre"},
   {EN:"Being so restless that it is hard to sit still",FR:"Être tellement agité(e) qu’il est difficile de rester assis(e)"},
   {EN:"Becoming easily annoyed or irritable",FR:"Être facilement contrarié(e) ou irritable"},
   {EN:"Feeling afraid as if something awful might happen",FR:"Avoir peur que quelque chose de terrible arrive"}
  ]
 }
}
export const frequencyOptions:Record<ScreenLanguage,string[]> = {
 EN:["Not at all","Several days","More than half the days","Nearly every day"],
 FR:["Pas du tout","Plusieurs jours","Plus de la moitié des jours","Presque tous les jours"]
}
export function scoreScreener(id:ScreenId,answers:number[],lang:ScreenLanguage) {
 const expected=screeners[id].questions.length
 if(answers.length!==expected || answers.some(a=>!Number.isInteger(a)||a<0||a>3))return null
 const score=answers.reduce((sum,a)=>sum+a,0)
 const band=score<5?0:score<10?1:score<15?2:id==="gad7"?3:score<20?3:4
 const labels:Record<ScreenLanguage,string[]> = {
  EN:["Minimal","Mild","Moderate","Moderately severe","Severe"],
  FR:["Minimes","Légers","Modérés","Modérément sévères","Sévères"]
 }
 const severity=id==="gad7"&&band===3?labels[lang][4]:labels[lang][band]
 const advice = score>=10
  ? lang==="FR"?"Vos réponses indiquent des symptômes qui méritent une évaluation par un professionnel de santé. Envisagez de prendre rendez-vous.":"Your responses suggest symptoms worth discussing with a qualified healthcare professional. Consider arranging an assessment."
  : score>=5
  ? lang==="FR"?"Des symptômes légers ont été signalés. Envisagez de suivre leur évolution et de demander de l’aide s’ils persistent ou perturbent votre vie.":"You reported some symptoms. Consider monitoring how you feel and seeking support if they persist or interfere with daily life."
  : lang==="FR"?"Peu de symptômes ont été signalés. Cela ne permet pas d’exclure un problème de santé ; demandez conseil si vous êtes préoccupé(e).":"Few symptoms were reported. This does not rule out a health concern; seek advice if you are worried."
 const top=answers.map((value,index)=>({value,index})).filter(x=>x.value>0).sort((a,b)=>b.value-a.value).slice(0,3)
 return {score,max:expected*3,severity,advice,top:top.map(x=>({question:screeners[id].questions[x.index][lang],frequency:frequencyOptions[lang][x.value]}))}
}
