import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import { useTriviaData } from "../../hooks/useTriviaData";
import { useFilters } from "../../hooks/useFilters";
import "./style.scss";
import Refresh from "../../assets/Refresh.svg";

const Main = () => {
  const { questions, categories, loading, refresh } = useTriviaData();
  const {
    selectedCategory,
    selectedDifficulty,
    searchTerm,
    filteredQuestions,
    statistics,
    chartData,
    handleCategoryChange,
    handleDifficultyChange,
    handleSearchChange,
  } = useFilters(questions);

  const [showAnswers, setShowAnswers] = useState<{ [key: number]: boolean }>(
    {}
  );

  const toggleAnswer = (index: number) => {
    setShowAnswers((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const COLORS = ["#4CAF50", "#FF9800", "#F44336"];

  if (loading) {
    return (
      <div className="main">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="main">
      <div className="filters">
        <div className="filters__left">
          <div className="category">
            <p>Category:</p>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <option value="any">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="difficulty">
            <p>Difficulty:</p>
            <button
              className={selectedDifficulty === "any" ? "active" : ""}
              onClick={() => handleDifficultyChange("any")}
            >
              All
            </button>
            <button
              className={selectedDifficulty === "easy" ? "active" : ""}
              onClick={() => handleDifficultyChange("easy")}
            >
              Easy
            </button>
            <button
              className={selectedDifficulty === "medium" ? "active" : ""}
              onClick={() => handleDifficultyChange("medium")}
            >
              Medium
            </button>
            <button
              className={selectedDifficulty === "hard" ? "active" : ""}
              onClick={() => handleDifficultyChange("hard")}
            >
              Hard
            </button>
          </div>
        </div>
        <div className="filters__right">
          <button onClick={refresh} className="refresh-btn">
            <img src={Refresh} alt="refresh" /> Refresh
          </button>
          <p>Loaded: {statistics.totalQuestions} questions</p>
        </div>
      </div>

      <div className="stats">
        <div className="stat-item">
          <span className="stat-label">Total:</span>
          <span className="stat-value">{statistics.totalQuestions}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Categories:</span>
          <span className="stat-value">{statistics.uniqueCategories}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Difficulty:</span>
          <span className="stat-value">
            E {statistics.easyPercent}% M {statistics.mediumPercent}% H{" "}
            {statistics.hardPercent}%
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Selected Category:</span>
          <span className="stat-value">
            {selectedCategory === "any" ? "All" : selectedCategory}
          </span>
        </div>
      </div>

      <div className="charts">
        <div className="chart-container">
          <h3>PIE CHART</h3>
          <h4>«Questions by Categories» (PieChart)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${((percent as number) * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.categoryData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>BAR CHART</h3>
          <h4>«Questions by Difficulty» (BarChart)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.difficultyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container full-width">
          <h3>STACKED BAR CHART: «Categories × Difficulty»</h3>
          <h4>
            (Stacked Bar: categories on X-axis; easy/medium/hard within each
            bar)
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={chartData.stackedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="easy" stackId="a" fill="#4CAF50" />
              <Bar dataKey="medium" stackId="a" fill="#FF9800" />
              <Bar dataKey="hard" stackId="a" fill="#F44336" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="search">
        <p>Search:</p>
        <input
          type="text"
          placeholder="Search by question..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      <div className="questions-table">
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Difficulty</th>
              <th>Type</th>
              <th>Question</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuestions.map((question, index) => (
              <tr key={index}>
                <td>{question.category}</td>
                <td>
                  {question.difficulty.charAt(0).toUpperCase() +
                    question.difficulty.slice(1)}
                </td>
                <td>{question.type === "multiple" ? "mult" : "bool"}</td>
                <td>
                  {question.question}
                  <button
                    className="show-answer-btn"
                    onClick={() => toggleAnswer(index)}
                  >
                    {showAnswers[index] ? "Hide answer" : "Show answer"}
                  </button>
                  {showAnswers[index] && (
                    <div className="answer">
                      <strong>Correct Answer:</strong> {question.correct_answer}
                      {question.incorrect_answers.length > 0 && (
                        <div>
                          <strong>Incorrect Answers:</strong>{" "}
                          {question.incorrect_answers.join(", ")}
                        </div>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Main;
