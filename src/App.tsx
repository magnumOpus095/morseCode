import { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import morseCodeData from './morseCodeData/morse';


type DotDashProps = {
  char: string;
  index: number;
  active: boolean;
}

type MorseSymbol = {
  morseChar: string;
  isPlaying: boolean;
  playIndex: number;
  globalIndex: number;
}


const REVERSE_MORSE = Object.fromEntries(
  Object.entries(morseCodeData).filter(([k]) => k !== " ").map(([k, v]) => [v, k])
)

function toMorse(text: string): string {
  return text
    .toUpperCase()
    .split("")
    .map((c) => morseCodeData[c] || "")
    .filter((m) => m !== undefined)
    .join("   ")
    .replace(/   \/    /g, " / ")
    .replace(/\s+\/\s+/g, " / ");
}

function fromMorse(morse: string): string {
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
const DotDash = ({ char, index, active }: DotDashProps) => {
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

const MorseSymbol = ({ morseChar, isPlaying, playIndex, globalIndex }: MorseSymbol) => {
  const symbols = morseChar.split("")
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0" }}>
      {symbols.map((s, i) => {
        const thisIndex = globalIndex + i;
        return (
          <DotDash
            key={i}
            char={s}
            index={i}
            active={isPlaying && thisIndex === playIndex}
          />
        );
      })}
    </span>
  );

}



function App() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("encode");
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playIndex, setPlayIndex] = useState(-1);
  const [speed, setSpeed] = useState(120);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const stopRef = useRef(false);

  const morseOutput = mode === "encode" ? toMorse(input) : "";
  const textOutput = mode === "decode" ? fromMorse(input) : "";
  const displayMorse = mode === "encode" ? morseOutput : input;


  const getAudioCtx = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new window.AudioContext();
    }
    return audioCtxRef.current;
  }

  /**
   * explaing this fucking beep function:
   * Create sound generator
   * Create volume controller
   * Connect them to speakers
   * Set pitch
   * Fade in
   * Wait
   * Fade out
   * Start sound
   * stop sound
   */
  const beeps = (ctx: AudioContext, start: number, duration: number): void => {
    const osc = ctx.createOscillator(); //sound Generator
    const gain = ctx.createGain(); //volume controller
    osc.connect(gain);//Connect Nodes
    gain.connect(ctx.destination); //destinatin means user's speakers or headphones
    osc.frequency.setValueAtTime(600, start);//Frequency = pitch.
    osc.type = "sine";//wave type
    gain.gain.setValueAtTime(0, start);//volume starts at zero
    gain.gain.linearRampToValueAtTime(0.4, start + 0.005);//start volume at 0 then after 5ms volume = 0.4 so tiny fade in
    gain.gain.setValueAtTime(0.4, start + duration - 0.005);//Hold Volume
    gain.gain.linearRampToValueAtTime(0, start + duration);//fade out (0.4 to 0) in 5ms
    osc.start(start);//Start Oscillator
    osc.stop(start + duration);//stops Oscillator
  }

  /**
   * this mf function does everything start to handling
   * Starts audio playback
   * Stops audio playback
   * Reads Morse symbols one by one
   * Schedules beeps
   * Highlights currently playing symbols
   * Handles speed changes
   */
  const playMorse = useCallback(async () => {
    if (isPlaying) {
      stopRef.current = true;
      setIsPlaying(false);
      setPlayIndex(-1);
      return;
    }

    const morse = mode === "encode" ? morseOutput : input;
    if (!morse.trim()) return;

    stopRef.current = false;
    setIsPlaying(true);

    const ctx = getAudioCtx();
    const unit = speed / 1000;
    let t = ctx.currentTime + 0.1;
    let symIdx = 0;

    const allTokens = morse.split("").map((c, i) => ({ char: c, idx: i }));

    for (let i = 0; i < morse.length; i++) {
      if (stopRef.current) break;
      const ch = morse[i];
      if (ch === "·") {
        beeps(ctx, t, unit);
        setTimeout(() => { if (!stopRef.current) setPlayIndex(i); }, (t - ctx.currentTime) * 1000);
        t += unit * 2;
      } else if (ch === "−") {
        beeps(ctx, t, unit * 3);
        setTimeout(() => { if (!stopRef.current) setPlayIndex(i); }, (t - ctx.currentTime) * 1000);
        t += unit * 4;
      } else if (ch === " ") {
        t += unit * 2;
      }
    }

    const totalMs = (t - ctx.currentTime) * 1000;
    setTimeout(() => {
      setIsPlaying(false);
      setPlayIndex(-1);
    }, totalMs);
  }, [isPlaying, morseOutput, input, mode, speed]);

  const copyToClipboard = () => {
    const text = mode === "encode" ? morseOutput : textOutput;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  const clearAll = () => {
    setInput("");
    stopRef.current = true;
    setIsPlaying(false);
    setPlayIndex(-1);
  };


  const renderMorseVisual = () => {
    const morse = mode === "encode" ? morseOutput : input;
    if (!morse) return null;

    const parts = morse.split(" / ");

    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 20px", alignItems: "center" }}>
        {parts.map((word, wi) => {
          const codes = word.trim().split("   ");
          return (
            <span key={wi} style={{ display: "inline-flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
              {codes.map((code, ci) => {
                const globalIndex = morse.indexOf(code);
                return (
                  <span key={ci} style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                    <MorseSymbol morseChar={code} isPlaying={isPlaying} playIndex={playIndex} globalIndex={globalIndex} />
                    <span style={{ fontSize: "10px", color: "var(--label)", fontFamily: "'Space Mono', monospace", letterSpacing: "0.05em" }}>
                      {mode === "encode"
                        ? (Object.entries(morseCodeData).find(([, v]) => v === code)?.[0] || "")
                        : (REVERSE_MORSE[code] || "?")}
                    </span>
                  </span>
                );
              })}
              {wi < parts.length - 1 && (
                <span style={{ color: "var(--divider)", fontSize: "20px", fontFamily: "'Space Mono', monospace", lineHeight: 1 }}>/</span>
              )}
            </span>
          );
        })}
      </div>

    )

  }

  return (
    <div className='morse-app'>
      <div className="bg-grid" />
      <div className="bg-glow" />

      <div className="container">
        <header className="header">
          <div className="header-tag">· − · − Signal Tool</div>
          <h1>Morse<br /><span>Code</span></h1>
          <p className="header-sub">··· · −·· / − · −·− / ···</p>
        </header>

        {/* mode switching */}
        <div className="mode-switch">
          <button className={`mode-btn ${mode === "encode" ? "active" : ""}`} onClick={() => { setMode("encode"); clearAll(); }}>
            Text → Morse
          </button>
          <button className={`mode-btn ${mode === "decode" ? "active" : ""}`} onClick={() => { setMode("decode"); clearAll(); }}>
            Morse → Text
          </button>
        </div>

        {/* input card */}
        <div className="card">
          <div className="card-header">
            <span className="card-label">
              {
                mode === "encode" ? "input text" : "input morse"
              }
            </span>

            <span className='char-count'>
              {
                input.length
              }
            </span>
          </div>

          <textarea value={input} onChange={(e) => setInput(e.target.value)} className="textarea" placeholder={
            mode === "encode"
              ? "Type anything to encode..."
              : "Paste morse code here (use · − and / for spaces)..."
          } spellCheck={false} />
        </div>

        {/* output card */}
        {
          (mode === "encode" ? morseOutput : textOutput) && (
            <div className="card">
              <div className="card-header">
                <span className="card-label">
                  {mode === "encode" ? "morse output" : "decoded text"}
                </span>
                {isPlaying && (
                  <span className="playing-indicator">
                    <span className="playing-dot" />Transmitting
                  </span>
                )}
              </div>
              <div className="output-area">
                {mode === "encode" ? morseOutput : textOutput}
              </div>
              {mode === "encode" && morseOutput && (
                <div className="visual-area">
                  <div className="visual-label">Visual Pattern</div>
                  {renderMorseVisual()}
                </div>
              )}
            </div>
          )
        }

        {/* controls */}
        {
          input.trim() && (
            <div className="controls" style={{ marginBottom: "32px" }}>
              {(mode === "encode" ? morseOutput : textOutput) && (
                <button className="btn btn-accent" onClick={copyToClipboard}>
                  {copied ? "✓ Copied" : "Copy Output"}
                </button>
              )}
              {mode === "encode" && morseOutput && (
                <button
                  className={`btn ${isPlaying ? "btn-stop" : ""}`}
                  onClick={playMorse}
                >
                  {isPlaying ? "⬛ Stop" : "▶ Play Audio"}
                </button>
              )}
              <button className="btn" onClick={clearAll}>✕ Clear</button>
              {mode === "encode" && morseOutput && (
                <div className="speed-control">
                  <span className="speed-label">Speed <span className="speed-val">{Math.round(1200 / speed)} WPM</span></span>
                  <input
                    type="range"
                    min={60}
                    max={300}
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                  />
                </div>
              )}
            </div>
          )
        }
        <div className="section-title">· − Reference Chart</div>
        <div className="reference-grid">
          {"ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("").map((char) => (
            <div
              key={char}
              className="ref-cell"
              style={{ cursor: "pointer" }}
              onClick={() => {
                if (mode === "encode") setInput((p) => p + char);
                else setInput((p) => (p ? p + "   " : "") + morseCodeData[char]);
              }}
            >
              <span className="ref-char">{char}</span>
              <span className="ref-morse">{morseCodeData[char]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
