import axios from "axios";
import { useState, createContext, useContext } from "react";

const table = {
  sport: 19,
  history: 23,
  politics: 24,
};
const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [waiting, setwaiting] = useState(true);
  const [loading, setloading] = useState(false);
  const [questions, setquestions] = useState([]);
  const [index, setindex] = useState(0);
  const [correct, setcorrect] = useState(0);
  const [error, seterror] = useState(false);
  const [quiz, setquiz] = useState({
    amount: 10,
    category: "sports",
    difficulty: "ease",
  });
  const [modal, setmodal] = useState(false);

  //fetch questions
  const fetchQuestions = async (url) => {
    setloading(true);
    setwaiting(false);
    const response = await axios(url).catch((err) => console.log(err));
    if (response) {
      const data = response.data.results;
      if (data.length) {
        setquestions(data);
        setloading(false);
        setwaiting(false);
        seterror(false);
      } else {
        setwaiting(true);
        setloading(true);
      }
    } else {
      setwaiting(true);
    }
  };
  const openModal = () => {
    setmodal(true);
  };
  const closeModal = () => {
    setmodal(false);
    setwaiting(true);
    setcorrect(0);
  };

  const nextQuestion = () => {
    setindex((oldIndex) => {
      const index = oldIndex + 1;
      if (index > oldIndex.length - 1) {
        openModal();
        return 0;
      } else {
        return index;
      }
    });
  };

  const checkAnswers = (value) => {
    if (value) {
      setcorrect((oldState) => +1);
    }
    nextQuestion();
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setquiz({ ...quiz, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { amount, difficulty, category } = quiz;
    const url = `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&category=${table[category]}&type=multiple`;
    fetchQuestions(url);
  };
  return (
    <AppContext.Provider
      value={{
        waiting,
        loading,
        questions,
        index,
        correct,
        error,
        modal,
        nextQuestion,
        checkAnswers,
        closeModal,
        quiz,
        handleChange,
        handleSubmit,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
