// superscripts ¹ ² ³ ⁴ ⁵ ⁶ ⁷ ⁸ ⁹ ⁰
// subscripts ₀ ₁ ₂ ₃ ₄ ₅ ₆ ₇ ₈ ₉

// check if input contains any duplicate
// if the input is a string, check for duplicate characters
// if the input is a number, check for duplicate digits
// if the input is an array, check for duplicate elements
function containsDuplicate(input) {
  if (Array.isArray(input)) {
    return (new Set(input)).size !== input.length;
  }
  if (typeof input === 'string') {
    return containsDuplicate(input.split(''));
  }
  if (typeof input === 'number') {
    return containsDuplicate(input.toString().split(''));
  }
}

module.exports = {
  containsDuplicate,
};
