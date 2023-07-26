import React from "react";
import { nanoid } from "nanoid";

export default function Die(props) {
  function allDots() {
    let dots = [];
    for (let i = 0; i < props.value; i++) {
      dots.push(
        <span key={nanoid()} className={`dot pip ${props.animClass}`}></span>
      );
    }
    return dots;
  }

  return (
    <div
      className={`dice face ${props.isHeld && "clicked"}`}
      onClick={() => props.changeHeld(props.id)}
    >
      {allDots()}
      {/* <span className="dot"> </span> */}
    </div>
  );
}
