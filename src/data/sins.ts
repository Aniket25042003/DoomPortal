import type { Sin } from "@/types";

export const SINS: Sin[] = [
  {
    id: "doom",
    name: "Doom Scroller",
    visual:
      "slumped on a couch in a dark room, lit only by their phone screen, scrolling endlessly with glazed-over eyes and empty energy drink cans around them",
    roast:
      "Hey! I came from 2050 to tell you — put the phone down. You've been scrolling for 6 hours. Your thumb has a six-pack. Your brain has two cells left and they're fighting over a TikTok sound. Go outside. The sun misses you.",
  },
  {
    id: "crypto",
    name: "Crypto Degenerate",
    visual:
      "hunched over a desk with monitors showing crashing red charts, sweating and refreshing their phone, a HODL sticky note on the monitor",
    roast:
      "Look at you, the Wolf of Walmart. You bought the dip — all of them. Your portfolio looks like a ski slope. In 2050 your trades are a textbook chapter called What Not To Do. Even your calculator gives you the silent treatment.",
  },
  {
    id: "meme",
    name: "Meme Lord",
    visual:
      "lying in bed at 3AM in total darkness, face lit by phone, silently shaking with laughter at memes, tears streaming, clock showing 3:14 AM",
    roast:
      "It's 3 AM and you're crying at a cat in a hat. You posted 47 memes today — that's not a hobby, that's a crisis. Your friends stopped inviting you to dinner because you just show memes. Even your mom unfollowed you.",
  },
  {
    id: "ratio",
    name: "Ratio Chaser",
    visual:
      "at a desk obsessively refreshing a social media post, nervously watching the reply count go up, biting nails, intense focus on notifications",
    roast:
      "You got a ratio? Here's your trophy — it's invisible, like your social life. You spend more time crafting replies than some people spend on marriages. In 2050 your descendants found your tweets and moved countries. Out of shame.",
  },
  {
    id: "3am",
    name: "3AM Poster",
    visual:
      "sitting cross-legged on a bed in darkness, typing on phone with exhausted bloodshot eyes, messy hair, clock showing 3:42 AM",
    roast:
      "It's 3:42 AM and you're about to share your deepest thoughts. Please don't. You tweeted 'do clouds have feelings' at 4 AM and got two likes, both bots. Your dark circles have dark circles. Melatonin filed a restraining order.",
  },
  {
    id: "selfie",
    name: "Selfie Addict",
    visual:
      "in a bathroom with ring light, holding phone at various angles doing duck lips, dozens of nearly identical selfies visible on screen",
    roast:
      "Fifty selfies today and they all look the same. Your camera roll is 99 percent your face. Your front camera has PTSD. The ring light costs more than your rent. In 2050 face recognition was built using YOUR face because there were so many references.",
  },
  {
    id: "replyguy",
    name: "Reply Guy",
    visual:
      "rage-typing on a laptop with an angry expression, veins on forehead, multiple argument tabs open, cracked phone on desk",
    roast:
      "Nobody asked. Literally nobody. But here you are under every post with a paragraph nobody reads. You argued with someone's grandma about crypto. Your keyboard needs therapy. In 2050 the word 'reply' is banned because of you.",
  },
  {
    id: "story",
    name: "Story Hoarder",
    visual:
      "walking down a street filming everything with phone — coffee, buildings, pigeons — story count showing 23 posted today",
    roast:
      "23 stories and it's 2 PM. Nobody needs your coffee from seven angles. The pigeon didn't consent. Your story viewers dropped from 200 to 12 — eight are family who don't know how to mute you. You're not a creator, you're a surveillance camera.",
  },
  {
    id: "flex",
    name: "Flex Lord",
    visual:
      "posing next to a luxury car that isn't theirs, wearing fake designer clothes and oversized sunglasses, confident smirk in a hotel parking lot",
    roast:
      "Nice car. Whose is it? Your Gucci belt has the G backwards. Your vacation photos are from the hotel lobby. You took 30 photos next to someone's Lambo and the owner called the police. Your geotag said Motel 6. Everyone knows.",
  },
  {
    id: "algo",
    name: "Algorithm Slave",
    visual:
      "on a couch with a blank zombie expression, eyes glazed, jaw open, staring at phone, completely hypnotized by the feed",
    roast:
      "Blink! When did you last blink? You opened your phone to check the time and it's been four hours. Your For You page knows you better than your therapist. In 2050 your brain scan matched a zombie's. Please find a hobby without WiFi.",
  },
  {
    id: "ghost",
    name: "Professional Ghoster",
    visual:
      "sipping coffee calmly while phone shows 47 unread messages and missed calls, zero guilt, a cat on the table looking more concerned",
    roast:
      "47 unread messages. Three missed calls. And you're sipping coffee like a psychopath. People text you happy birthday and hear back in March. Your friends formed a support group. In 2050 leaving people on read is a misdemeanor. You owe six thousand in fines.",
  },
  {
    id: "poll",
    name: "Poll Abuser",
    visual:
      "at a desk creating another pointless poll on phone — 'what should I eat for lunch' — obsessively checking vote percentages",
    roast:
      "Should you have pizza or tacos? Why are you asking the internet? You made a poll about whether to make another poll. In 2050 democracy collapsed because you wore it out. Nobody cares about your sandwich toppings. Make a decision.",
  },
];

export function getSinById(id: string): Sin | undefined {
  return SINS.find((s) => s.id === id);
}

export function buildVideoPrompt(handle: string, sin: Sin): string {
  return [
    `A person is ${sin.visual}.`,
    `A glowing neon portal tears open in front of them. They react with shock.`,
    `A holographic version of themselves from the future steps out and says: "${sin.roast}"`,
    `The person stares in stunned silence. The hologram steps back into the portal.`,
  ].join(" ");
}

const PREVIEW_PROMPTS = [
  (sin: Sin) =>
    `A person ${sin.visual}. A glowing neon portal is tearing open behind them. They look shocked. Cinematic photo, dramatic lighting.`,
  (sin: Sin) =>
    `A translucent holographic figure stepping out of a neon portal, pointing accusingly at a person who is ${sin.visual}. Dramatic lighting, cinematic still.`,
  (sin: Sin) =>
    `Close-up of a person with a guilty, shocked expression caught ${sin.visual}. Neon light from an off-screen portal casts colored shadows. Cinematic portrait.`,
  (sin: Sin) =>
    `A holographic figure from the future delivering a speech while a person sits stunned after being roasted for ${sin.name.toLowerCase()} behavior. Neon portal light, cinematic wide shot.`,
  (sin: Sin) =>
    `A person sitting in devastated silence after being roasted by a hologram from the future. A collapsed neon portal fades behind them. Cinematic still, dramatic lighting.`,
];

export function buildPreviewPrompt(handle: string, sin: Sin, sceneIndex?: number): string {
  const idx = sceneIndex !== undefined
    ? sceneIndex % PREVIEW_PROMPTS.length
    : 0;
  return PREVIEW_PROMPTS[idx](sin);
}
