# Typing challenge

Confirmed: a no-login game near the bottom of home, standardized passages with lowercase letters and no punctuation, a live ghost cursor, a 100 WPM target, shared live attempts/wins/losses, a monthly top-10 winners-only arcade leaderboard with two-letter initials, abuse prevention, Sebastian's keyboard sounds, and comfortable mobile play. Hosting and services must stay at $0.

Everything labeled proposed below needs review before the ranked rules are finalized.

## Experience

Introduce the challenge with concise copy such as “Match or beat my 100 WPM.” Show the 30-word passage length, winning threshold, and a short notice that leaving a started test counts as a loss. During play, show actual passage word count, progress, and elapsed time. Provide Start, sound/volume controls, and readable rules. Do not require a login, name, or initials to begin.

On desktop, put the prompt/input on the left and the live stats/leaderboard on the right. On phones, put a compact stats row above or immediately below the test and the full leaderboard afterward. The typing input is the visual focus while playing; pause nearby idle animations.

After a test, show WPM, accuracy, win/loss, and Retry. Server verification may briefly show “Checking result.” Only a verified win triggers the celebration. A leaderboard qualification prompt is a separate step; declining initials does not change the win/loss result.

## Proposed ranked rules

| Setting | Current rule or proposal | Reason |
| --- | --- | --- |
| Length, working interpretation | Exactly 30 words from one or more sentences | Interpret “30 words per minute” as passage length and keep the 100 WPM target |
| Format, interpreted | Finish the assigned passage; measure elapsed time | Replaces the earlier fixed 30-second proposal |
| Text, confirmed | Lowercase letters and spaces; no punctuation or numeric digits | Normalize passages before display; case and punctuation are not challenges |
| Start | Explicit Start action, server acceptance, then a short 3-second countdown | Clear counted attempt and fixed timing |
| Threshold | Unrounded verified WPM greater than or equal to 100 | Directly implements “at least 100” |
| Completion, proposed | Stop when the full normalized passage is correctly entered | Every assigned word must be completed; corrections cost elapsed time |
| Accuracy | Show it; no additional win threshold initially | Sebastian requested a WPM condition, not an extra accuracy rule |
| Errors, proposed | Backspace/correction supported; unresolved mistakes prevent completion | No skipping hard words to inflate WPM |
| Pause | No pause in ranked mode | Elapsed time includes hesitation and correction |
| Abandonment limit, proposed | 120 seconds from the scheduled start, plus bounded submission grace | A timeout for cleanup, not a target test duration |
| Leaderboard, confirmed | Best 10 verified submitted wins in the calendar month | Scores below 100 never qualify, even when fewer than ten entries exist |

Once public scores exist, changing passage rules, normalization, or scoring creates a new rule version. Each month's board is also separated by rule version; plan rule changes at a month boundary where possible. The same rules apply on desktop and mobile. Curate original or licensed passages of comparable vocabulary/difficulty and record passage ID, word count, and character count. Check normalized word count after preparing each passage. Character counts can still differ across 30-word passages, so use the same character-based WPM formula for every result.

## Scoring proposal

Use five characters as one standardized word:

`WPM = (normalized passage characters / 5) × (60 / elapsed seconds)`

Proposed completion rule: the entire normalized response must match the assigned passage. Count lowercase letters and the single spaces between words; exclude any trailing space, punctuation, and deleted/retyped characters from the score numerator. Normalize case, strip punctuation, and collapse whitespace consistently in the source and comparison layer. Error correction consumes time. Extra repeated spaces, punctuation, and corrections add no score. This stricter completion behavior is a proposal, not a newly confirmed user instruction.

Timing proposal: measure from the scheduled end of the countdown to the final accepted input that completes the passage, excluding the countdown and bounded network transport delay. The server validates elapsed-time claims against its own timestamps and checkpoint arrivals; it never trusts a submitted WPM. Client timing remains forgeable, so plausibility checks are deterrence rather than proof of human typing.

Example: a 150-character passage finished in 18 seconds gives 100 WPM and a win; the same passage in 20 seconds gives 90 WPM and a loss. The number of displayed words is not the WPM numerator because words differ in length. Never round a sub-100 score into a winning 100.

Accuracy is proposed as correct scored character insertions divided by all scored character insertions, including mistakes later corrected. Ignore case/punctuation differences consistently; normalized-away characters earn neither speed credit nor an accuracy penalty. Deletions do not reset letter-error history. Composition events need normalization so mobile input is not counted twice. The final corrected passage can be fully correct while historical typing accuracy is below 100%.

This is inspired by a typing-test convention, not a promise of identical Monkeytype scoring. Sebastian's benchmark should be retested using the new passage format. An incomplete passage cannot submit a partial score to the leaderboard; it becomes a loss on abandonment/timeout.

## Live 100 WPM ghost cursor

Show a distinct cursor advancing through the same passage at the 100 WPM benchmark. Use the game’s elapsed clock from the end of the countdown, the same five-character word unit as scoring, and the normalized passage including spaces. The proposed cursor position is the elapsed seconds multiplied by `100 × 5 / 60` characters per second, capped at the end of the passage. Derive it locally without extra requests.

Compare the player’s correctly entered prefix with the pace position and show “Ahead of pace,” “On pace,” or “Behind pace.” Keep the ghost and player cursors distinguishable without relying on color, including on wrapped lines and with reduced motion. The ghost never moves focus or scrolls the passage away from the active input. The server verifies the final outcome.

## Attempt outcomes and public statistics

- One server-accepted Start creates one counted attempt, even if the visitor then leaves during the countdown.
- A completed, valid test at or above the threshold is a win. A completed test below it is a loss. Confirmed fraud counts as a loss, including when it is found after a win was recorded.
- A started but unfinished test becomes a loss on explicit abandonment or server expiration. Closing the page cannot erase it.
- Rejected start requests, pre-start loading, and failed pre-start checks are not started attempts.
- During play, the attempt is pending rather than prematurely called a win or loss.
- Proposed display: lifetime total attempts; wins; losses; small “in progress” count; win and loss rates among settled attempts. These totals persist across leaderboard resets. The backend plan defines the formulas and timing.
- Sound settings, local photo interactions, and other reversible preferences can update optimistically. Global results and ranks wait for server confirmation.

The final user-facing rules must explain what “started” means and that a ranked timer continues if the tab loses focus. Brief focus loss alone is not proof of cheating; returning before the deadline should resume the same timed attempt.

## Leaderboard

Use a compact table: rank, two-letter initials, WPM. Accuracy may appear as a secondary detail if the layout supports it. Arcade styling can come from numerals, aligned rows, and accent highlights; avoid a large unrelated retro UI theme.

- Evaluate qualification only after a verified win of at least 100 WPM. A 99.9 WPM result cannot enter an empty board. A win still needs a top-10 position to prompt for initials.
- Only a currently qualifying result opens the initials step. Accept exactly two Latin letters, normalize to uppercase, validate on the server, and render as plain text.
- Provide a native two-character input on mobile; do not require a joystick-style letter selector.
- Recheck rank atomically when initials are submitted. If someone else displaced the score, explain briefly and keep the result; do not promise a reserved slot.
- Proposed tie order: exact WPM descending, accuracy descending, completion time ascending, then stable attempt ID.
- Duplicate initials are allowed. Initials are not identities. Proposed first version permits multiple scores from the same person because the brief asks for the top ten attempts; preventing this reliably would require stronger identity than a no-login game provides.
- Empty slots stay empty. Do not add fake scores or seed an unplayed “SN 100” entry; the 100 WPM benchmark is displayed separately.
- Claims use a short-lived, attempt-bound authorization and one successful claim per attempt. Retries must return the same result rather than create duplicate entries.

### Monthly reset

The current leaderboard resets every calendar month. Proposed boundary: midnight on the first in `America/New_York`; timezone remains open for confirmation. Show the current month next to the board. Use month-scoped records rather than deleting scores in place: the new month's board starts empty, while compact archived monthly results can remain available to the owner within the storage budget.

Proposed assignment: the server-validated completion time determines the month. A test spanning midnight belongs to the month it finishes. A delayed initials claim remains bound to that original month and cannot become a new-month score. Lifetime counters continue. See the backend plan for rollover, clock, and late-claim handling.

## Mobile input

Use a real, labeled input/textarea with a normal focus path. Open/focus it directly in the user's Start gesture, before awaiting network work, so mobile browsers can open their keyboard. Keep it focused while the countdown starts. Use `beforeinput`, `input`, and composition handling; desktop `keydown` alone will not cover software keyboards.

Request autocorrect, autocapitalization, spellcheck, and autocomplete off, while acknowledging these settings are not fully enforceable on every keyboard. Distinguish a known paste/drop operation from legitimate composition or replacement input. Do not reject every multi-character input event as cheating. A successful composition should score once and should not play a burst of one sound per inserted character.

Keep prompt lines, input, countdown, and timer visible as the viewport changes. Use readable input text, safe-area spacing, dynamic viewport sizing, and explicit re-focus controls. Avoid layout jumps when the keyboard opens. Test iOS Safari and Android Chrome with native keyboards, backspace, autocorrection behavior, composition, rotation, and a background/foreground cycle.

Paste, drag/drop insertion, and identifiable auto-fill of the ranked response are disallowed. Offer clear feedback rather than breaking focus. No browser-only method can prove which physical device produced text; the backend documents the limits of abuse detection.

## Keyboard audio

- Use Sebastian's recordings grouped into letters, spacebar, enter, and backspace, with several samples per group.
- Choose randomly within the appropriate group on each relevant press/input event, ideally avoiding an immediate repeat. Cap simultaneous voices and normalize levels so fast typing remains pleasant.
- Proposed default: muted, with a clear “Keyboard sounds” toggle and volume control. Remember the preference locally. Sebastian can choose an alternative default after a sound review.
- Load/decode samples on demand and create/resume the audio context after a user gesture. Audio failure never blocks input or scoring.
- Use low-latency buffered playback. No sound plays during the hero introduction or merely from visiting a page.
- Only capture input within the active game. Never listen to unrelated page text or admin credentials.
- Map mobile input operations to available samples without requiring physical key codes. Enter can accompany the actual game Start/retry or initials-submit action; it need not insert a newline into a single-line word test. Do not let Enter submit a running test early.

## Game states to design

Ready, preparing, counted countdown, running, verifying/retrying result, won, lost, initials entry, rank changed, rate limited, stale live data, and unavailable service. Before a counted start, an unavailable backend leaves an honest unavailable state; a separately labeled local practice mode can be considered later and would not affect global stats.

See [backend](../engineering/game-backend.md) for persistence and validation and [roadmap](../planning/roadmap.md) for acceptance tests.
