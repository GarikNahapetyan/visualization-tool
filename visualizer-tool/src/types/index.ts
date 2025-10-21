export interface Question {
  type: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface ChartItem {
  name: string;
  value: number;
}
