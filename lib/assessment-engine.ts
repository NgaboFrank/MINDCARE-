export type Concern = "safety" | "anxiety" | "low_mood" | "sleep" | "focus" | "general"

export type Guidance = {
  concern: Concern
  urgency: "urgent" | "high" | "routine"
  title: string
  response: string
  nextSteps: string[]
  disclaimer: string
}

const safetyPattern = /suicid|kill myself|end my life|hurt myself|self[- ]harm|not worth living|can't go on|cannot go on/i
const anxietyPattern = /anxious|anxiety|panic|worry|worried|overwhelmed|racing thoughts|stress|guhangayik|impungenge|ubwoba|stressé|angoiss|inquiét|anxiét|peur/i
const moodPattern = /sad|depress|low mood|lonely|empty|hopeless|tired|crying|grief|agahinda|kwiheba|kubabara|umubabaro|triste|déprim|solitude|désespoir/i
const sleepPattern = /sleep|insomnia|awake|nightmares|restless|gusinzira|ibitotsi|kudasinzira|sommeil|dormir|insomnie/i
const focusPattern = /focus|concentrat|distract|procrastinat|attention|kwibanda|gutekereza|mémoire/i

export function classifyQuestion(input: string): Concern {
  if (safetyPattern.test(input)) return "safety"
  if (anxietyPattern.test(input)) return "anxiety"
  if (moodPattern.test(input)) return "low_mood"
  if (sleepPattern.test(input)) return "sleep"
  if (focusPattern.test(input)) return "focus"
  return "general"
}

export function generateGuidance(input: string): Guidance {
  const concern = classifyQuestion(input)
  if (concern === "safety") return { concern, urgency: "urgent", title: "You deserve immediate support", response: "I’m really glad you said this. I can’t assess immediate danger, but thoughts of suicide or self-harm need human support now.", nextSteps: ["If you may act on these thoughts, call local emergency services now.", "In the U.S. or Canada, call or text 988. Elsewhere, contact your local crisis line.", "Move near another person and tell them plainly: ‘I’m not safe alone right now.’"], disclaimer: "MindCare is not an emergency service. Do not wait for this app if you may be in immediate danger." }
  const library: Record<Exclude<Concern, "safety">, Guidance> = {
    anxiety: { concern, urgency: "routine", title: "Let’s make this moment smaller", response: "Anxiety often becomes louder when the body thinks it needs to solve everything at once. Start with your nervous system, then choose one manageable action.", nextSteps: ["Exhale slowly for longer than you inhale, five times.", "Name five things you can see, four you can feel, and three you can hear.", "Write the next 10-minute step instead of the whole solution."], disclaimer: "This is general wellbeing information, not a diagnosis or treatment plan." },
    low_mood: { concern, urgency: "routine", title: "You don’t have to solve everything today", response: "Low mood can make ordinary tasks feel disproportionately hard. A small, physical action is often a better starting point than waiting to feel motivated.", nextSteps: ["Drink water and eat something simple if you have not.", "Step outside or change rooms for five minutes.", "Message someone safe; if this persists for two weeks or affects daily life, consider a qualified professional."], disclaimer: "This is general wellbeing information, not a diagnosis or treatment plan." },
    sleep: { concern, urgency: "routine", title: "Give your evening fewer decisions", response: "Sleep is influenced by rhythm, light, stress, and habits. Focus on a repeatable wind-down rather than trying to force sleep.", nextSteps: ["Keep a consistent wake time for the next few days.", "Dim lights and put your phone farther away before bed.", "If you are awake for a long time, do something quiet in low light and return when sleepy."], disclaimer: "Persistent sleep disruption deserves a conversation with a healthcare professional." },
    focus: { concern, urgency: "routine", title: "Reduce the size of the task", response: "Focus is easier when the starting point is concrete and distractions are removed. Aim for a short, winnable block.", nextSteps: ["Choose one task and define its first two-minute action.", "Set a 10-minute timer and put your phone out of reach.", "When the timer ends, pause and decide whether to continue or reset."], disclaimer: "This is general wellbeing information, not a diagnosis or treatment plan." },
    general: { concern, urgency: "routine", title: "A useful place to begin", response: "Notice the feeling without judging it, then connect it to one need: rest, movement, food, safety, connection, or support.", nextSteps: ["Name the feeling and where you notice it in your body.", "Pick one kind action that takes less than 10 minutes.", "Recheck how you feel later and write down what helped."], disclaimer: "MindCare supports reflection; it does not diagnose or replace professional care." },
  }
  return library[concern]
}

export type GuidanceLanguage = "EN" | "FR" | "RW"
export function generateLocalizedGuidance(input: string, language: GuidanceLanguage): Guidance {
  const base = generateGuidance(input)
  if (language === "EN") return base
  const messages: Record<"FR" | "RW", Record<Concern, [string,string,string[]]>> = {
    FR: {
      safety: ["Demandez de l'aide maintenant","Parlez dès maintenant à un adulte de confiance ou à un professionnel. Si vous êtes en danger immédiat, contactez les services d'urgence locaux.",["Restez en contact avec une personne de confiance.","Demandez un soutien professionnel rapidement."]],
      anxiety: ["Apaiser l'inquiétude","Si vous vous sentez inquiet ou tendu, essayez une petite pause et concentrez-vous sur une étape réalisable.",["Respirez lentement pendant une minute.","Parlez de ce qui vous préoccupe à une personne de confiance."]],
      low_mood: ["Prendre soin de votre humeur","Une baisse de moral peut rendre les activités ordinaires plus difficiles. Commencez par une petite action agréable.",["Prenez un moment de repos.","Si cela persiste, parlez-en à un professionnel de santé."]],
      sleep: ["Améliorer le repos","Des horaires réguliers et un environnement calme peuvent favoriser le sommeil.",["Essayez de garder des horaires de coucher réguliers.","Consultez un professionnel si les difficultés persistent."]],
      focus: ["Retrouver sa concentration","Découper les tâches en petites étapes peut aider à mieux se concentrer.",["Choisissez une tâche courte.","Éloignez les distractions pendant quelques minutes."]],
      general: ["Parlons de votre bien-être","Je n'ai pas suffisamment de détails pour comprendre votre question. Décrivez ce que vous ressentez ou ce qui vous préoccupe.",["Précisez votre question avec quelques détails.","Parlez-en à une personne de confiance si vous en ressentez le besoin."]]
    },
    RW: {
      safety: ["Shaka ubufasha ubu","Vugana n'umuntu mukuru wizeye cyangwa inzobere mu buzima bwo mu mutwe ubu. Niba uri mu kaga ako kanya, shaka ubutabazi bwihutirwa.",["Ganira n'umuntu wizeye.","Shaka ubufasha bw'umuganga cyangwa inzobere."]],
      anxiety: ["Gabanya impungenge","Niba ufite impungenge cyangwa ubwoba, gerageza kuruhuka gato no kwita ku kintu kimwe ushoboye gukora.",["Humeka gahoro mu gihe gito.","Ganira n'umuntu wizeye ku biguhangayikishije."]],
      low_mood: ["Ita ku marangamutima yawe","Agahinda gashobora gutuma imirimo ya buri munsi igorana. Tangirira ku gikorwa gito kigufasha.",["Fata akanya ko kuruhuka.","Niba bikomeje, ganira n'inzobere mu buzima."]],
      sleep: ["Kunoza ibitotsi","Gusinzira ku masaha adahindagurika no kuruhukira ahantu hatuje bishobora gufasha.",["Gerageza kuryama ku masaha amwe.","Niba ikibazo gikomeje, ganira n'umuganga."]],
      focus: ["Kongera kwibanda ku byo ukora","Gukora umurimo umwe muto icyarimwe bishobora gufasha kwibanda.",["Hitamo umurimo umwe woroshye.","Gabanya ibikurangaza mu gihe gito."]],
      general: ["Tuganire ku mibereho yawe","Nkeneye ibisobanuro birambuye kugira ngo menye icyo ushaka kubaza. Sobanura uko wiyumva cyangwa ikibazo ufite.",["Andika ikibazo cyawe mu buryo burambuye.","Ganira n'umuntu wizeye niba ukeneye ubufasha."]]
    }
  }
  const [title,response,nextSteps]=messages[language][base.concern]
  return {...base,title,response,nextSteps,disclaimer:language==="FR"?"Ces conseils ne remplacent pas une consultation médicale.":"Izi nama ntizisimbura isuzuma rya muganga."}
}
