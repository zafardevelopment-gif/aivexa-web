export const LETTER_VALUES: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
};

export const MASTER_NUMBERS = new Set([11, 22, 33]);

export const NUMBER_MEANINGS: Record<number, string> = {
  1: "A natural-born leader — independent, ambitious and driven to originate rather than follow.",
  2: "A diplomat at heart — cooperative, intuitive and happiest working in partnership with others.",
  3: "Creative and expressive — drawn to art, communication and bringing joy into a room.",
  4: "Grounded and disciplined — values hard work, structure and building something that lasts.",
  5: "Freedom-loving and adaptable — craves change, travel and new experiences.",
  6: "Nurturing and responsible — a natural caretaker who values home, family and harmony.",
  7: "Thoughtful and analytical — drawn to introspection, spirituality and deeper truths.",
  8: "Ambitious and business-minded — associated with material success, authority and drive.",
  9: "Compassionate and idealistic — a humanitarian energy focused on giving and closure.",
  11: "A Master Number of intuition and inspiration — sensitive, visionary and spiritually attuned.",
  22: "A Master Number known as the 'Master Builder' — combines big dreams with practical execution.",
  33: "A Master Number of selfless guidance — associated with compassion, teaching and healing others.",
};

export function reduceNumber(input: number): number {
  let n = input;
  while (n > 9 && !MASTER_NUMBERS.has(n)) {
    n = String(n)
      .split("")
      .reduce((sum, d) => sum + Number(d), 0);
  }
  return n;
}
