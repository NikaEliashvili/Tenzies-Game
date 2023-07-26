import React from "react";
import { nanoid } from "nanoid";
import Die from "./components/Die";
import Confetti from "react-confetti";

export default function App() {
  const [dice, setDice] = React.useState(randNumb());
  const [diceElements, setDiceElements] = React.useState([]);
  const [tenzies, setTenzies] = React.useState(false);
  const [countDice, setCountDice] = React.useState(1);
  const [records, setRecords] = React.useState(
    () => JSON.parse(localStorage.getItem("records")) || {}
  );
  const [time, setTime] = React.useState(0);
  const [i, setI] = React.useState(0);

  // state to check stopwatch running or not
  const [isRunning, setIsRunning] = React.useState(false);
  React.useEffect(() => {
    let intervalId;
    if (isRunning) {
      // setting time from 0 to 1 every 10 milisecond using javascript setInterval method
      intervalId = setInterval(() => setTime(time + 1), 10);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, time]);
  const timeStamp = (time) => {
    const hours = Math.floor(time / 360000);

    // Minutes calculation
    const minutes = Math.floor((time % 360000) / 6000);

    // Seconds calculation
    const seconds = Math.floor((time % 6000) / 100);

    // Milliseconds calculation
    const milliseconds = time % 100;
    return (
      <span>
        {hours}:{minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}:
        {milliseconds.toString().padStart(2, "0")}
      </span>
    );
  };
  // mofidyTimeInHours(time);

  const startAndStop = (bool) => {
    setIsRunning(bool);
  };

  const reset = () => {
    setTime(0);
  };
  //  const bestTimeAnd
  // function findWinner() {}
  React.useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === firstValue);
    if (allHeld && allSameValue) {
      startAndStop(false);
      if (records.bestRolls && records.bestTime) {
        localStorage.setItem(
          "records",
          JSON.stringify({
            bestRolls:
              countDice < records.bestRolls ? countDice : records.bestRolls,
            bestTime: time < records.bestTime ? time : records.bestTime,
          })
        );
      }
      if (!records.bestRolls || !records.bestTime) {
        localStorage.setItem(
          "records",
          JSON.stringify({
            bestRolls: countDice,
            bestTime: time,
            // bestRolls:
            //   countDice < records.bestRolls ? countDice : records.bestRolls,
            // bestTime: time < records.bestTime ? time : records.bestTime,
          })
        );
      }

      setRecords(JSON.parse(localStorage.getItem("records")));
      setTenzies(true);
    }
  }, [dice]);

  function renderRandomNUmbers() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
      animClass: "",
    };
  }

  function randNumb() {
    const arrayOfNumbers = [];
    for (let i = 0; i < 10; i++) {
      arrayOfNumbers.push(renderRandomNUmbers());
    }
    return arrayOfNumbers;
  }

  function newDice() {
    if (!tenzies) {
      setCountDice((prevDice) => prevDice + 1);
      setDice((prevDice) =>
        prevDice.map((die) => {
          if (die.isHeld) {
            return {
              ...die,
              animClass: "",
            };
          } else {
            return {
              value: Math.ceil(Math.random() * 6),
              isHeld: false,
              id: nanoid(),
              animClass: "dotAnim",
            };
          }
        })
      );
    } else {
      reset();
      setI(0);
      setCountDice(0);
      setTenzies(false);
      setDice(randNumb());
    }
  }

  function changeHeld(itemId) {
    // START TIMING HERE
    if (i === 0) {
      startAndStop(true);
      setI(1);
    }
    setDice((prevDice) => {
      return prevDice.map((die) => {
        return die.id === itemId
          ? { ...die, isHeld: !die.isHeld, animClass: "" }
          : die;
      });
    });
  }
  React.useEffect(() => {
    const diceElementsTemp = dice.map((die) => {
      return (
        <Die
          key={die.id}
          id={die.id}
          value={die.value}
          isHeld={die.isHeld}
          changeHeld={changeHeld}
          animClass={die.animClass}
        />
      );
    });
    setDiceElements(diceElementsTemp);
  }, [dice]);

  return (
    <main>
      <div className="app">
        <div className="main">
          {tenzies && <Confetti />}
          <h1 className="main-header">Tenzies</h1>
          <p className="main-par">
            Roll until all dice are the same. Click each die to freeze it at its
            current value between rolls.
          </p>
          {tenzies && (
            <div className="winner-background">
              <h1 className="winner">You Won</h1>
              <h3 className="track-rolls done">
                Best Rolls: <span>{records.bestRolls}</span>
              </h3>
              <h3 className="track-rolls done">
                Best Time:
                {timeStamp(records.bestTime)}
              </h3>
            </div>
          )}
          <div className="dice-container ">{diceElements}</div>
          <button onClick={newDice}>{tenzies ? "New Game" : "Roll"}</button>
          <p className="track-rolls">
            Track Rolls: <span>{countDice}</span>
          </p>
          <p className="track-rolls">
            Track Time:
            {timeStamp(time)}
            {/* <span>
              {hours}:{minutes.toString().padStart(2, "0")}:
              {seconds.toString().padStart(2, "0")}:
              {milliseconds.toString().padStart(2, "0")}
            </span> */}
          </p>
        </div>
      </div>
    </main>
  );
}
