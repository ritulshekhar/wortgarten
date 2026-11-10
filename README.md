# Wortgarten — Personal German Learning PWA

A minimalist, offline-first Progressive Web App designed as an everyday companion to Duolingo German. Built with Japanese minimalism (*wabi-sabi* and *ma* negative space), this app runs entirely client-side with zero external servers or accounts, storing your vocabulary and spaced-repetition progress directly on your device.

---

## Features

1. **Word Log (Home Tab)**
   - Fast keyboard-friendly entry: German, English, word type (noun, verb, adjective, etc.), gender article (`der`/`die`/`das`), plural, and optional example sentence. Pressing Enter adds the word and immediately refocuses the German input.
   - Dedicated German umlaut bar (`ä`, `ö`, `ü`, `Ä`, `Ö`, `Ü`, `ß`) directly above the keyboard.
   - Bulk add: paste lists separated by dashes (`suchen - to search`), commas (`bekommen, to get`), or tabs/CSV, with duplicate warning preview.
   - Searchable, filterable by level (A1–C1), "Weak words", or added date; sortable by newest, alphabetical, or most mistakes.
   - Tap to edit or delete with a non-blocking undo toast.
   - "Word of the Day" prompt on the home tab highlighting due words.
   - Full pronunciation support using browser SpeechSynthesis (`de-DE`).

2. **Smart Practice & Spaced Repetition (Quiz Engine)**
   - Only quizzes words from your personal log.
   - Smart session builder: If total words ≤ 30, quizzes all; otherwise draws an adaptive session (default 20 words) prioritizing due words (Spaced Repetition Leitner system), weak words (high mistake ratio), and new untested vocabulary.
   - 5 quiz modes (or Mixed):
     1. German → English (multiple choice or typing)
     2. English → German (typing with umlaut folding)
     3. Article quiz (`der` / `die` / `das` for nouns)
     4. Listening quiz (audio playback → typing what you hear)
     5. Fill-in-the-blank (sentence cloze drill using your recorded example sentences)
   - Tolerant answer evaluation: accepts `ae`/`oe`/`ue`/`ss` as `ä`/`ö`/`ü`/`ß`, handles comma-separated translations, and tolerates 1-letter typos on words with 6+ characters.
   - 5-box Leitner SRS (intervals: 1, 2, 4, 8, 16 days).
   - "I knew this" manual override button to fix false negatives. Re-queues wrong answers once at session end.

3. **Grammar Reference & Interactive Drills**
   - 8 comprehensive, grammatically verified topics in `src/grammar/grammar.ts`:
     1. Gender & articles (der/die/das, ein/eine, and the 4 cases: Nominativ, Akkusativ, Dativ, Genitiv)
     2. Possessive articles (mein, dein, sein, ihr, unser, euer, ihr/Ihr with interactive noun gender × case picker)
     3. Verb conjugation (present tense for regular verbs, `sein`, `haben`, `werden`, stem-changing verbs like `fahren`/`sprechen`/`sehen`, and modal verbs)
     4. Separable verbs (`aufstehen`, `anrufen`) & word order rules
     5. Sentence structure (V2 rule, TMP: Time-Manner-Place, questions, subordinate clauses with `weil`/`dass`)
     6. Negation (`nicht` vs. `kein`)
     7. Perfekt past tense (`haben`/`sein` + Partizip II formation & ~20 irregular participles)
     8. Prepositions (Akkusativ, Dativ, and two-way Wechselpräpositionen)
   - Instant multiple-choice and fill-the-blank drills per topic with rationale explanations.
   - Conjugation Tool: look up any German infinitive (~60 common irregular verbs + rule-based regular stem conjugation).
   - Editable personal notes per grammar topic persisted to IndexedDB.

4. **Progress & Analytics**
   - Daily goal streak counter with minimal SVG circular progress ring.
   - Breakdown of words by CEFR level (A1 through C1) and mastery count (Leitner Box 4–5).
   - Clean 30-day SVG bar chart of vocabulary acquisition.
   - Top 10 weakest words and weakest grammar topic tracker.

5. **Settings & Portability**
   - Theme toggle: Light (*wabi-sabi* warm washi `#F6F2EA`), Dark (deep charcoal `#171715`), or System default.
   - Haptic vibration toggle on incorrect answers (`navigator.vibrate`).
   - One-click starter pack: "Load 15 Sample A1 Words" to test quizzes and SRS intervals immediately.
   - JSON export and import for seamless personal backups.
   - Gentle backup reminder if no export was made in the last 14 days.
   - Safe reset requires typing `RESET`.

---

## Tech Stack & Dependencies

Built with minimal dependencies to ensure long-term stability and fast mobile performance:

- **Vite 5 + React 18 + TypeScript**: Lightning-fast compilation and static type safety.
- **Dexie.js (`dexie`)**: Robust, promise-based wrapper over browser `IndexedDB`. Chosen over `localStorage` because mobile browsers (especially Safari on iOS) can evict `localStorage` when storage is tight.
- **`vite-plugin-pwa`**: Generates a web app manifest and Workbox Service Worker to precache all code, icons, and self-hosted fonts for 100% offline usage.
- **Vitest**: Fast unit test runner for the SRS engine, smart session builder, fuzzy answer matcher, and bulk parser.
- **Self-hosted Fonts**: *Shippori Mincho* (headings) and *Zen Kaku Gothic New* (body) self-hosted as WOFF2 in `public/fonts/`. No external Google Fonts CDN requests at runtime.
- **Zero UI Libraries**: Pure CSS variables, fluid `clamp()` type scaling, flexbox/grid layout, and zero runtime styling overhead.

---

## Getting Started Locally

### Prerequisites
- Node.js 18+ (tested with Node 20 and Node 25)
- npm 9+

### 1. Install Dependencies
```bash
cd wortgarten
npm install
npm test        # Runs all 52 unit tests
npm run dev     # Starts development server at http://localhost:5173
npm run build   # Compiles production bundle & generates Service Worker
npm run preview # Previews the production build
```

---

## Deploying to Vercel (HTTPS is required for PWA install)

Progressive Web Apps require a secure HTTPS context to register service workers and trigger home screen installation.

### Option A: Deploy via Vercel CLI
```bash
# Install Vercel CLI globally if needed
npm install -g vercel

# Deploy directly from the project directory
vercel
```
When prompted:
- **Set up and deploy?**: `y`
- **Which scope?**: Choose your account
- **Link to existing project?**: `n`
- **Project name**: `wortgarten`
- **Directory**: `./`
- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

For production deployment:
```bash
vercel --prod
```

### Option B: Deploy via Vercel Dashboard
1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Vercel automatically detects Vite. Verify:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**. Your PWA will be live with free automatic SSL/HTTPS.

---

## Installing to Home Screen

### Android (Chrome)
1. Navigate to your deployed HTTPS URL in **Google Chrome**.
2. Tap the three dots menu (**⋮**) in the top right corner.
3. Tap **"Install app"** or **"Add to Home screen"**.
4. Tap **Install** in the confirmation dialog.
5. The app icon (red *hanko* stamp with the kanji **学**) will appear on your home screen and open full-screen without browser URL bars.

### iOS (Safari)
1. Navigate to your deployed HTTPS URL in **Safari** (Chrome on iOS does not support PWA installation).
2. Tap the **Share** button (box with an upward arrow at the bottom of the screen).
3. Scroll down and tap **"Add to Home Screen"**.
4. Confirm the app title ("Deutsch") and tap **Add** in the top right.
5. Launch the app from your iPhone or iPad home screen for standalone, full-screen offline learning.

---

## Design System & Color Palette

The user interface follows Japanese minimalism (*wabi-sabi* and *ma*):

| Token | Light Theme | Dark Theme | Purpose |
| :--- | :--- | :--- | :--- |
| `--paper` | `#F6F2EA` | `#171715` | Warm washi off-white / charcoal background |
| `--surface` | `#FBF9F4` | `#1F1F1D` | Card backgrounds |
| `--ink` | `#1E1E1C` | `#EDE9DF` | Primary text, borders, correct checks |
| `--ink-soft` | `#6B6A64` | `#9B9890` | Subtitles, descriptions, hints |
| `--line` | `#E2DDD1` | `#2E2E2B` | 1px hairline dividers and borders |
| `--accent` | `#B8372B` | `#B8372B` | Vermilion hanko stamp, active nav, errors |

---

## License
MIT. Created for personal, distraction-free German study.

