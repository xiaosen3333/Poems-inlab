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

/**
 * Visual elements for each canvas
 */
export const visualElements: { [key: number]: VisualElement[] } = {
  "1": [
    {
      "id": 1,
      "src": "https://i.ibb.co/n8Z7kvKp/562-420.png",
      "title": "Person",
      "size": {
        "width": 600,
        "height": 420
      }
    },
    {
      "id": 2,
      "src": "https://i.ibb.co/99WRktv0/600-376.png",
      "title": "Bed",
      "size": {
        "width": 600,
        "height": 376
      }
    }
  ],
  "2": [
    {
      "id": 1,
      "src": "https://i.ibb.co/fY81ym5s/287-181.png",
      "title": "Birds",
      "size": {
        "width": 287,
        "height": 181
      }
    },
    {
      "id": 2,
      "src": "https://i.ibb.co/DH3qXDvY/600-557.png",
      "title": "Outside",
      "size": {
        "width": 600,
        "height": 557
      }
    }
  ],
  "3": [
    {
      "id": 1,
      "src": "https://i.ibb.co/1YgbQq5G/600-600.png",
      "title": "Night",
      "size": {
        "width": 600,
        "height": 600
      }
    },
    {
      "id": 2,
      "src": "https://i.ibb.co/bgqDfrJh/448-448.png",
      "title": "Wind and Showers",
      "size": {
        "width": 448,
        "height": 448
      }
    }
  ],
  "4": [
    {
      "id": 1,
      "src": "https://i.ibb.co/TB50zpg7/600-358.png",
      "title": "Flowers",
      "size": {
        "width": 600,
        "height": 358
      }
    },
    {
      "id": 2,
      "src": "https://i.ibb.co/PZbXnLvd/426-404.png",
      "title": "Fallen Flowers",
      "size": {
        "width": 426,
        "height": 404
      }
    }
  ]
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
    "value": 2,
    "degree": 7.5
  },
  {
    "emotion": "Happiness",
    "color": "#00D613",
    "value": 5,
    "degree": 22.5
  },
  {
    "emotion": "Elation",
    "color": "#00C246",
    "value": 5,
    "degree": 37.5
  },
  {
    "emotion": "Surprise",
    "color": "#06A865",
    "value": 2,
    "degree": 52.5
  },
  {
    "emotion": "Wonder",
    "color": "#008C64",
    "value": 10,
    "degree": 67.5
  },
  {
    "emotion": "Amazement",
    "color": "#019293",
    "value": 12,
    "degree": 82.5
  },
  {
    "emotion": "Curiosity",
    "color": "#107A9A",
    "value": 17,
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
    "value": 12,
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
    "value": 2,
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
    "value": 15,
    "degree": 292.5
  },
  {
    "emotion": "Rage",
    "color": "#EDB71C",
    "value": 10,
    "degree": 307.5
  },
  {
    "emotion": "Frustration",
    "color": "#E7F513",
    "value": 6,
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
    "analysisValue": 35
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
    "analysisValue": 5
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
  "不觉": "I",
  "眠": "bed",
  "鸟": "birds",
  "夜": "night",
  "风": "wind",
  "雨": "showers",
  "花落": "fallen flowers"
};

/**
 * Li Bai's "Quiet Night Thoughts" poem
 */
export const quietNightPoem: PoemData = {
  "title": {
    "original": "春晓",
    "translated": "A Spring Morning"
  },
  "author": {
    "name": "孟浩然",
    "dynasty": "唐"
  },
  "verses": [
    {
      "original": "春眠不觉晓",
      "translated": "This spring morning in bed I’m lying,",
      "keywords": [
        {
          "original": "不觉",
          "translated": "I"
        },
        {
          "original": "眠",
          "translated": "bed"
        }
      ]
    },
    {
      "original": "处处闻啼鸟",
      "translated": "Not to awake till birds are crying.",
      "keywords": [
        {
          "original": "鸟",
          "translated": "birds"
        }
      ]
    },
    {
      "original": "夜来风雨声",
      "translated": "After one night of wind and showers,",
      "keywords": [
        {
          "original": "夜",
          "translated": "night"
        },
        {
          "original": "风",
          "translated": "wind"
        },
        {
          "original": "雨",
          "translated": "showers"
        }
      ]
    },
    {
      "original": "花落知多少",
      "translated": "How many are the fallen flowers!",
      "keywords": [
        {
          "original": "花落",
          "translated": "fallen flowers"
        }
      ]
    }
  ],
  "background": "This poem captures the essence of a spring morning, where the speaker wakes up late, lulled by the season's comfort, and hears birds singing everywhere. Reflecting on the sounds of wind and rain from the night before, he wonders how many flowers have fallen. The poem blends the beauty of nature with a subtle sense of impermanence, a hallmark of classical Chinese poetry."
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
        "label": "Bed",
        "type": "entity",
        "x": 190,
        "y": 270
      },
      {
        "id": "node-1742477099311",
        "label": "Person",
        "type": "entity",
        "x": 190,
        "y": 120
      },
      {
        "id": "node-1742477378017",
        "label": "lying in",
        "type": "relation",
        "x": 190,
        "y": 190
      }
    ],
    "edges": [
      {
        "id": "edge-1742477396296",
        "source": "node-1742477378017",
        "target": "node-1742477063075"
      },
      {
        "id": "edge-1742477397068",
        "source": "node-1742477099311",
        "target": "node-1742477378017"
      }
    ]
  },
  {
    "nodes": [
      {
        "id": "node-1742620534683",
        "label": "Birds",
        "type": "entity",
        "x": 190,
        "y": 120
      },
      {
        "id": "node-1742620550120",
        "label": "crying",
        "type": "relation",
        "x": 190,
        "y": 200
      },
      {
        "id": "node-1742620575006",
        "label": "Outside",
        "type": "entity",
        "x": 190,
        "y": 280
      }
    ],
    "edges": [
      {
        "id": "edge-1742620610033",
        "source": "node-1742620534683",
        "target": "node-1742620550120"
      },
      {
        "id": "edge-1742620615441",
        "source": "node-1742620550120",
        "target": "node-1742620575006"
      }
    ]
  },
  {
    "nodes": [
      {
        "id": "node-1742620632485",
        "label": "Wind and Showers",
        "type": "entity",
        "x": 200,
        "y": 130
      },
      {
        "id": "node-1742620645699",
        "label": "throughout",
        "type": "relation",
        "x": 200,
        "y": 200
      },
      {
        "id": "node-1742620660225",
        "label": "Night",
        "type": "entity",
        "x": 200,
        "y": 270
      }
    ],
    "edges": [
      {
        "id": "edge-1742620670926",
        "source": "node-1742620632485",
        "target": "node-1742620645699"
      },
      {
        "id": "edge-1742620672729",
        "source": "node-1742620645699",
        "target": "node-1742620660225"
      }
    ]
  },
  {
    "nodes": [
      {
        "id": "node-1742620685521",
        "label": "Flowers",
        "type": "entity",
        "x": 190,
        "y": 100
      },
      {
        "id": "node-1742620698812",
        "label": "above",
        "type": "relation",
        "x": 190,
        "y": 180
      },
      {
        "id": "node-1742620751954",
        "label": "Fallen Flowers",
        "type": "entity",
        "x": 190,
        "y": 250
      }
    ],
    "edges": [
      {
        "id": "edge-1742620768047",
        "source": "node-1742620685521",
        "target": "node-1742620698812"
      },
      {
        "id": "edge-1742620769849",
        "source": "node-1742620698812",
        "target": "node-1742620751954"
      }
    ]
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