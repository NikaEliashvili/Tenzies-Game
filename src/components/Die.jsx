import React from "react";
import { nanoid } from "nanoid";

export default function Die(props) {
  function AllDots() {
    let dots = [];
    for (let i = 0; i < props.value; i++) {
      dots.push(
        <span key={nanoid()} className={`dot pip ${props.animClass}`}></span>
      );
    }
    return dots;
  }

  function dieClick() {
    props.changeHeld(props.id);
  }

  return (
    <div
      className={`dice face ${props.isHeld && "clicked"}`}
      onClick={dieClick}
    >
      {<AllDots />}
      {/* <span className="dot"> </span> */}
    </div>
  );
}
