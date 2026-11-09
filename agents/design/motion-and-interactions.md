# Motion and interactions

Status: the interaction ideas are confirmed; timings, technical approach, and touch alternatives below are proposed.

## Intro and tile impulse

1. Render the real name in the initial HTML. Reserve the final name's dimensions so typing does not shift the layout.
2. On the first home visit in a browser session, progressively reveal a visual copy of “Sebastian Noel” over roughly 1–1.5 seconds. Keep one complete accessible heading; hide the animated duplicate from assistive technology.
3. When the final character appears, launch a radial impulse from the name's center through the background tiles. Approximate propagation delay from each tile's distance to that origin; give each tile one controlled 3D flip.
4. Tiles flip over 1.1 seconds, with each flip starting later as the wave moves outward at 1.35 CSS pixels per millisecond. The total duration varies with the viewport. Base tiles settle back into a sparse, quiet pattern. Selected photo patches persist after the impulse.
5. Allow the visitor to scroll, click, and navigate immediately. Navigating away cancels the animation. Returning home in the same session shows the settled composition rather than replaying an obligatory intro.

An optional “Replay intro” action can live in a later command menu. It is not needed in primary navigation.

### Tile implementation direction

- Begin with a bounded CSS grid and transform animation, orchestrated by Motion or the Web Animations API. This is a proposed starting point for implementation.
- Use solid faces, no outlines, and enough variation to suggest a grid without turning it into graph paper.
- The wave belongs to the decorative background. Do not rotate text, buttons, navigation, or complete content cards with it.
- Keep the dark areas supplying text contrast stable during the flip. No flashing sequence or rapidly alternating full-screen colors.
- Model one page-level wave, but animate only visible/nearby tiles. Do not mount thousands of tiles across the full document. Below-fold sections can use settled photo patches and restrained first-entry reveals.
- Cap active tiles, enlarge them on narrow screens, avoid per-tile React state updates per frame, and profile before adding Canvas or WebGL.
- Decorative layers use no pointer interception and are hidden from assistive technology. Stop idle motion when offscreen or when the tab is hidden.
- Reduced motion shows the complete name immediately and the grid in its settled state, with an optional brief opacity change instead of a traveling flip.
- A hydration or animation failure leaves the normal name and page visible.

## Persistent photo patches

Place a few deliberately shaped clusters within the same tile system. Their images remain after the intro. Review a tiled photograph or small collage in the implementation and choose a consistent treatment once the real images are available.

On fine-pointer hover, transition from grayscale to full color in approximately 200–300 ms. A keyboard-focusable reveal control provides the same effect where the patch is interactive. On touch, use an explicit reveal toggle; avoid a sticky simulated hover state. If the image is also a navigation link, use the touch behavior described in the site structure plan.

Use one image resource with a visual grayscale filter where possible. Preserve coherent image cropping across tiles. A mosaic that visually repeats one photo needs a single meaningful accessible description, not the same description announced for every tile.

## Awarded project cards

| Situation | Behavior |
| --- | --- |
| Rest | Show the primary project image and plain-text project/award information |
| Fine-pointer hover | Crossfade to the real team-on-stage winning photo, if both award and photo are present |
| Keyboard focus within card | Reveal the team photo using the same transition |
| Pointer/focus leaves | Return smoothly to the primary image; interruption reverses the current animation |
| Touch | Card link opens the detail immediately; a separate, labeled photo toggle offers the winning photo |
| No award or no winning photo | Keep the project image; do not fabricate an alternate |
| Reduced motion | Swap instantly or use a brief fade |

Reserve one image aspect ratio for both states, record independent crops, and avoid layout shift. Load alternate media when the card nears the viewport rather than downloading every winning photo on initial page load. Awards and team photos also appear in the case study so the information survives all interaction modes.

## Other motion

| Interaction | Proposed treatment |
| --- | --- |
| Link/button hover | Underline, color, or small positional response, usually 120–180 ms |
| Button press | Small reversible compression; immediate visual acknowledgement |
| Card entry | Short opacity/translation reveal; content is never held invisible waiting for a scroll trigger |
| Page change | Subtle exit/entry or supported view transition; keep URL, history, focus, and scroll correct |
| Mobile menu | Short slide/fade; opening and closing can interrupt each other |
| Idle grid | Occasional low-amplitude movement in a few cells, not constant movement everywhere |
| Game win | Brief local tile/confetti burst, no blocking overlay; reduced motion uses a static success treatment |
| Live counters | Stable tabular numbers; do not animate every digit change during an active test |

Use one motion vocabulary. Ordinary CSS handles simple hover/focus states; Motion handles coordinated React transitions. Avoid adding GSAP or a second animation library without a demonstrated need. Native view transitions are progressive enhancement, not a dependency for navigation.

Freeze ambient motion around the active typing test so performance and visual attention go to the game. Never seize global letter keys or hijack scrolling to support an effect.

## Acceptance criteria

- Name remains available without JavaScript and is announced once by a screen reader.
- Fast navigation during the intro produces no stuck overlay or orphaned animation.
- Hover/focus effects reverse smoothly; repeated interactions do not queue long animations.
- Every meaningful hover effect has a keyboard/touch path.
- Reduced-motion settings remove the wave, large transforms, and ongoing ambient motion.
- Mobile scrolling and typing remain smooth on a representative midrange phone.

## Current foundation scope

The name intro and radial impulse are part of the foundation, not deferred polish. The background uses a bounded visible viewport field, only three idle flips at a time, a pause/play control, hidden-tab cancellation, and reduced-motion support. Reserve the game area without fake controls. Flat letter placeholders do not inherit the tile-photo treatment; real photos and their reveals come later.
