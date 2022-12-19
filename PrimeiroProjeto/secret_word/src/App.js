//CSS
import "./App.css";

//React
import { useCallback, useEffect, useState } from "react";

//Data
import { wordsList } from "./data/Words";

//Componentes
import StartScreen from "./Components/StartScreen";
import Game from "./Components/Game";
import GameOver from "./Components/GameOver";
import Win from "./Components/Win";

const stages = [
  { id: 1, name: "Start" },
  { id: 2, name: "Game" },
  { id: 3, name: "End" },
  { id: 4, name: "Win" },
];

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(3);
  const [score, setScore] = useState(0);

  const PickWordAndCategory = useCallback(() => {
    // Pick a random category
    const categories = Object.keys(words);
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];

    // Pick a random word
    const word =
      words[category][Math.floor(Math.random() * words[category].length)];

    return { word, category };
  }, [words]);

  //Start the secret wordsGame
  const StartGame = useCallback(() => {
    //Clear all letters
    clearLetterStates();

    // pick word and pick category
    const { word, category } = PickWordAndCategory();

    // create and array of letters
    let wordLetters = word.split("");

    wordLetters = wordLetters.map((l) => l.toLowerCase());

    //fill states
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  }, [PickWordAndCategory]);

  //Process the letter input
  const VerifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    // check if letter has alredy been utilized
    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }

    //push guessed letter or remove a guess
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetter) => [
        ...actualGuessedLetter,
        normalizedLetter,
      ]);
    } else {
      setWrongLetters((actualWrongLetter) => [
        ...actualWrongLetter,
        normalizedLetter,
      ]);

      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  };

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  };

  // check if guesses ended
  useEffect(() => {
    if (guesses <= 0) {
      // Reset all states
      clearLetterStates();

      setGameStage(stages[2].name);
    }
  }, [guesses]);

  // check win conditional
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];

    if (guessedLetters.length === 0 && uniqueLetters.length === 0) return;
    //win conditional
    if (guessedLetters.length === uniqueLetters.length) {
      //add score
      setScore((actualScore) => actualScore + 100);

      //add guesses
      if (score % 1000 === 0 && score < 10000) {
        setGuesses((valorAtual) => valorAtual + 1);
      } else if (score === 10000) {
        //Chamar tela de vitória
        console.log("Passou aqui");
        setGameStage(stages[3].name);
      }
      //restart game with new word
      StartGame();
    }
  }, [guessedLetters, score, letters, StartGame]);

  //Retry the game
  const Retry = () => {
    setScore(0);
    setGuesses(3);

    setGameStage(stages[0].name);
  };

  return (
    <div className="App">
      {gameStage === "Start" && <StartScreen startGame={StartGame} />}
      {gameStage === "Game" && (
        <Game
          verifyLetter={VerifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === "End" && <GameOver retry={Retry} score={score} />}
      {gameStage === "Win" && <Win retry={Retry} score={score} />}
    </div>
  );
}

export default App;
