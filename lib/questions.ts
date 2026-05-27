export type QuestionOption = {
  value: string;
  label: string;
  hint?: string;
};

export type Question =
  | {
      id: string;
      kind: "single";
      title: string;
      subtitle?: string;
      options: QuestionOption[];
    }
  | {
      id: string;
      kind: "compound_weight_field";
      title: string;
      subtitle?: string;
      weightMin: number;
      weightMax: number;
      weightMinLabel: string;
      weightMaxLabel: string;
      fields: QuestionOption[];
      fieldsMax: number;
    }
  | {
      id: string;
      kind: "text";
      title: string;
      subtitle?: string;
      placeholder?: string;
      optional?: boolean;
      maxLength?: number;
    };

export const QUESTIONS: Question[] = [
  {
    id: "mood",
    kind: "single",
    title: "此刻,你的心绪更接近哪一种?",
    subtitle: "凭直觉选,不必精确",
    options: [
      { value: "calm_needed", label: "想要安静下来", hint: "心里有些喧哗" },
      { value: "be_moved", label: "想被什么击中", hint: "渴望一点重量" },
      { value: "be_warmed", label: "想被轻轻接住", hint: "近来有些疲惫" },
      { value: "be_amused", label: "想松弛地笑笑", hint: "暂时不想严肃" },
      { value: "be_stirred", label: "想被搅动一下", hint: "想出走熟悉的自己" }
    ]
  },
  {
    id: "motive",
    kind: "single",
    title: "如果这本书会陪你一段时间,你希望它给你什么?",
    options: [
      { value: "escape", label: "一处可以躲进去的世界" },
      { value: "company", label: "像有人在旁低声说话" },
      { value: "mirror", label: "照见自己的此刻" },
      { value: "growth", label: "推一把,让我往前走" },
      { value: "knowledge", label: "学到一些真实的东西" }
    ]
  },
  {
    id: "loved",
    kind: "text",
    title: "最近一次让你心动的作品是什么?",
    subtitle: "书、电影、剧、作家都行,写下名字即可,可以多写几个。若一时想不起,留空也行",
    placeholder: "例:是枝裕和、《漫长的季节》、张爱玲……",
    optional: true,
    maxLength: 200
  },
  {
    id: "weight_field",
    kind: "compound_weight_field",
    title: "你愿意读多重的东西?偏爱哪个方向?",
    subtitle: "上方拖动选择阅读份量;下方若有偏爱可勾选(可跳过)",
    weightMin: 1,
    weightMax: 5,
    weightMinLabel: "轻盈,像散步",
    weightMaxLabel: "厚重,愿意慢慢啃",
    fieldsMax: 3,
    fields: [
      { value: "literary", label: "文学小说" },
      { value: "genre", label: "科幻悬疑奇幻" },
      { value: "essay", label: "随笔散文" },
      { value: "poetry", label: "诗" },
      { value: "history", label: "历史人文" },
      { value: "philosophy", label: "哲学思想" },
      { value: "psychology", label: "心理精神分析" },
      { value: "science", label: "自然科学" },
      { value: "biography", label: "传记回忆" },
      { value: "art", label: "艺术设计" }
    ]
  },
  {
    id: "freeform",
    kind: "text",
    title: "还有想补充的吗?",
    subtitle: "随手写一句,留白也行",
    placeholder: "比如:不要太长 / 想看东亚作者 / 别再给我推卡夫卡了……",
    optional: true,
    maxLength: 300
  }
];

export type Answers = {
  mood?: string;
  motive?: string;
  loved?: string;
  weight?: number;
  fields?: string[];
  freeform?: string;
};
