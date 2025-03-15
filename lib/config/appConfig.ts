/**
 * Application Configuration
 * 
 * This file contains centralized configuration for the Poem Studio application.
 * All hardcoded data is extracted here to make it easier to maintain and update.
 */

// ========== VISUALIZATION ELEMENTS CONFIG ==========

/**
 * Visual elements interface
 */
export interface VisualElement {
  id: number;
  src: string;
  alt: string;
  title: string;
  description: string;
  period: string;
}

/**
 * Element size configuration for different visual elements
 */
export const elementSizes = {
  1: { width: 120, height: 120 }, // Scholar figure
  2: { width: 120, height: 80 },  // Writing desk
  3: { width: 100, height: 60 },  // Low table
  4: { width: 80, height: 80 },   // Moon reflection
  5: { width: 60, height: 100 },  // Lantern
};

/**
 * Visual elements for the canvas
 */
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
    title: "Person",
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

// ========== EMOTION ANALYSIS CONFIG ==========

/**
 * Emotion color wheel data configuration
 */
export const emotionColorWheelData = [
  { emotion: "Joy", color: "#e8a87c", value: 75, degree: 0 },
  { emotion: "Surprise", color: "#f8ef86", value: 45, degree: 60 },
  { emotion: "No Emotion", color: "#c1f486", value: 30, degree: 120 },
  { emotion: "Sadness", color: "#86b5f4", value: 60, degree: 180 },
  { emotion: "Fear", color: "#c486f4", value: 25, degree: 240 },
  { emotion: "Anger", color: "#f486a9", value: 50, degree: 300 },
];

/**
 * Interface for radar chart data points
 */
export interface RadarDataPoint {
  emotion: string;
  angle: number;
  userValue: number;
  analysisValue?: number;
}

/**
 * Initial data for the radar chart
 */
export const radarChartInitialData: RadarDataPoint[] = [
  { emotion: "Surprise", angle: -90, userValue: 100 }, // Top (12 o'clock)
  { emotion: "Joy", angle: -18, userValue: 100 }, // Top right
  { emotion: "Anger", angle: 54, userValue: 100 }, // Bottom right
  { emotion: "Sadness", angle: 126, userValue: 100 }, // Bottom left
  { emotion: "Fear", angle: 198, userValue: 100 }, // Top left
];

/**
 * Analysis data for the radar chart
 */
export const radarChartAnalysisData: RadarDataPoint[] = [
  { emotion: "Surprise", angle: -90, userValue: 100, analysisValue: 65 },
  { emotion: "Joy", angle: -18, userValue: 100, analysisValue: 90 },
  { emotion: "Anger", angle: 54, userValue: 100, analysisValue: 70 },
  { emotion: "Sadness", angle: 126, userValue: 100, analysisValue: 85 },
  { emotion: "Fear", angle: 198, userValue: 100, analysisValue: 60 },
];

/**
 * Purple colors for radar chart background layers
 */
export const radarChartPurpleColors = [
  "#f2f0ff", // Lightest purple (outermost)
  "#e5e2f8", // Light purple
  "#dbd7f4", // Medium purple
  "#d1cef0", // Darkest purple (innermost)
];

// ========== POEM DATA CONFIG ==========

/**
 * Interface for poem keyword mapping
 */
export interface PoemKeyword {
  [key: string]: string;
}

/**
 * Interface for poem data structure
 */
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

/**
 * Keywords to highlight in the poem
 */
export const keywordsMap: PoemKeyword = {
  "床前": "bed",
  "明月光": "moonlight",
  "地上霜": "frost",
  "举头": "looking up",
  "望明月": "see the moon",
  "低头": "bowing",
  "思故乡": "missing hometown"
};

/**
 * Li Bai's "Quiet Night Thoughts" poem
 */
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

// ========== AI CHAT CONFIG ==========

/**
 * Interface for API message
 */
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Interface for predefined question
 */
export interface PredefinedQuestion {
  id: string;
  label: string;
  icon: string;
  question: string;
}

/**
 * Predefined questions for poetry analysis
 */
export const predefinedQuestions: PredefinedQuestion[] = [
  {
    id: 'background',
    label: 'Background',
    icon: '/button1.png',
    question: 'Please explain the historical background of this poem and its author.'
  },
  {
    id: 'techniques',
    label: 'Techniques',
    icon: '/button2.png',
    question: 'What poetic techniques are used in this poem?'
  },
  {
    id: 'theme',
    label: 'Theme',
    icon: '/button3.png',
    question: 'What are the main themes of this poem?'
  },
  {
    id: 'more',
    label: 'More',
    icon: '/button4.png',
    question: 'Please provide a deeper analysis of the imagery in this poem.'
  }
];

// ========== GRAPH VISUALIZATION CONFIG ==========

/**
 * Node type definition
 */
export type NodeType = 'entity' | 'relation';

/**
 * Node interfaces for graph visualization
 */
export interface SceneNode {
  id: string;
  label: string;
  type: NodeType;
  x: number;
  y: number;
}

/**
 * Edge interface for graph visualization
 */
export interface SceneEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

/**
 * Graph data for each canvas (1-4)
 */
export const graphCanvasData = [
  // Canvas 1 - Bedside moonlight scene
  {
    nodes: [
      { id: "moon", label: "Moon", type: "entity", x: 60, y: 50 },
      { id: "moonlight", label: "Moonlight", type: "entity", x: 120, y: 100 },
      { id: "bed", label: "Bed", type: "entity", x: 180, y: 100 },
      { id: "inside1", label: "Inside", type: "relation", x: 150, y: 150 },
      { id: "room", label: "Room", type: "entity", x: 180, y: 200 },
      { id: "inside2", label: "Inside", type: "relation", x: 120, y: 150 },
      { id: "near", label: "Near", type: "relation", x: 90, y: 200 },
    ],
    edges: [
      { id: "e1", source: "moon", target: "moonlight" },
      { id: "e2", source: "moonlight", target: "bed" },
      { id: "e3", source: "moonlight", target: "inside1" },
      { id: "e4", source: "inside1", target: "room" },
      { id: "e5", source: "moonlight", target: "inside2" },
      { id: "e6", source: "inside2", target: "near" },
    ]
  },
  // Canvas 2 - Person standing scene
  {
    nodes: [
      { id: "person", label: "Person", type: "entity", x: 100, y: 70 },
      { id: "standing", label: "Standing on", type: "relation", x: 130, y: 130 },
      { id: "ground", label: "Ground", type: "entity", x: 160, y: 190 },
    ],
    edges: [
      { id: "e1", source: "person", target: "standing" },
      { id: "e2", source: "standing", target: "ground" },
    ]
  },
  // Canvas 3 - Frost and wonder scene
  {
    nodes: [
      { id: "frost", label: "Frost", type: "entity", x: 130, y: 90 },
      { id: "wonder", label: "Wonder", type: "relation", x: 80, y: 150 },
      { id: "looking", label: "Looking", type: "relation", x: 180, y: 150 },
    ],
    edges: [
      { id: "e1", source: "wonder", target: "frost" },
      { id: "e2", source: "looking", target: "frost" },
    ]
  },
  // Canvas 4 - Homesickness scene
  {
    nodes: [
      { id: "night", label: "Night", type: "entity", x: 80, y: 50 },
      { id: "homesick", label: "Homesick", type: "relation", x: 130, y: 110 },
      { id: "bowing", label: "Bowing", type: "relation", x: 80, y: 170 },
      { id: "missing", label: "Missing", type: "relation", x: 180, y: 170 },
      { id: "hometown", label: "Hometown", type: "entity", x: 230, y: 220 },
    ],
    edges: [
      { id: "e1", source: "homesick", target: "night" },
      { id: "e2", source: "homesick", target: "bowing" },
      { id: "e3", source: "homesick", target: "missing" },
      { id: "e4", source: "missing", target: "hometown" },
    ]
  }
];

// ========== UI CONSTANTS ==========

/**
 * UI constant values
 */
export const uiConstants = {
  // EmotionColorWheel constants
  colorWheel: {
    maxBarLength: 80,  // maximum pixel length for a bar at 100% value
  },

  // EmotionRadarChart constants
  radarChart: {
    svgWidth: 500,
    svgHeight: 500,
    radius: 180,
    circleCount: 4,  // Number of concentric circles
  },

  // Graph visualization constants
  graph: {
    nodeWidth: 90,  // 增加节点宽度
    nodeHeight: 35,  // 增加节点高度
    entityFill: '#9AE3EB',
    entityStroke: '#9AE3EB',
    relationFill: '#7165DA',
    relationStroke: '#7165DA',
    edgeStroke: 'black',
    borderRadius: 0,
  }
};