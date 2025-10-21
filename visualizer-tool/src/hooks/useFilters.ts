import { useState, useMemo } from "react";
import type { Question } from "../types";

export const useFilters = (questions: Question[]) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("any");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("any");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredQuestions = useMemo(() => {
    let filtered = questions;

    if (selectedCategory !== "any") {
      filtered = filtered.filter((q) => q.category === selectedCategory);
    }

    if (selectedDifficulty !== "any") {
      filtered = filtered.filter((q) => q.difficulty === selectedDifficulty);
    }

    if (searchTerm) {
      filtered = filtered.filter((q) =>
        q.question.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [questions, selectedCategory, selectedDifficulty, searchTerm]);

  const statistics = useMemo(() => {
    const totalQuestions = filteredQuestions.length;
    const uniqueCategories = new Set(filteredQuestions.map((q) => q.category))
      .size;

    const difficultyStats = filteredQuestions.reduce((acc, q) => {
      acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const easyCount = difficultyStats.easy || 0;
    const mediumCount = difficultyStats.medium || 0;
    const hardCount = difficultyStats.hard || 0;
    const total = easyCount + mediumCount + hardCount;

    const easyPercent = total > 0 ? Math.round((easyCount / total) * 100) : 0;
    const mediumPercent =
      total > 0 ? Math.round((mediumCount / total) * 100) : 0;
    const hardPercent = total > 0 ? Math.round((hardCount / total) * 100) : 0;

    return {
      totalQuestions,
      uniqueCategories,
      easyCount,
      mediumCount,
      hardCount,
      easyPercent,
      mediumPercent,
      hardPercent,
    };
  }, [filteredQuestions]);

  const chartData = useMemo(() => {
    const categoryCounts = filteredQuestions.reduce((acc, q) => {
      acc[q.category] = (acc[q.category] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const categoryData = Object.entries(categoryCounts).map(
      ([name, value]) => ({
        name,
        value,
      })
    );

    const difficultyData = [
      { name: "Easy", value: statistics.easyCount, fill: "#4CAF50" },
      { name: "Medium", value: statistics.mediumCount, fill: "#FF9800" },
      { name: "Hard", value: statistics.hardCount, fill: "#F44336" },
    ];

    const stackedCounts = filteredQuestions.reduce((acc, q) => {
      if (!acc[q.category]) {
        acc[q.category] = { easy: 0, medium: 0, hard: 0 };
      }
      acc[q.category][q.difficulty]++;
      return acc;
    }, {} as { [key: string]: { easy: number; medium: number; hard: number } });

    const stackedData = Object.entries(stackedCounts).map(
      ([category, difficulties]) => ({
        category,
        easy: difficulties.easy,
        medium: difficulties.medium,
        hard: difficulties.hard,
      })
    );

    return { categoryData, difficultyData, stackedData };
  }, [
    filteredQuestions,
    statistics.easyCount,
    statistics.mediumCount,
    statistics.hardCount,
  ]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleDifficultyChange = (difficulty: string) => {
    setSelectedDifficulty(difficulty);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  return {
    selectedCategory,
    selectedDifficulty,
    searchTerm,
    filteredQuestions,
    statistics,
    chartData,
    handleCategoryChange,
    handleDifficultyChange,
    handleSearchChange,
  };
};
