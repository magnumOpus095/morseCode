# · − Morse Code Generator

A modern, interactive Morse code encoder and decoder built with React. Features real-time audio playback, animated visual patterns, and a clean dark terminal aesthetic — no sign-up, no fluff.

---

## Features

- **Encode** — Convert plain text to Morse code instantly as you type
- **Decode** — Paste Morse code and get the original text back
- **Audio Playback** — Hear your Morse code as real beeps using the Web Audio API
- **Adjustable Speed** — Slide between ~4 WPM and ~20 WPM to control playback tempo
- **Visual Pattern Display** — Each character rendered as animated dots and dashes, lighting up in sync with audio
- **Transmission Animation** — Symbols highlight in real time during playback
- **Clickable Reference Chart** — A–Z and 0–9 chart; click any character to insert it into the input
- **Copy Output** — One-click copy of encoded or decoded result
- **No authentication** — Just open and use it

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React (functional components + hooks) |
| Audio | Web Audio API (`AudioContext`) |
| Fonts | [Syne](https://fonts.google.com/specimen/Syne) + [Space Mono](https://fonts.google.com/specimen/Space+Mono) via Google Fonts |
| Styling | Inline styles + CSS-in-JS (`<style>` tag) |
| State | `useState`, `useRef`, `useCallback` |
| Build | Any React-compatible bundler (Vite, CRA, Next.js) |

---

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone the repo
git clone https://github.com/your-username/morse-code-generator.git
cd morse-code-generator

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Using with Create React App

```bash
npx create-react-app morse-app
cd morse-app
# Replace src/App.js content with the component, or drop morse_code_generator.jsx into src/
npm start
```

### Using with Next.js

Drop the component into your `pages/` or `app/` directory and add `"use client"` at the top if using the App Router.

---

## Usage

### Text → Morse

1. Select **Text → Morse** mode (default)
2. Type anything into the input field
3. The Morse output appears below with a visual dot-dash pattern
4. Hit **▶ Play Audio** to hear the transmission
5. Adjust the speed slider (WPM) to your preference
6. Click **Copy Output** to copy the Morse string

### Morse → Text

1. Select **Morse → Text** mode
2. Paste or type Morse code using `·` (dot), `−` (dash), spaces between symbols, and ` / ` between words
3. The decoded text appears instantly

### Reference Chart

Click any character in the A–Z / 0–9 grid at the bottom to insert it directly into the input field, in whichever mode is active.

---

## Morse Code Format

| Element | Representation |
|---|---|
| Dot | `·` |
| Dash | `−` |
| Symbol separator | 3 spaces |
| Word separator | ` / ` |

**Example:** `HELLO` → `···· · ·−·· ·−·· −−−`

---

## Supported Characters

- **Letters:** A–Z (case-insensitive)
- **Digits:** 0–9
- **Punctuation:** `.` `,` `?` `!` `/` `@`
- **Space** between words → `/`

---

## Project Structure

```
morse-code-generator/
├── src/
│   └── morse_code_generator.jsx   # Main component (self-contained)
├── public/
│   └── index.html
├── package.json
└── README.md
```

The entire app lives in a single `.jsx` file — no external UI libraries, no state management dependencies, no backend.

---

## Design

- **Theme:** Dark terminal / signal aesthetic
- **Accent color:** `#e8ff47` (acid yellow)
- **Background:** Deep space dark `#0a0a0f` with a subtle dot grid overlay
- **Typography:** `Syne` for headings and input, `Space Mono` for all Morse/code elements

---

## Browser Compatibility

Works in any modern browser that supports the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API):

- Chrome 66+
- Firefox 60+
- Safari 14.1+
- Edge 79+

> Audio requires a user gesture (button click) to start due to browser autoplay policies.

---

## License

MIT — free to use, modify, and distribute.

---

*··· · −·· / − · −·− / ···*