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
const anxietyPattern = /anxious|anxiety|panic|worry|worried|overwhelmed|racing thoughts|stress/i
const moodPattern = /sad|depress|low mood|lonely|empty|hopeless|tired|crying|grief/i
const sleepPattern = /sleep|insomnia|awake|nightmares|restless/i
const focusPattern = /focus|concentrat|distract|procrastinat|attention/i

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
