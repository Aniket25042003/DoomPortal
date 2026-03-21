import type { Sin } from "@/types";

export const SINS: Sin[] = [
  {
    id: "doom",
    name: "Doom Scroller",
    visual:
      "sitting on a couch doom-scrolling endlessly on their phone, tired eyes, rapid thumb swipes",
    roast:
      "stop doom scrolling because of you I only have 2 brain cells left",
  },
  {
    id: "crypto",
    name: "Crypto Degenerate",
    visual:
      "refreshing crypto charts every 3 seconds like a maniac, sweating at red candles",
    roast:
      "stop apeing every dip because of you we're still broke in 2050",
  },
  {
    id: "meme",
    name: "Meme Lord",
    visual: "scrolling memes at 3AM laughing alone in the dark",
    roast:
      "stop posting 47 memes a day because of you my timeline is 90% garbage",
  },
  {
    id: "ratio",
    name: "Ratio Chaser",
    visual:
      "refreshing replies obsessively waiting for likes and ratios",
    roast:
      "stop chasing ratios because of you I got ratio'd by my own future self",
  },
  {
    id: "3am",
    name: "3AM Poster",
    visual:
      "posting tweets at 3AM with the lights off, phone glowing on face",
    roast:
      "stop tweeting at 3AM because of you my sleep schedule is permanently destroyed",
  },
  {
    id: "selfie",
    name: "Selfie Addict",
    visual: "taking endless mirror selfies, posing dramatically",
    roast:
      "stop taking 50 selfies a day because of you my camera roll is 99% my face",
  },
  {
    id: "replyguy",
    name: "Reply Guy",
    visual: "arguing in Twitter replies with rage typing",
    roast:
      "stop being a reply guy because of you no one takes me seriously anymore",
  },
  {
    id: "story",
    name: "Story Hoarder",
    visual: "posting 20 Instagram stories back-to-back",
    roast:
      "stop posting stories every 5 minutes because of you my friends muted me in 2050",
  },
  {
    id: "flex",
    name: "Flex Lord",
    visual: "posing with fake luxury items and rented cars",
    roast:
      "stop flexing fake vacations because of you I'm still living in my mom's basement",
  },
  {
    id: "algo",
    name: "Algorithm Slave",
    visual:
      "endlessly refreshing For You page, feeding the algo",
    roast:
      "stop feeding the algorithm because of you my feed is pure rage bait",
  },
  {
    id: "ghost",
    name: "Professional Ghoster",
    visual:
      "reading DMs and group chats but never replying",
    roast:
      "stop ghosting everyone because of you I have zero friends left",
  },
  {
    id: "poll",
    name: "Poll Abuser",
    visual: "spamming polls about everything for engagement",
    roast:
      "stop making polls about everything because of you my notifications are endless",
  },
];

export function getSinById(id: string): Sin | undefined {
  return SINS.find((s) => s.id === id);
}

export function buildMagicHourPrompt(
  handle: string,
  sin: Sin
): string {
  return `Cinematic 11-second sequence starring this exact person's face. 
Start with close-up: the person ${sin.visual}. 
Suddenly a massive glowing neon time portal tears open right in front of them with swirling energy particles and electric cracks. 
From the portal emerges a glitchy blue holographic version of the exact same face floating in mid-air, glowing scan lines, digital artifacts, and hologram flicker. 
The hologram leans forward, looks the person (and camera) dead in the eyes, mouth moves with sarcastic expression. 
Big bold white subtitle text pops up: "Hey @${handle} from 2026... ${sin.roast} 😂". 
Dramatic energy pulse, portal closing, final zoom out with text "Your 2050 Self Just Saved You". 
Hyper-realistic face lock on both versions, smooth motion, cyberpunk lighting, subtle film grain, 11 seconds.`;
}
