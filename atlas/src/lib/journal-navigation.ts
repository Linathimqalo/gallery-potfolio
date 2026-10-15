export const journalPages = ['Cover', 'About', 'Skills', 'Experience', 'Projects', 'Contact'];

export function pageCounter(index: number) {
  return index === 0 ? 'COVER' : `0${index} / 05`;
}

export function adjacentPage(index: number, direction: number) {
  return Math.max(0, Math.min(journalPages.length - 1, index + direction));
}