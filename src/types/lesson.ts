export interface LessonState {
  schema: number;
  group: number;
  tab: number;
  sort: Record<number, boolean>;
  sortChecked?: boolean;
  scenario: Record<number, number>;
  tree: number[];
  quiz: Record<number, number[]>;
  submitted: boolean;
  fields: Record<string, string>;
  visited: number[];
}

export interface ScenarioCase {
  q: string;
  a: string[];
  ok: number;
  e: string;
}

export interface BehaviorItem {
  text: string;
  shouldDo: boolean;
  explanation: string;
}

export interface LeafMeasure {
  title: string;
  description: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndices: number[];
  explanation: string;
}

export interface GroupTask {
  name: string;
  topic: string;
  task: string;
  caseText: string;
  challenges: string[];
  products: string[];
}

export interface ScheduleSlot {
  duration: string;
  activity: string;
}
