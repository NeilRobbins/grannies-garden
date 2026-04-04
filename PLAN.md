# Granny's Garden — Implementation Plan

Recreating the classic 1983 BBC Micro educational adventure game as a single-page browser game.

## Task List

### Task 1: Rendering Engine — Teletext Display Panel & CRT Effects

**Description:** Build the foundational HTML/CSS rendering engine: a fixed-ratio 40×25 character grid panel centred on screen with dark CRT-style border/surround. Implement the 8-colour teletext palette, chunky monospace typography (`"Courier New", monospace`), subtle CRT scanline overlay and screen curvature via CSS (with toggle to disable), and phosphor glow text-shadow. This is the visual foundation everything else builds on.

**Observable Outcomes:**
- Opening `index.html` shows a centred black display panel with CRT border
- Scanline overlay visible; toggle button enables/disables it
- Text rendered in chunky monospace with phosphor glow
- Panel scales responsively on desktop and mobile
- All 8 teletext colours render correctly on black background

**Dependencies:** None — this is the foundation.

---

### Task 2: Typewriter Text Animation System

**Description:** Implement character-by-character typewriter text rendering within the display panel. Text appears one character at a time at adjustable speed. Clicking anywhere or pressing Space skips the animation and shows full text immediately. Prepare a text blip sound hook (actual audio comes in Task 9).

**Observable Outcomes:**
- Narrative text animates character by character in the text area
- Click or Space skips to fully rendered text
- Animation speed is configurable via a constant
- Multiple text blocks can be queued sequentially
- Callback fires when text animation completes

**Dependencies:** Task 1

---

### Task 3: Navigation System — Location Graph & Menu Choices

**Description:** Build the location graph connecting all 9 locations (Granny's Garden Gate, The Crossroads, The Dark Forest, The Enchanted River, The Mountain Path, The Witch's Cottage, The Crystal Cave, The Castle Ruins, The Throne Room). Implement numbered menu choices displayed below narrative text. Player selects by clicking options or pressing 1-9 keys. Transitions between locations update the display.

**Observable Outcomes:**
- All 9 locations defined in a data structure with connections
- Numbered menu renders below text area; clickable and keyboard-accessible (1-9 keys)
- Selecting an option transitions to the target location
- Current location name displayed as a header
- The Crossroads acts as a hub with paths to the four main areas
- `aria-labels` on interactive menu elements

**Dependencies:** Tasks 1-2

---

### Task 4: Teletext Block Art for All Locations

**Description:** Create teletext-style block art illustrations for each of the 9 locations using Unicode block characters (▀ ▄ █ ▌ ▐ ░ ▒ ▓) and box-drawing characters. Each scene should be roughly 15-20 rows tall, coloured with teletext palette colours. Art subjects: garden gate, crossroads signpost, dark forest trees, enchanted river, mountain path, witch's cottage, crystal cave, castle ruins, throne room.

**Observable Outcomes:**
- Each location displays a unique teletext block art scene in the art area
- Art uses only the 8 teletext colours on black background
- Art is 15-20 rows tall and fits within the 40-column grid
- Art evokes the original BBC Micro aesthetic — chunky, atmospheric, recognisable

**Dependencies:** Task 1. Can be done in parallel with Tasks 2-3.

---

### Task 5: Location Content — Narrative Descriptions & Dialogue

**Description:** Write all narrative text for each location: initial visit descriptions, revisit text, Granny's dialogue (quest briefing + hints on return), and transitional text. Tone should be warm but slightly eerie, second person ("You step through..."), reading level ages 7-9 but enjoyable for adults. Granny is kind and helpful; the world feels like a storybook with an undercurrent of danger.

**Observable Outcomes:**
- Every location has a unique first-visit narrative description
- Revisit text differs from first-visit text
- Granny's Garden Gate has quest briefing dialogue on first visit
- Returning to Granny provides contextual hints based on progress
- All text displays via the typewriter animation system
- Narrative tone is consistent — warm, storybook-like, slightly eerie

**Dependencies:** Tasks 1-3

---

### Task 6: Puzzle Engine — Framework & All Puzzle Content

**Description:** Build a puzzle engine supporting 6 puzzle types: riddles (multiple choice), word puzzles (unscramble/fill missing letters), maths puzzles (arithmetic for ages 6-9), logic puzzles (elimination clues), sequence/pattern puzzles (multiple choice), and memory challenges (show-then-hide items). Each puzzle type has a renderer and answer validator. Framework supports randomised puzzle selection per child (2-3 puzzles per child, rotated on replay).

**Observable Outcomes:**
- Puzzle engine can present any of the 6 puzzle types
- Each puzzle type renders correctly within the teletext display
- Answer validation works with encouraging feedback on wrong answers ("That wasn't quite right. Would you like to try again?")
- At least 2-3 puzzles exist per child (12-18 total puzzles minimum)
- Puzzle selection is randomised per playthrough for replayability
- Solving a puzzle triggers a "child rescued" state change

**Dependencies:** Tasks 1-3

---

### Task 7: The Wicked Witch — Encounters, Catch Screen & Chase

**Description:** Implement the witch system: random encounters (15-25% chance) at defined locations/transitions, dramatic catch screen with red/black flashing (3-4 flashes), large teletext-art witch face (pointed hat, angular face, sharp nose, glowing eyes in green/magenta), menacing dialogue ("I've been watching you, little one..."), and consequence (sent back to Crossroads, puzzle progress resets, rescued children kept). In the Witch's Cottage, implement timed chase sequence ("Quick! Which way do you run? Left / Right / Hide") with countdown. Magic Cloak immunity handled in Task 8 (inventory).

**Observable Outcomes:**
- Witch randomly appears during location transitions with correct probability (15-25%)
- Screen flashes red/black dramatically before witch face appears
- Teletext-art witch face displays — iconic and unsettling
- Menacing dialogue text appears via typewriter animation
- Player is returned to Crossroads after encounter
- Cottage has timed chase sequence with countdown timer
- Wrong choice in chase = caught; right choice = escape
- Witch encounter locations are randomised per playthrough

**Dependencies:** Tasks 1-5

---

### Task 8: Inventory System — Items, Gating & Magic Cloak

**Description:** Implement inventory of up to 5 items displayed at bottom of screen: Lantern (needed in Crystal Cave), Magic Cloak (protects from witch, 3 uses), Golden Key (opens Castle Ruins), Rope (needed for Mountain Path), Apple (can be given to a character for a clue). Items found at specific locations or given as puzzle rewards. Usage is context-sensitive (automatic prompts when at relevant location). Magic Cloak location randomised per playthrough.

**Observable Outcomes:**
- Inventory bar displays at screen bottom with 5 slots (labels/icons)
- Items can be picked up and appear in inventory
- Items are consumed/used at appropriate locations (Lantern in cave, Key at castle, etc.)
- Magic Cloak blocks witch encounters and decrements uses (3 → 0)
- Magic Cloak spawn location randomised each playthrough
- Attempting to enter a location without required item gives a contextual hint
- Apple can be given to an NPC for a clue

**Dependencies:** Tasks 1-3, 7 (for Magic Cloak integration with witch system)

---

### Task 9: Audio System — Web Audio API Sound Effects

**Description:** Implement all audio using Web Audio API (no audio files): text blip (tiny square wave beep per character), navigation click on menu selection, puzzle solved ascending major arpeggio, witch encounter descending chromatic harsh tone (startling but not extreme), child rescued triumphant short fanfare, victory extended celebratory melody, subtle low-frequency background hum (toggleable). Include a mute/unmute button.

**Observable Outcomes:**
- Each sound effect plays at the correct game event
- Text typewriter has per-character blip sound
- Witch encounter sound is harsh and unsettling (descending chromatic square waves)
- Puzzle solved / child rescued sounds are cheerful and distinct
- Victory melody plays on final screen
- Mute/unmute button toggles all audio
- Background hum is subtle and can be toggled independently
- All sounds generated programmatically — no external audio files

**Dependencies:** Tasks 1-2, 6-7 (for event hooks)

---

### Task 10: Progress Tracking, Victory Condition & Statistics

**Description:** Track which of the 6 children have been rescued, displayed as stars (★ filled = rescued, ☆ hollow = missing) in the status bar. When all 6 are rescued, unlock the Throne Room path. Victory screen shows grand teletext art of throne room with King, Queen, and children, celebratory typewriter text, and statistics summary (puzzles solved, witch encounters survived, items found). "Play Again" button resets game with fresh randomisation.

**Observable Outcomes:**
- Status bar shows 6 stars reflecting rescue progress
- Each child rescue updates the star display immediately
- All 6 rescued → Throne Room becomes accessible from Crossroads
- Victory screen displays throne room teletext art
- Statistics summary shows: puzzles solved, witch encounters, items found
- "Play Again" fully resets game state with new randomisation
- Victory melody plays on this screen

**Dependencies:** Tasks 1-8 (all core gameplay systems)

---

### Task 11: Polish — Animations, Mobile Responsiveness & Accessibility

**Description:** Final polish pass: ensure CRT toggle works smoothly, witch screen flash animation is dramatic, all transitions feel smooth. Verify mobile responsiveness (game panel scales correctly, touch targets large enough). Accessibility: full keyboard navigation, `aria-labels` on all interactive elements, sufficient colour contrast. Ensure the game is under 200KB total.

**Observable Outcomes:**
- Game plays correctly on mobile browsers (iOS Safari, Android Chrome)
- Touch targets are minimum 44px
- All interactive elements have `aria-labels`
- Keyboard-only playthrough is fully possible (Tab + Enter or number keys)
- CRT effect toggle works without layout shift
- File size is under 200KB
- No external dependencies — fully self-contained

**Dependencies:** Tasks 1-10 (all features complete)

---

### Task 12: End-to-End Testing & Replayability Verification

**Description:** Play through the complete game multiple times to verify: all 6 children can be rescued, all puzzle types work correctly, witch encounters fire at correct probabilities, inventory items gate progress correctly, victory screen displays, and "Play Again" produces a different experience (different puzzles, different witch encounters, different Magic Cloak location). Fix any bugs found.

**Observable Outcomes:**
- Complete playthrough possible from start to victory
- All 9 locations reachable and functional
- All puzzle types solvable with correct validation
- Witch encounters occur randomly but within defined probability
- Inventory gating works (can't enter cave without lantern, etc.)
- Replay produces different puzzle selection and item placement
- No JavaScript errors in console during full playthrough
- Game restarts cleanly on "Play Again" and on page refresh

**Dependencies:** Tasks 1-11 (everything built and polished)

---

## Dependency Graph

```
Task 1 (Rendering Engine)
  ├── Task 2 (Typewriter Text)
  │     └── Task 3 (Navigation)
  │           ├── Task 5 (Location Content)
  │           │     └── Task 7 (Witch System)
  │           │           └── Task 8 (Inventory) ──┐
  │           └── Task 6 (Puzzle Engine) ──────────┤
  ├── Task 4 (Block Art) [parallel with 2-3]       │
  └── Task 9 (Audio) [after 2, 6, 7]               │
                                                    ▼
                                            Task 10 (Progress/Victory)
                                                    │
                                            Task 11 (Polish)
                                                    │
                                            Task 12 (Testing)
```
