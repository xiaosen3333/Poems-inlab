// Poem data

export interface PoemKeyword {
  [key: string]: string;
}

export interface PoemData {
  title: {
    original: string;
    translated: string;
  };
  author: {
    name: string;
    dynasty: string;
  };
  verses: {
    original: string;
    translated: string;
    keywords?: {
      original: string;
      translated: string;
    }[];
  }[];
  background?: string;
}

// Keywords to highlight in the poem
export const keywordsMap: PoemKeyword = {
  "床前": "bed",
  "明月光": "moonlight",
  "地上霜": "frost",
  "举头": "looking up",
  "望明月": "see the moon",
  "低头": "bowing",
  "思故乡": "missing hometown"
};

// Li Bai's "Quiet Night Thoughts" poem
export const quietNightPoem: PoemData = {
  title: {
    original: "静夜思",
    translated: "In the Quiet Night"
  },
  author: {
    name: "李白",
    dynasty: "唐"
  },
  verses: [
    {
      original: "床前明月光，",
      translated: "Beside my bed a silver light,",
      keywords: [
        { original: "床前", translated: "bed" },
        { original: "明月光", translated: "light" }
      ]
    },
    {
      original: "疑是地上霜。",
      translated: "I wonder if it's frost aground.",
      keywords: [
        { original: "地上霜", translated: "frost" },
        { original: "地上", translated: "aground" }
      ]
    },
    {
      original: "举头望明月，",
      translated: "Looking up, I see the moon so bright;",
      keywords: [
        { original: "举头", translated: "Looking up" },
        { original: "望", translated: "see" },
        { original: "明月", translated: "moon" }
      ]
    },
    {
      original: "低头思故乡。",
      translated: "Bowing, I'm missing my hometown.",
      keywords: [
        { original: "低头", translated: "Bowing" },
        { original: "思故乡", translated: "missing my hometown" }
      ]
    }
  ],
  background: "This poem was likely written during Li Bai's travels. It reflects the loneliness and homesickness of a traveler in a foreign land under the moonlight, against the backdrop of the relatively open and prosperous cultural and social environment of the Tang Dynasty."
};