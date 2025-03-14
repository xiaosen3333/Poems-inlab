// Visual elements data for poetry visualization
export interface VisualElement {
  id: number;
  src: string;
  alt: string;
  title: string;
  description: string;
  period: string;
}

// Predefined sizes for each element type
export const elementSizes = {
  1: { width: 120, height: 120 }, // Scholar figure
  2: { width: 120, height: 80 },  // Writing desk
  3: { width: 100, height: 60 },  // Low table
  4: { width: 80, height: 80 },   // Moon reflection
  5: { width: 60, height: 100 },  // Lantern
}

// Visual elements for the sidebar - using Vercel storage URLs
export const visualElements: VisualElement[] = [
  {
    id: 1,
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%204-pMO9HhFeGb1bYc2xe2uy36RlZ9CWYf.png",
    alt: "Traditional writing desk",
    title: "Scholar's Writing Desk",
    description:
      "A traditional desk used by scholars for calligraphy and writing. These desks were designed to provide the perfect height and angle for the meticulous art of calligraphy, a highly respected skill in East Asian scholarly traditions.",
    period: "Ming Dynasty",
  },
  {
    id: 2,
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%202-HhSUNvkc0TZeOSThRSFexIEwfwG7Jp.png",
    alt: "Scholar in meditation",
    title: "The Contemplative Scholar",
    description:
      "This figure represents the ideal of the scholar-sage, who balances intellectual pursuit with spiritual cultivation. The meditative posture reflects the belief that true wisdom comes from both study and inner reflection.",
    period: "Song Dynasty",
  },
  {
    id: 3,
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%203-6a6siEhYhoTUL7khkSwE7pfl3KHbTz.png",
    alt: "Traditional low table",
    title: "Meditation Table",
    description:
      "A low table used for tea ceremonies, reading ancient texts, and scholarly discussions. These tables were central to the scholar's daily life, providing a space for both solitary study and intellectual exchange with fellow scholars.",
    period: "Qing Dynasty",
  },
  {
    id: 4,
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%205-kgDMq8r8Am4aXxfVZCzE86DMPvf2SN.png",
    alt: "Circular decorative element",
    title: "Moon Reflection",
    description:
      "The circular form represents completeness and perfection in East Asian philosophy. Often used in scholarly settings as a reminder of the cyclical nature of knowledge and the pursuit of enlightenment through continuous learning.",
    period: "Tang Dynasty",
  },
  {
    id: 5,
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%206-DHXMof6UZgLPlu4oZfmiHUFeoC9GQn.png",
    alt: "Traditional lantern",
    title: "Scholar's Lantern",
    description:
      "These lanterns provided illumination for night-time study, allowing dedicated scholars to continue their pursuits long after sunset. The design often incorporated symbolic elements representing the light of knowledge dispelling ignorance.",
    period: "Yuan Dynasty",
  },
];