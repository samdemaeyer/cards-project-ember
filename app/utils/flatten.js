export default function flatten(ary) {
  return ary.reduce((a, b) => [].concat(a, Array.isArray(b) ? flatten(b) : b));
}
