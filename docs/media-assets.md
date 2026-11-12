# Selected showcase assets

Only the assets requested for the experimental showcase are included. Original
files and the private source resume stay outside the repository.

| Asset                                          | Source                                                                                        | Preparation                                                                                                                                             |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `public/media/permanence-winners.webp`         | Sebastian's supplied `permanence_win.jpg`                                                     | Preserve the complete 16:9 collage, export WebP at quality 82, strip metadata. About 125 KB.                                                            |
| `public/media/awards/hackusf-transparent.webp` | Sebastian's supplied `hackusf_logo.png`                                                       | Transparent cutout made with built-in imagegen; resize to 160px WebP. About 12 KB.                                                                      |
| `public/media/awards/knight-hacks-ix.svg`      | Sebastian's supplied `khix-sigil.svg`                                                         | Preserve the supplied SVG artwork.                                                                                                                      |
| `public/media/awards/bloomknights.svg`         | Sebastian's supplied `BloomKnightsSigil.svg`                                                  | Preserve the supplied SVG artwork.                                                                                                                      |
| `public/media/awards/nvidia.svg`               | [NVIDIA brand assets](https://www.nvidia.com/en-us/about-nvidia/legal-info/logo-brand-usage/) | Official vertical eyemark and NVIDIA wordmark. Crop empty artboard space to a padded square viewBox without changing the paths, proportions, or colors. |
| `public/media/awards/hugging-face.svg`         | [Hugging Face brand assets](https://huggingface.co/brand)                                     | Official full-color icon without the wordmark.                                                                                                          |

Company SVGs were retrieved on November 12, 2026. Local SVGs contain no scripts,
embedded foreign content, or external image references. Render them as images and
keep their original colors. The logos identify the specific hackathon and sponsor
prizes, alongside the verified placement and submission count.

The photo remains a temporary poster for the planned Permanence demo loop. Its
grayscale-to-color hover treatment follows the other project media. Badge logos
remain in color. See [content and media](content.md) for replacement instructions.

## HackUSF transparent cutout

Built-in imagegen removed the supplied raster's purple background. The selected
workspace asset is `public/media/awards/hackusf-transparent.webp`; the original
source remains untouched. SVG logos use their transparent backgrounds directly,
without white CSS tiles.

Prompt: "Use case: background-extraction. Edit target: the supplied HackUSF gold
laurel and code-bracket logo. Remove only the entire purple fabric background,
including all gaps inside the laurel and around the central bracket emblem.
Output actual transparent alpha background. Preserve the original gold laurel leaf
shapes, code-bracket shapes, gold texture, original proportions and arrangement
exactly. Do not redesign, add lettering, add shadows, add a border, or add any
elements. Square composition with modest transparent padding. This is a small
website award logo."
