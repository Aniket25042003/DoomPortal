import type { Sin } from "@/types";

export const SINS: Sin[] = [
  {
    id: "doom",
    name: "Doom Scroller",
    visual:
      "slumped on a couch in a dimly lit room, illuminated only by phone screen glow, eyes glazed over, thumb scrolling rapidly through an endless feed, dark circles under eyes, empty energy drink cans scattered around",
    roast:
      "stop doom scrolling, because of you I only have 2 brain cells left",
  },
  {
    id: "crypto",
    name: "Crypto Degenerate",
    visual:
      "hunched over a desk with multiple monitors showing red candlestick charts, sweat beading on forehead, frantically refreshing browser tabs, clutching phone showing portfolio losses, dim green monitor glow on face",
    roast:
      "stop apeing every dip, because of you we are still broke in 2050",
  },
  {
    id: "meme",
    name: "Meme Lord",
    visual:
      "lying in bed at 3AM in total darkness, face lit by phone screen, silently laughing at memes, blankets tangled, nightstand clock showing 3:14 AM, slight tears from laughing",
    roast:
      "stop posting 47 memes a day, because of you my timeline is 90 percent garbage",
  },
  {
    id: "ratio",
    name: "Ratio Chaser",
    visual:
      "sitting at a desk obsessively refreshing a social media post, watching reply count go up, nervously biting nails, multiple notification sounds going off, intense focus on like counter",
    roast:
      "stop chasing ratios, because of you I got ratio'd by my own future self",
  },
  {
    id: "3am",
    name: "3AM Poster",
    visual:
      "sitting in bed in complete darkness with only the phone screen lighting their face with a blue glow, typing a late-night post with intense concentration, messy hair, exhausted expression",
    roast:
      "stop tweeting at 3AM, because of you my sleep schedule is permanently destroyed",
  },
  {
    id: "selfie",
    name: "Selfie Addict",
    visual:
      "standing in front of a bathroom mirror taking selfies from multiple angles, doing exaggerated poses, duck lips, phone held at various heights, ring light visible in reflection, dozens of attempt photos on screen",
    roast:
      "stop taking 50 selfies a day, because of you my camera roll is 99 percent your face",
  },
  {
    id: "replyguy",
    name: "Reply Guy",
    visual:
      "rage-typing furious replies on a keyboard with intense angry expression, veins popping on forehead, multiple argument threads open on screen, cracked phone screen from slamming it down",
    roast:
      "stop being a reply guy, because of you no one takes me seriously anymore",
  },
  {
    id: "story",
    name: "Story Hoarder",
    visual:
      "holding phone up recording everything around them for stories, walking down a street filming food, buildings, random moments, story count showing 23 posted today, obsessively checking view counts",
    roast:
      "stop posting stories every 5 minutes, because of you my friends muted me",
  },
  {
    id: "flex",
    name: "Flex Lord",
    visual:
      "posing next to a luxury car that is clearly rented, wearing designer knockoffs, taking photos with borrowed jewelry, in front of a hotel lobby pretending it is their house, over-the-top confident expression",
    roast:
      "stop flexing fake vacations, because of you I am still living in mom's basement",
  },
  {
    id: "algo",
    name: "Algorithm Slave",
    visual:
      "zombie-like expression while endlessly scrolling a For You page, algorithm suggestions flying past, completely hypnotized by content feed, surrounded by floating recommendation bubbles, vacant stare",
    roast:
      "stop feeding the algorithm, because of you my feed is pure rage bait",
  },
  {
    id: "ghost",
    name: "Professional Ghoster",
    visual:
      "looking at phone with 47 unread message notifications, casually sipping coffee while ignoring all DMs and group chats, seen receipts everywhere, relaxed unbothered expression while chaos unfolds on screen",
    roast:
      "stop ghosting everyone, because of you I have zero friends left in 2050",
  },
  {
    id: "poll",
    name: "Poll Abuser",
    visual:
      "creating yet another pointless poll on social media, screen showing polls about what to eat for lunch and which shoe to wear, obsessively checking vote counts and percentages, surrounded by poll result notifications",
    roast:
      "stop making polls about everything, because of you my notifications never stop",
  },
];

export function getSinById(id: string): Sin | undefined {
  return SINS.find((s) => s.id === id);
}

export function buildVideoPrompt(handle: string, sin: Sin): string {
  return [
    `Photorealistic cinematic video of a real person.`,
    `The person is ${sin.visual}.`,
    `Suddenly a glowing neon portal with swirling cyan and pink energy particles tears open in front of them.`,
    `A translucent holographic version of the same person emerges from the portal, glowing with digital scan lines and hologram flicker.`,
    `The hologram speaks directly to camera with a sarcastic expression.`,
    `Cinematic lighting, shallow depth of field, anamorphic lens flare, moody cyberpunk color grade with deep shadows and neon highlights.`,
    `Photorealistic skin texture, natural hair movement, realistic cloth physics.`,
    `Smooth camera movement, film grain, 24fps cinematic feel.`,
  ].join(" ");
}

export function buildPreviewPrompt(handle: string, sin: Sin): string {
  return [
    `Photorealistic cinematic still frame of a person ${sin.visual}.`,
    `A massive glowing neon time portal with swirling cyan and magenta energy particles is tearing open right behind them.`,
    `Dramatic cyberpunk lighting, deep shadows, neon rim lights in cyan and hot pink.`,
    `Shallow depth of field, anamorphic lens flare, film grain.`,
    `Ultra detailed, 8K quality, hyperrealistic skin and textures.`,
  ].join(" ");
}
