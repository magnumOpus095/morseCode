import { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import morseCodeData from './morseCodeData/morse';

const REVERSE_MORSE = Object.fromEntries(
  Object.entries(morseCodeData).filter(([k]) => k !== " ").map(([k, v]) => [v, k])
)

function toMorse(text:string): string {
  return text
    .toUpperCase()
    .split("")
    .map((c) => morseCodeData[c] || "")
    .filter((m) => m !== undefined)
    .join("   ")
    .replace(/   \/    /g, " / ")
    .replace(/\s+\/\s+/g, " / ");
}

function fromMorse(morse:string):string {
  return morse
    .split(" / ")
    .map((word) =>
      word
        .trim()
        .split("   ")
        .map((code) => REVERSE_MORSE[code.trim()] || "?")
        .join("")
    )
    .join(" ");

}
const DotDash = ({ char, index, active }) => {
  const isDot = char === "·";
  return (
    <span
      style={{
        display: "inline-block",
        width: isDot ? "10px" : "28px",
        height: "10px",
        borderRadius: isDot ? "50%" : "5px",
        background: active
          ? "var(--accent)"
          : "var(--symbol)",
        margin: "0 2px",
        verticalAlign: "middle",
        transition: `background 0.08s ease ${index * 60}ms, transform 0.1s ease ${index * 60}ms, box-shadow 0.1s ease ${index * 60}ms`,
        transform: active ? "scale(1.3)" : "scale(1)",
        boxShadow: active ? "0 0 10px var(--accent-glow)" : "none",
        flexShrink: 0,
      }}
    />
  );
};



function App() {
  const [input, setInput] = useState("")
  return (
    <div>
      <h1>Morse Code Converter</h1>
    </div>
  )
}

export default App
