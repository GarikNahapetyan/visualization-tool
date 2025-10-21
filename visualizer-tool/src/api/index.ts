import axios from "axios";
import type { Question } from "../types";

const URL = "https://opentdb.com/api.php?amount=50";

export async function fetchQuestions(): Promise<Question[]> {
  const res = await axios.get(URL);
  console.log("Data:", res.data);
  return res.data.results as Question[];
}

export async function fetchCategories() {
  const res = await axios.get("https://opentdb.com/api_category.php");
  return res.data.trivia_categories as { id: number; name: string }[];
}
