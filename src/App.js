import "./App.css";
import SetupForm from "./Form/SetUpForm";
import Loading from "./Loading/LoadingScreen";
import Modal from "./Modal/Modal";
import { useGlobalContext } from "./Context/Context.jsx";

function App() {
  const {
    waiting,
    loading,
    questions,
    index,
    correct,
    nextQuestions,
    checkAnswers,
  } = useGlobalContext();
  if (waiting) {
    return <SetupForm />;
  }
  if (loading) {
    return <Loading />;
  }
  const { incorrect_answers, correct_answers, question } = questions[index];
  let answers = [...incorrect_answers];
  const tempIndex = Math.floor(Math.random() * 4);
  if (tempIndex === 3) {
    answers.push(correct_answers);
  } else {
    answers.push(answers[tempIndex]);
    answers[tempIndex] = correct_answers;
  }

  return (
    <main>
      <section className="quiz">
        <p className="correct-answers">
          Correct answers: {correct}/{index}
        </p>
        <article className="container">
          <h2 dangerouslySetInnerHTML={{ __html: question }} />
          <div className="btn-container">
            {answers.map((answer, index) => {
              return (
                <button
                  key={index}
                  className="answer-btn"
                  onClick={() => checkAnswers(correct_answers === answer)}
                  dangerouslySetInnerHTML={{ __html: answer }}
                />
              );
            })}
          </div>
        </article>
        <button className="next-question" onClick={nextQuestions}>
          next question
        </button>
      </section>
    </main>
  );
}

export default App;
