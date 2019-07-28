module.exports = {
  /**
   * Problem 41: Pandigital prime
   * We shall say that an n-digit number is pandigital if it makes use of all the digits 1 to n exactly once.
   * For example, 2143 is a 4-digit pandigital and is also prime.
   * @question What is the largest n-digit pandigital prime that exists?
   */
  e41() {
    // n cannot be 9, as the digits sum up to 45, and therefore divisible by 3
    // by the same logic, n cannot be 8 either
    const digits = [7, 6, 5, 4, 3, 2, 1];

    // we don't need to check if the number is prime if the finalDigit is 2, 4, 5, or 6
    const validFinalDigits = [1, 3, 7];

    // we search from n = 7 to n = 4 (given in problem statement)
    for (let n = 7; n >= 4; n--) {
      const validDigits = digits.slice(7 - n);
      // here i represents the ith lexicographic permutation
      for (let i = 1; i <= utils.fact(n); i++) {
        const pandigitalArray = utils.getLexicographicPermutation(validDigits, i);
        const finalDigit = pandigitalArray[pandigitalArray.length - 1];
        if (validFinalDigits.includes(+(finalDigit))) {
          const pandigitalNumber = +(pandigitalArray.join(''));
          if (utils.isPrime(pandigitalNumber)) {
            return pandigitalNumber;
          }
        }
      }
    }
  },

  /**
   * Problem 42: Coded Triangle numbers
   * The nth term of the sequence of triangle numbers is given by, tn = ½n(n+1); so the first ten triangle numbers are:
   * 1, 3, 6, 10, 15, 21, 28, 36, 45, 55, ...
   * By converting each letter in a word to a number corresponding to its alphabetical position and adding these values
   * we form a word value. For example, the word value for SKY is 19 + 11 + 25 = 55 = t10. If the word value is a triangle
   * number then we shall call the word a triangle word.
   *
   * @question Using p042_words.txt, a 16K text file containing nearly two-thousand common English words,
   * how many are triangle words?
   */
  e42() {
    // we can assume that a word cannot exceed the word value of 500 (almost 20 consecutive 'z')
    // we generate a table of triangle numbers up to 500
    let triangleWords = 0;
    const triangleTable = utils.generateTriangleNumbersTable(500);
    const words = fs.readFileSync(path.join(__dirname, 'p042_words.txt')).toString().replace(/"/g, '').split(',');
    words.forEach((word) => {
      const wordValue = utils.sumArray(word.split(''), char => char.charCodeAt(0) - 64);
      if (triangleTable[wordValue]) {
        triangleWords++;
      }
    });
    return triangleWords;
  },

  /**
   * Problem 43 Sub-string divisibility
   * The number, 1406357289, is a 0 to 9 pandigital number because it is made up of each of the digits 0 to 9 in some order,
   * but it also has a rather interesting sub-string divisibility property.
   * Let d1 be the 1st digit, d2 be the 2nd digit, and so on. In this way, we note the following:
   * d2d3d4=406 is divisible by 2
   * d3d4d5=063 is divisible by 3
   * d4d5d6=635 is divisible by 5
   * d5d6d7=357 is divisible by 7
   * d6d7d8=572 is divisible by 11
   * d7d8d9=728 is divisible by 13
   * d8d9d10=289 is divisible by 17
   *
   * @question Find the sum of all 0 to 9 pandigital numbers with this property.
   */
  e43() {
    const subdivisibleNumbers = [];
    // we describe our recursion as the following:
    // 1. start by picking the last 3 digits s.t. it is divisible by 17, ie. 017, 034, ...
    // 2. we then pick d7 s.t. d7d8d9 is divisible by 13, if such d7 does not exist, we go to the next iteration
    // 3. if it does exist, we pick d6 s.t. d6d7d8 is divisible by 11, etc.
    const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    // 58 * 17 = 986, largest 3-digit number which is divisible by 17
    for (let i = 1; i <= 58; i++) {
      const last3 = (i * 17).toString().padStart(3, '0'); // 1 -> '017', 2 -> '034, etc
      if (!utils.containsDuplicate(last3)) {
        buildNumber(
          last3,
          digits.filter(x => !last3.includes(x)),
          [2, 3, 5, 7, 11, 13],
        );
      }
    }

    // recursively build a number digit by digit, ensuring divisibility at each step
    function buildNumber(acc, remainingDigits, remainingDividers) {
      if (!remainingDividers.length) {
        return subdivisibleNumbers.push(`${remainingDigits[0]}${acc}`);
      }
      const divider = remainingDividers.pop();
      for (let j = 0; j < remainingDigits.length; j++) {
        const leadingDigit = remainingDigits[j];
        const trailingDigits = +acc.slice(0, 2);
        const numToCheck = leadingDigit * 100 + trailingDigits;
        if (numToCheck % divider === 0) {
          buildNumber(
            `${leadingDigit}${acc}`,
            [...remainingDigits].filter(x => x !== leadingDigit),
            [...remainingDividers],
          );
        }
      }
    }
    return utils.sumArray(subdivisibleNumbers, x => +x);
  },

  /**
   * Problem 44 Pentagon numbers
   * Pentagonal numbers are generated by the formula, Pn=n(3n−1)/2. The first ten pentagonal numbers are:
   * 1, 5, 12, 22, 35, 51, 70, 92, 117, 145, ...
   * It can be seen that P4 + P7 = 22 + 70 = 92 = P8. However, their difference, 70 − 22 = 48, is not pentagonal.
   *
   * @question Find the pair of pentagonal numbers, Pj and Pk, for which their sum and difference are pentagonal
   * and D = |Pk − Pj| is minimised; what is the value of D?
   */
  e44() {
    // we loop through each pentagonal number Pk, and for each Pk loop through each Pj smaller than Pk
    // we check whether Pk - Pj AND Pk + Pj is pentagonal, if so return the difference
    let k = 2;
    while (true) {
      const Pk = utils.toPolygonal(k, 5);
      let j = k;
      while (j >= 1) {
        const Pj = utils.toPolygonal(j, 5);
        if (utils.isPentagonal(Pk - Pj) && utils.isPentagonal(Pk + Pj)) {
          return Pk - Pj;
        }
        j--;
      }
      k++;
    }
  },

  /**
   * Problem 45 Triangular, pentagonal, and hexagonal
   * Triangle, pentagonal, and hexagonal numbers are generated by the following formulae:
   * Triangle Tn=n(n+1)/2: 1, 3, 6, 10, 15, ...
   * Pentagonal Pn=n(3n−1)/2: 1, 5, 12, 22, 35, ...
   * Hexagonal Hn=n(2n−1): 1, 6, 15, 28, 45, ...
   * It can be verified that T285 = P165 = H143 = 40755.
   *
   * @question Find the next triangle number that is also pentagonal and hexagonal.
   */
  e45() {
    let h = 144;
    while (true) {
      const hexagonal = utils.toPolygonal(h, 6);
      if (utils.isPentagonal(hexagonal) && utils.isTriangular(hexagonal)) {
        return hexagonal;
      }
      h++;
    }
  },

  /**
   * Problem 46 Goldbach's other conjecture
   * It was proposed by Christian Goldbach that every odd composite number can be written as the sum of a prime and twice a square.
   * 9 = 7 + 2×1^2
   * 15 = 7 + 2×2^2
   * 21 = 3 + 2×3^2
   * 25 = 7 + 2×3^2
   * 27 = 19 + 2×2^2
   * 33 = 31 + 2×1^2
   * It turns out that the conjecture was false.
   *
   * @question What is the smallest odd composite that cannot be written as the sum of a prime and twice a square?
   */
  e46() {
    // check each odd number for primality; if it is composite, check for conjecture validity
    let num = 9;
    while (true) {
      if (!utils.isPrime(num)) {
        if (!conjValid(num)) {
          return num;
        }
      }
      num += 2;
    }

    // determines whether a number is valid for Goldbach's conjecture
    function conjValid(n) {
      const rootUB = Math.sqrt((n - 2) / 2);
      for (let i = 1; i <= rootUB; i++) {
        const twiceSquare = (i ** 2) * 2;
        if (utils.isPrime(n - twiceSquare)) {
          return true;
        }
      }
      return false;
    }
  },

  /**
   * Problem 47 Distinct primes factors
   * The first two consecutive numbers to have two distinct prime factors are:
   * 14 = 2 × 7
   * 15 = 3 × 5
   *
   * The first three consecutive numbers to have three distinct prime factors are:
   * 644 = 2² × 7 × 23
   * 645 = 3 × 5 × 43
   * 646 = 2 × 17 × 19.
   *
   * @question Find the first four consecutive integers to have four distinct prime factors each. What is the first of these numbers?
   */
  e47() {
    const first1000Primes = Object.keys(utils.generatePrimeTable(1000));
    let first = 2 * 3 * 5 * 7;
    while (first < 1000000) {
      const second = first + 1;
      const third = first + 2;
      const fourth = first + 3;
      if (isDPFValid(first)) {
        if (isDPFValid(second)) {
          if (isDPFValid(third)) {
            if (isDPFValid(fourth)) {
              return first;
            } // if the fourth number is not valid, skip over the next four numbers
            first += 4;
          } else { // if the third number is not valid, skip over the next 3 numbers, etc.
            first += 3;
          }
        } else {
          first += 2;
        }
      } else {
        first++;
      }
    }

    // we implement a tailored function which returns true iff n has exactly 4 distinct prime factors
    function isDPFValid(n) {
      let quotient = n;
      let DPFCount = 0;
      for (let primeIndex = 0; primeIndex < first1000Primes.length; primeIndex++) {
        const primeFactor = first1000Primes[primeIndex];
        if (primeFactor > quotient) {
          return DPFCount === 4;
        }
        if (quotient % primeFactor === 0) {
          DPFCount++;
        }
        while (quotient % primeFactor === 0) {
          if (DPFCount > 4) {
            return false;
          }
          quotient /= primeFactor;
        }
      }
    }
  },
};
