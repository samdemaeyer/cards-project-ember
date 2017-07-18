export default function isEven(nr) {
  nr = Number(nr);
  return nr === 0 || !!(nr && !(nr%2));
}
