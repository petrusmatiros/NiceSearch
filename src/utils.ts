export function capitalizeFirstLetter(s: string) {
  if (typeof s !== 'string') return '';
  if (s.length === 0) return '';
  if (s.length === 1) return s.toUpperCase();
  if (s.length > 1) return s[0].toUpperCase() + s.slice(1);
}