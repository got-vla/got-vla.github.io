# GoT-VLA · Guidance under Shift

Project website for **Guidance under Shift: Deployment-Aligned Semantic Interfaces for Vision–Language–Action Policies**.

**Website:** https://simaqie.github.io/got-vla/

The manuscript currently lists Anonymous Authors. This repository contains the static project page, figures, compiled paper with appendix, and real-robot demonstration videos. It does not contain the training implementation.

## Local preview

Run `python -m http.server 8765` from this directory, then open http://localhost:8765/.

No build step, external JavaScript libraries, or remotely hosted fonts are required. GitHub Pages serves the root of the `main` branch.

## Content sources

- Authoritative source: `GoT_VLA/iclr2027_conference.tex` and `iclr2027_supplementary.tex` in the local research project.
- Paper figures: `method_figure.pdf` and `figs_realrobot/`.
- Videos: the seven recordings in `supplementary_materials/videos/`.

Where supplementary README numbers or descriptions differ from the current manuscript, aggregate results follow the manuscript. Individual video outcomes are distinguished from aggregate scores.

## Video processing

`s1.mp4` through `s7.mp4` preserve the entire recorded timeline, crop the top 640 × 400 head-camera region, and are encoded at 2× source playback speed in H.264 MP4 with fast-start metadata. No action interval is omitted. The viewer can play at 1× or 2× and switch to the original guidance view. Category has no guidance overlay.

`s1-full.mp4` through `s7-full.mp4` are byte-identical copies of the provided recordings. See [the processing manifest](assets/videos/manifest.json) for filenames, durations, and transformations.

The Moved recording retains its failed paper subtask. All seven individual recorded outcomes are labeled separately from the paper's five-trial mean scores.

## Result definitions

- LIBERO and RoboTwin: closed-loop task success rate.
- Real robot: mean applicable subtask score over five trials per condition, with partial credit for paper in Multi. This is not whole-task success rate.
- Guidance-shift tests: action error on fixed RoboTwin training states; compare recipes within the same test.

## Design references

The information hierarchy was informed by [CoT-VLA](https://cot-vla.github.io/) and [Embodied CoT](https://embodied-cot.github.io/). The page's HTML, CSS, and interactions were authored for this project; no template code was copied.

## Release status

The paper states that training code and CoT-annotated data will be released. The page does not imply that the local reference implementation is already public. The anonymous BibTeX entry should be updated when public author and paper metadata become available.
