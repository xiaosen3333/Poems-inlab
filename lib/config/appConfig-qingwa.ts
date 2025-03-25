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
  title: string;
  size: {
    width: number;
    height: number;
  };
}
export const generateConfig: { lora: string; prompt: string[] } = {
  "lora": "ukiyo-e_style_hokusai_flux1-dev.safetensors",
  "prompt": [
    "Ukiyo-e style by Hokusai，This image is a famous woodblock print created by the renowned haiku poet Matsuo Basho. The artwork is a vivid depiction of “In spring,in a quiet circle of stones of different sizes around the edge of the pond,the frog jumps into the water,splashing a circle of ripples”. ### Key Elements:1 **Old Pond:** The central element is an ancient pond,around which a circle of stones of varying sizes is arranged at the edge.  -The color of the water might be a soft,muted shade,blending with the natural hues of the stones and the environment around it.. 2. **Frog:** - There is a frog that makes a leap into the pond. It is the focal point of movement in this otherwise quiet setting.-The frog's body is depicted in mid-air,showing its agility and the energy of its jump.  3. **Ripples: ** - As the frog plunges into the water,it generates a series of concentric ripples that spread outwards across the pond's surface. -The ripples are illustrated with delicate lines and gentle curves,indicating the disturbance of the once calm water.  4.** Spring Setting:** - The scene is set in spring.There could be some budding plants or fresh greenery around the pond. -The lighting is soft and diffused,typical of spring days,casting a warm and inviting glow over the entire scene.5.** Quiet Atmosphere:** - The overall atmosphere is one of profound stillness and quietness,broken only by the frog's leap and the subsequent sound of the water.### Overall Impression: The haiku captures a fleeting moment where the stillness of an ancient pond is briefly interrupted by the action of a frog,"
  ]
}
/**
 * Visual elements for each canvas
 */
export const visualElements: { [key: number]: VisualElement[] } = {
  "1": [
    {
      "id": 1,
      "src": "https://i.ibb.co/DPPs6xCW/600-522.png",
      "title": "Pond",
      "size": {
        "width": 600,
        "height": 450
      }
    },
    {
      "id": 2,
      "src": "https://i.ibb.co/qMmtLDsc/154-143.png",
      "title": "Frog",
      "size": {
        "width": 154,
        "height": 143
      }
    },
    {
      "id": 3,
      "src": "https://i.ibb.co/pvjx1BJT/470-380.png",
      "title": "Water Sound",
      "size": {
        "width": 470,
        "height": 380
      }
    }
  ],
  "2": [],
  "3": [],
  "4": []
};

// ========== EMOTION ANALYSIS CONFIG ==========

/**
 * Emotion color wheel data configuration
 */
export const emotionColorWheelLegend = [
  {
    "emotion": "Joy",
    "color": "#e8a87c",
    "value": 19,
    "degree": 0
  },
  {
    "emotion": "Surprise",
    "color": "#f8ef86",
    "value": 19,
    "degree": 60
  },
  {
    "emotion": "No Emotion",
    "color": "#c1f486",
    "value": 19,
    "degree": 120
  },
  {
    "emotion": "Sadness",
    "color": "#86b5f4",
    "value": 19,
    "degree": 180
  },
  {
    "emotion": "Fear",
    "color": "#c486f4",
    "value": 19,
    "degree": 240
  },
  {
    "emotion": "Anger",
    "color": "#f486a9",
    "value": 19,
    "degree": 300
  },
  {
    "value": 19
  },
  {
    "value": 19
  },
  {
    "value": 19
  }
];

export const emotionColorWheelData = [
  {
    "emotion": "Joy",
    "color": "#85F614",
    "value": 2,
    "degree": -7.5
  },
  {
    "emotion": "Delight",
    "color": "#4AEB27",
    "value": 5,
    "degree": 7.5
  },
  {
    "emotion": "Happiness",
    "color": "#00D613",
    "value": 7,
    "degree": 22.5
  },
  {
    "emotion": "Elation",
    "color": "#00C246",
    "value": 7,
    "degree": 37.5
  },
  {
    "emotion": "Surprise",
    "color": "#06A865",
    "value": 5,
    "degree": 52.5
  },
  {
    "emotion": "Wonder",
    "color": "#008C64",
    "value": 5,
    "degree": 67.5
  },
  {
    "emotion": "Amazement",
    "color": "#019293",
    "value": 10,
    "degree": 82.5
  },
  {
    "emotion": "Curiosity",
    "color": "#107A9A",
    "value": 15,
    "degree": 97.5
  },
  {
    "emotion": "Calmness",
    "color": "#2566CA",
    "value": 20,
    "degree": 112.5
  },
  {
    "emotion": "Serenity",
    "color": "#4558CD",
    "value": 10,
    "degree": 127.5
  },
  {
    "emotion": "Tranquility",
    "color": "#3200C4",
    "value": 5,
    "degree": 142.5
  },
  {
    "emotion": "Melancholy",
    "color": "#3B00AF",
    "value": 3,
    "degree": 157.5
  },
  {
    "emotion": "Sadness",
    "color": "#500096",
    "value": 2,
    "degree": 172.5
  },
  {
    "emotion": "Grief",
    "color": "#590C6C",
    "value": 2,
    "degree": 187.5
  },
  {
    "emotion": "Sorrow",
    "color": "#691B71",
    "value": 2,
    "degree": 202.5
  },
  {
    "emotion": "Anxiety",
    "color": "#54003B",
    "value": 2,
    "degree": 217.5
  },
  {
    "emotion": "Fear",
    "color": "#860445",
    "value": 2,
    "degree": 232.5
  },
  {
    "emotion": "Dread",
    "color": "#A30B2F",
    "value": 2,
    "degree": 247.5
  },
  {
    "emotion": "Shock",
    "color": "#CC1715",
    "value": 5,
    "degree": 262.5
  },
  {
    "emotion": "Disgust",
    "color": "#DA4518",
    "value": 10,
    "degree": 277.5
  },
  {
    "emotion": "Anger",
    "color": "#EA8217",
    "value": 5,
    "degree": 292.5
  },
  {
    "emotion": "Rage",
    "color": "#EDB71C",
    "value": 5,
    "degree": 307.5
  },
  {
    "emotion": "Frustration",
    "color": "#E7F513",
    "value": 2,
    "degree": 322.5
  },
  {
    "emotion": "Irritation",
    "color": "#BDF61A",
    "value": 2,
    "degree": 337.5
  }
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
  {
    "emotion": "Surprise",
    "angle": -90,
    "userValue": 100
  },
  {
    "emotion": "Joy",
    "angle": -18,
    "userValue": 100
  },
  {
    "emotion": "Anger",
    "angle": 54,
    "userValue": 100
  },
  {
    "emotion": "Sadness",
    "angle": 126,
    "userValue": 100
  },
  {
    "emotion": "Fear",
    "angle": 198,
    "userValue": 100
  }
];

/**
 * Analysis data for the radar chart
 */
export const radarChartAnalysisData: RadarDataPoint[] = [
  {
    "emotion": "Surprise",
    "angle": -90,
    "userValue": 100,
    "analysisValue": 15
  },
  {
    "emotion": "Joy",
    "angle": -18,
    "userValue": 100,
    "analysisValue": 25
  },
  {
    "emotion": "Anger",
    "angle": 54,
    "userValue": 100,
    "analysisValue": 5
  },
  {
    "emotion": "Sadness",
    "angle": 126,
    "userValue": 100,
    "analysisValue": 80
  },
  {
    "emotion": "Fear",
    "angle": 198,
    "userValue": 100,
    "analysisValue": 20
  }
];

/**
 * Purple colors for radar chart background layers
 */
export const radarChartPurpleColors = [
  "#f2f0ff",
  "#e5e2f8",
  "#dbd7f4",
  "#d1cef0"
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
  "池": "pond",
  "蛙": "frog",
  "水の音": "water sound"
};

/**
 * Li Bai's "Quiet Night Thoughts" poem
 */
export const quietNightPoem: PoemData = {
  "title": {
    "original": "",
    "translated": ""
  },
  "author": {
    "name": "松尾芭蕉",
    "dynasty": "Edo"
  },
  "verses": [
    {
      "original": "古池や",
      "translated": "By the quiet and still old pond,",
      "keywords": [
        {
          "original": "池",
          "translated": "pond"
        }
      ]
    },
    {
      "original": "蛙飛び込む",
      "translated": "a frog jumping into the water，",
      "keywords": [
        {
          "original": "蛙",
          "translated": "frog"
        }
      ]
    },
    {
      "original": "水の音",
      "translated": " the water sound is heard.",
      "keywords": [
        {
          "original": "水の音",
          "translated": "water sound"
        }
      ]
    }
  ],
  "background": "\"The Old Pond\" (古池や) by Matsuo Bashō is one of the most famous haiku in Japanese literature. Written in 1686 during the Edo period, it captures a moment of stillness broken by a frog jumping into water. The poem reflects Bashō's Zen-inspired philosophy, emphasizing simplicity, nature, and the beauty of fleeting moments. It is considered a masterpiece of haiku, showcasing the essence of \"wabi-sabi\" (finding beauty in imperfection and transience)."
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
    "id": "background",
    "label": "Background",
    "icon": "/button1.png",
    "question": "Please explain the historical background of this poem and its author."
  },
  {
    "id": "techniques",
    "label": "Techniques",
    "icon": "/button2.png",
    "question": "What poetic techniques are used in this poem?"
  },
  {
    "id": "theme",
    "label": "Theme",
    "icon": "/button3.png",
    "question": "What are the main themes of this poem?"
  },
  {
    "id": "more",
    "label": "More",
    "icon": "/button4.png",
    "question": "Please provide a deeper analysis of the imagery in this poem."
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
  {
    "nodes": [
      {
        "id": "node-1742477063075",
        "label": "Pond",
        "type": "entity",
        "x": 190,
        "y": 270
      },
      {
        "id": "node-1742477084934",
        "label": "Water Sound",
        "type": "entity",
        "x": 290,
        "y": 120
      },
      {
        "id": "node-1742477099311",
        "label": "Frog",
        "type": "entity",
        "x": 100,
        "y": 120
      },
      {
        "id": "node-1742477378017",
        "label": "jumping into",
        "type": "relation",
        "x": 100,
        "y": 190
      },
      {
        "id": "node-1742477565840",
        "label": "from",
        "type": "relation",
        "x": 290,
        "y": 190
      },
      {
        "id": "node-1742477759446",
        "label": "old",
        "type": "modifier",
        "x": 130,
        "y": 330
      },
      {
        "id": "node-1742477803127",
        "label": "quiet",
        "type": "modifier",
        "x": 260,
        "y": 330
      },
      {
        "id": "node-1742615131644",
        "label": "makes",
        "type": "relation",
        "x": 190,
        "y": 60
      }
    ],
    "edges": [
      {
        "id": "edge-1742477390400",
        "source": "node-1742477565840",
        "target": "node-1742477063075"
      },
      {
        "id": "edge-1742477396296",
        "source": "node-1742477378017",
        "target": "node-1742477063075"
      },
      {
        "id": "edge-1742477397068",
        "source": "node-1742477099311",
        "target": "node-1742477378017"
      },
      {
        "id": "edge-1742477599047",
        "source": "node-1742477084934",
        "target": "node-1742477565840"
      },
      {
        "id": "edge-1742477793276",
        "source": "node-1742477759446",
        "target": "node-1742477063075"
      },
      {
        "id": "edge-1742477819797",
        "source": "node-1742477803127",
        "target": "node-1742477063075"
      },
      {
        "id": "edge-1742615144988",
        "source": "node-1742477099311",
        "target": "node-1742615131644"
      },
      {
        "id": "edge-1742615153082",
        "source": "node-1742615131644",
        "target": "node-1742477084934"
      }
    ]
  },
  {
    "nodes": [],
    "edges": []
  },
  {
    "nodes": [],
    "edges": []
  },
  {
    "nodes": [],
    "edges": []
  }
];

// ========== UI CONSTANTS ==========

/**
 * UI constant values
 */
export const uiConstants = {
  "colorWheel": {
    "maxBarLength": 80
  },
  "radarChart": {
    "svgWidth": 500,
    "svgHeight": 500,
    "radius": 180,
    "circleCount": 4
  },
  "graph": {
    "nodeWidth": 90,
    "nodeHeight": 35,
    "entityFill": "#9AE3EB",
    "entityStroke": "#9AE3EB",
    "relationFill": "#7165DA",
    "relationStroke": "#7165DA",
    "modifierFill": "#C9D6E9",
    "modifierStroke": "#C9D6E9",
    "modifierText": "#66668A",
    "edgeStroke": "black",
    "borderRadius": 10
  },
  "canvasImage": {
    "defaultWidth": 120,
    "defaultHeight": 120,
    "maxWidth": 240,
    "maxHeight": 240,
    "downloadWidth": 1200,
    "downloadQuality": 1,
    "downloadScale": 2
  }
};