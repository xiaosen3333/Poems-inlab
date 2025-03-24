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
  "lora": "FLUX-FUSHIHUI v3.0.safetensors",
  "prompt": [
    "This image portrays an idyllic scene of an endless expanse of rapeseed flower fields at twilight.Key Elements:1Rapeseed Fields:-The centerpiece is the vast sea of bright - yellow rapeseed flowers stretching far and wide. Their vivid color dominates the view,with simple yet effective detailing to show their density.2.Setting Sun:-In the west,the sun is sinking. It casts a warm red - orange glow,painting the sky with streaks of sunset colors. The sunlight hits the rapeseed fields,creating a beautiful contrast between the flower's yellow and the sunset hues.3.Rising Moon:-In the east,the moon is emerging. It's a pale,faint orb in the darkening sky,adding a touch of mystery. The blue - black sky around it is in contrast to the bright west.4.Twilight Atmosphere:The scene exudes a peaceful transition from day to night. There's a sense of calm,with no signs of human activity,just the natural beauty of the setting sun,rising moon,and endless rapeseed fields.**Overall Impression:The image captures the serene and beautiful moment of twilight in a rapeseed field,highlighting the harmony between the setting sun and rising moon,creating a scene of pure natural splendor.,"
  ]
}
/**
 * Visual elements for each canvas
 */
export const visualElements: { [key: number]: VisualElement[] } = {
  "1": [
    {
      "id": 1,
      "src": "https://i.ibb.co/Kp2Qy6C8/4-3.png",
      "title": "Field",
      "size": {
        "width": 600,
        "height": 450
      }
    },
    {
      "id": 2,
      "src": "https://i.ibb.co/YB68916r/600-132.png",
      "title": "Moon",
      "size": {
        "width": 600,
        "height": 132
      }
    },
    {
      "id": 3,
      "src": "https://i.ibb.co/RpbwQyHT/1-478-174.png",
      "title": "Sun",
      "size": {
        "width": 478,
        "height": 174
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
    "value": 20,
    "degree": -7.5
  },
  {
    "emotion": "Delight",
    "color": "#4AEB27",
    "value": 20,
    "degree": 7.5
  },
  {
    "emotion": "Happiness",
    "color": "#00D613",
    "value": 20,
    "degree": 22.5
  },
  {
    "emotion": "Elation",
    "color": "#00C246",
    "value": 20,
    "degree": 37.5
  },
  {
    "emotion": "Surprise",
    "color": "#06A865",
    "value": 20,
    "degree": 52.5
  },
  {
    "emotion": "Wonder",
    "color": "#008C64",
    "value": 20,
    "degree": 67.5
  },
  {
    "emotion": "Amazement",
    "color": "#019293",
    "value": 20,
    "degree": 82.5
  },
  {
    "emotion": "Curiosity",
    "color": "#107A9A",
    "value": 20,
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
    "value": 20,
    "degree": 127.5
  },
  {
    "emotion": "Tranquility",
    "color": "#3200C4",
    "value": 20,
    "degree": 142.5
  },
  {
    "emotion": "Melancholy",
    "color": "#3B00AF",
    "value": 20,
    "degree": 157.5
  },
  {
    "emotion": "Sadness",
    "color": "#500096",
    "value": 20,
    "degree": 172.5
  },
  {
    "emotion": "Grief",
    "color": "#590C6C",
    "value": 20,
    "degree": 187.5
  },
  {
    "emotion": "Sorrow",
    "color": "#691B71",
    "value": 20,
    "degree": 202.5
  },
  {
    "emotion": "Anxiety",
    "color": "#54003B",
    "value": 20,
    "degree": 217.5
  },
  {
    "emotion": "Fear",
    "color": "#860445",
    "value": 20,
    "degree": 232.5
  },
  {
    "emotion": "Dread",
    "color": "#A30B2F",
    "value": 20,
    "degree": 247.5
  },
  {
    "emotion": "Shock",
    "color": "#CC1715",
    "value": 20,
    "degree": 262.5
  },
  {
    "emotion": "Disgust",
    "color": "#DA4518",
    "value": 20,
    "degree": 277.5
  },
  {
    "emotion": "Anger",
    "color": "#EA8217",
    "value": 20,
    "degree": 292.5
  },
  {
    "emotion": "Rage",
    "color": "#EDB71C",
    "value": 20,
    "degree": 307.5
  },
  {
    "emotion": "Frustration",
    "color": "#E7F513",
    "value": 20,
    "degree": 322.5
  },
  {
    "emotion": "Irritation",
    "color": "#BDF61A",
    "value": 20,
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
    "analysisValue": 6
  },
  {
    "emotion": "Joy",
    "angle": -18,
    "userValue": 100,
    "analysisValue": 20
  },
  {
    "emotion": "Anger",
    "angle": 54,
    "userValue": 100,
    "analysisValue": 0
  },
  {
    "emotion": "Sadness",
    "angle": 126,
    "userValue": 100,
    "analysisValue": 60
  },
  {
    "emotion": "Fear",
    "angle": 198,
    "userValue": 100,
    "analysisValue": 15
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
  "菜の花や": "rapeseed flower fields",
  "月": "moon",
  "日": "sun"
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
    "name": "与謝蕪村",
    "dynasty": "Edo"
  },
  "verses": [
    {
      "original": "菜の花や",
      "translated": "A sea of rapeseed flower fields as far as one can see.",
      "keywords": [
        {
          "original": "菜の花や",
          "translated": "rapeseed flower fields"
        }
      ]
    },
    {
      "original": "月は東に",
      "translated": "The moon begins to rise from the eastern sky,",
      "keywords": [
        {
          "original": "月",
          "translated": "moon"
        }
      ]
    },
    {
      "original": "日は西に",
      "translated": "and the sun is setting in the west.",
      "keywords": [
        {
          "original": "日",
          "translated": "sun"
        }
      ]
    }
  ],
  "background": "The haiku \"菜の花や 月は東に 日は西に\" (translated as \"The rape blossoms! The moon in the east, the sun in the west\") was written by Yosa Buson.\nYosa Buson was a renowned haiku poet and painter in the Edo period of Japan. He was one of the leading figures of the Edo school of haiku. During the Edo period, haiku emerged as a popular form of poetry, and many poets were inspired by the natural beauty and the simple pleasures of life."
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
        "label": "Fields",
        "type": "entity",
        "x": 190,
        "y": 270
      },
      {
        "id": "node-1742477084934",
        "label": "Moon",
        "type": "entity",
        "x": 260,
        "y": 120
      },
      {
        "id": "node-1742477099311",
        "label": "Sun",
        "type": "entity",
        "x": 140,
        "y": 120
      },
      {
        "id": "node-1742477378017",
        "label": "above",
        "type": "relation",
        "x": 140,
        "y": 190
      },
      {
        "id": "node-1742477565840",
        "label": "above",
        "type": "relation",
        "x": 260,
        "y": 190
      },
      {
        "id": "node-1742477628526",
        "label": "setting",
        "type": "modifier",
        "x": 40,
        "y": 60
      },
      {
        "id": "node-1742477669836",
        "label": "from west",
        "type": "modifier",
        "x": 140,
        "y": 20
      },
      {
        "id": "node-1742477713035",
        "label": "rising",
        "type": "modifier",
        "x": 360,
        "y": 60
      },
      {
        "id": "node-1742477734850",
        "label": "from east",
        "type": "modifier",
        "x": 260,
        "y": 20
      },
      {
        "id": "node-1742477759446",
        "label": "rapeseed flower's",
        "type": "modifier",
        "x": 130,
        "y": 330
      },
      {
        "id": "node-1742477803127",
        "label": "a sea of",
        "type": "modifier",
        "x": 260,
        "y": 330
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
        "id": "edge-1742477652660",
        "source": "node-1742477628526",
        "target": "node-1742477099311"
      },
      {
        "id": "edge-1742477697638",
        "source": "node-1742477669836",
        "target": "node-1742477099311"
      },
      {
        "id": "edge-1742477727211",
        "source": "node-1742477713035",
        "target": "node-1742477084934"
      },
      {
        "id": "edge-1742477751086",
        "source": "node-1742477734850",
        "target": "node-1742477084934"
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