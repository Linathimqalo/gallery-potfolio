import { describe, expect, it } from 'vitest';
import { adjacentPage, journalPages, pageCounter } from '@/lib/journal-navigation';

describe('ATLAS page navigation', () => {
  it('contains the cover and five sections in reading order', () => {
    expect(journalPages).toEqual(['Cover', 'About', 'Skills', 'Experience', 'Projects', 'Contact']);
  });
  it('numbers the cover separately from the five sections', () => {
    expect([0, 1, 2, 3, 4, 5].map(pageCounter)).toEqual(['COVER', '01 / 05', '02 / 05', '03 / 05', '04 / 05', '05 / 05']);
  });
  it('keeps arrow navigation inside the six-page volume', () => {
    expect(adjacentPage(0, -1)).toBe(0);
    expect(adjacentPage(5, 1)).toBe(5);
    expect(adjacentPage(2, 1)).toBe(3);
    expect(adjacentPage(2, -1)).toBe(1);
  });
});