'use strict';

const videos = [...document.querySelectorAll('video')];
const hero = document.getElementById('hero-video');
let heroPausedByUser = false;

for (const video of videos) {
  video.addEventListener('play', () => {
    for (const other of videos) {
      if (other !== video) other.pause();
    }
  });
}

hero.addEventListener('pause', () => {
  if (!document.hidden && hero.getBoundingClientRect().top >= 0) {
    heroPausedByUser = true;
  }
});

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  new IntersectionObserver(entries => {
    const visible = entries[0].isIntersecting;
    if (visible && !heroPausedByUser && !document.hidden) {
      hero.play().catch(() => {});
    } else {
      hero.pause();
    }
  }, { threshold: 0.35 }).observe(hero);
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) videos.forEach(video => video.pause());
});

document.getElementById('copy-citation').addEventListener('click', async () => {
  const text = document.getElementById('bibtex').textContent;
  const status = document.getElementById('copy-status');
  try {
    await navigator.clipboard.writeText(text);
    status.textContent = 'BibTeX copied.';
  } catch {
    const range = document.createRange();
    range.selectNodeContents(document.getElementById('bibtex'));
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    status.textContent = 'BibTeX selected. Use your browser’s copy command.';
  }
});
