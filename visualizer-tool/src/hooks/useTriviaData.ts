import { useState, useEffect } from "react";
import { fetchQuestions, fetchCategories } from "../api";
import type { Question } from "../types";

export const useTriviaData = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [questionsData, categoriesData] = await Promise.all([
        fetchQuestions(),
        fetchCategories(),
      ]);
      setQuestions(questionsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const refresh = async () => {
    await loadData();
  };

  return {
    questions,
    categories,
    loading,
    refresh,
  };
};
