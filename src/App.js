import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";
import FlashcardList from "./FlashcardList";

function App() {
  const [flashcards, setFlashcards] = useState([]);
  const [categories, setCategories] = useState([]);
  const categoryEl = useRef();
  const amountEl = useRef();

  useEffect(() => {
    axios.get("https://opentdb.com/api_category.php").then((res) => {
      setCategories(res.data.trivia_categories);
    });
  }, []);
  useEffect(() => {}, []);
  function decodeString(str) {
    const textArea = document.createElement("textarea");
    textArea.innerHTML = str;
    return textArea.value;
  }
  function handleSubmit(e) {
    e.preventDefault();
    axios
      .get("https://opentdb.com/api.php", {
        params: {
          amount: amountEl.current.value,
          category: categoryEl.current.value,
        },
      })
      .then((res) => {
        setFlashcards(
          res.data.results.map((questionItem, index) => {
            const answer = questionItem.correct_answer;
            const options = [...questionItem.incorrect_answers, answer];
            return {
              id: `${index}-${Date.now()}`,
              question: decodeString(questionItem.question),
              answer: answer,
              options: options.sort(() => Math.random() - 0.5),
            };
          })
        );
        console.log(res.data);
      });
  }
  return (
    <React.Fragment>
      <form className="header" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlForm="category">Category</label>
          <select id="category" ref={categoryEl}>
            {categories.map((category) => {
              return (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="amount">Number of questions</label>
          <input
            type="number"
            id="amount"
            min="1"
            step="1"
            defaultValue={10}
            ref={amountEl}
          />
        </div>
        <div className="form-group">
          <button className="btn">Generate</button>
        </div>
      </form>
      <div className="container">
        <FlashcardList flashcards={flashcards} />
      </div>
    </React.Fragment>
  );
}
const SAMPLE_FLASHCARDS = [
  {
    id: 1,
    question: "2+2",
    answer: "4",
    options: ["2", "3", "4", "5"],
  },
  {
    id: 2,
    question: "3+2",
    answer: "5",
    options: ["2", "3", "4", "5"],
  },
  {
    id: 3,
    question: "1+2",
    answer: "3",
    options: ["2", "3", "4", "5"],
  },
  {
    id: 4,
    question: "2+1",
    answer: "3",
    options: ["2", "3", "4", "5"],
  },
  {
    id: 5,
    question: "12+2",
    answer: "14",
    options: ["2", "3", "14", "15"],
  },
];

export default App;
