import fs from "fs/promises";

const input = await fs.readFile("./input.txt", "utf8");
const lines = input.split("\n");
lines.forEach((line, i) => {
  lines[i] = line.replace(/[.]/g, " ");
});

function findSymbols(arr) {
  const symbolsPattern = /[^0-9\s.]/g;

  const symbolIndexes = [];
  for (const [i, line] of arr.entries()) {
    const lineIndex = [];
    const symbols = line.match(symbolsPattern);

    if (!symbols) {
      symbolIndexes.push([]);
      continue;
    }

    let index = 0;
    for (const symbol of symbols) {
      index = line.indexOf(symbol, index);
      lineIndex.push(index);
      index++;
    }
    symbolIndexes.push(lineIndex);
  }

  return symbolIndexes;
}

function findPreviousAndNextAdjacentNumbers(rowIndex, line, colIndex) {
  const found = [];

  const relativePosition = [-1, 0, 1];

  const positionFound = [];

  for (let i = 0; i < relativePosition.length; i++) {
    const absolutePosition = relativePosition[i] + colIndex;
    if (/\d/.test(line[absolutePosition])) {
      positionFound.push(absolutePosition);
    }
  }

  const firstIndexes = [];
  for (let j = 0; j < positionFound.length; j++) {
    const currentCol = positionFound[j];
    for (let k = currentCol; k >= -1; k--) {
      const currentChar = line[k];
      const isCurrentCharANumber = /\d/.test(currentChar);
      if (!isCurrentCharANumber) {
        firstIndexes.push(k + 1);
        break;
      }
    }
  }

  const uniqueIndexes = firstIndexes.filter(
    (element, index) => firstIndexes.indexOf(element) === index
  );

  uniqueIndexes.forEach((uniqueIndex) => {
    let numberToBe = "";
    for (let l = uniqueIndex; l < line.length; l++) {
      if (/\d/.test(line[l])) {
        numberToBe += line[l];
      } else {
        break;
      }
    }
    found.push({
      line: rowIndex,
      firstNumberIndex: uniqueIndex,
      number: Number(numberToBe),
    });
  });

  return found;
}

function removeDuplicates(arr) {
  const seen = new Map();

  return arr.filter((item) => {
    const key = `${item.line}-${item.firstNumberIndex}`;
    if (seen.has(key)) {
      return false;
    } else {
      seen.set(key, true);
      return true;
    }
  });
}

function findNumberAdjacentToSymbol(arr) {
  let sum = 0;

  const symbolIndexes = findSymbols(arr);

  let numbersMatch = [];
  for (let i = 0; i < arr.length; i++) {
    const line = arr[i];
    const symbols = symbolIndexes[i];

    if (symbols.length === 0) {
      continue;
    }

    for (let j = 0; j < symbols.length; j++) {
      const symbolIndex = symbols[j];
      const symbol = line[symbolIndex];
      const left = line[symbolIndex - 1];
      const right = line[symbolIndex + 1];
      const top = arr[i - 1] ? arr[i - 1][symbolIndex] : undefined;
      const bottom = arr[i + 1] ? arr[i + 1][symbolIndex] : undefined;
      const topLeft = arr[i - 1] ? arr[i - 1][symbolIndex - 1] : undefined;
      const topRight = arr[i - 1] ? arr[i - 1][symbolIndex + 1] : undefined;
      const bottomLeft = arr[i + 1] ? arr[i + 1][symbolIndex - 1] : undefined;
      const bottomRight = arr[i + 1] ? arr[i + 1][symbolIndex + 1] : undefined;

      const adjacentNumbers = {
        symbol,
        left,
        right,
        top,
        bottom,
        topLeft,
        topRight,
        bottomLeft,
        bottomRight,
      };

      if (Object.values(adjacentNumbers).some((value) => /[^\s]/.test(value))) {
        if (/[0-9]/.test(left)) {
          const previousNumber = findPreviousAndNextAdjacentNumbers(
            i, // row index
            line, // row string
            symbolIndex // col index
          );
          numbersMatch = numbersMatch.concat(previousNumber);
        }

        if (/[0-9]/.test(right)) {
          const nextNumber = findPreviousAndNextAdjacentNumbers(
            i,
            line,
            symbolIndex
          );
          numbersMatch = numbersMatch.concat(nextNumber);
        }

        if (/[0-9]/.test(top)) {
          const number = findPreviousAndNextAdjacentNumbers(
            i - 1,
            arr[i - 1],
            symbolIndex
          );
          numbersMatch = numbersMatch.concat(number);
        }

        if (/[0-9]/.test(topLeft)) {
          const number = findPreviousAndNextAdjacentNumbers(
            i - 1,
            arr[i - 1],
            symbolIndex
          );
          numbersMatch = numbersMatch.concat(number);
        }

        if (/[0-9]/.test(topRight)) {
          const number = findPreviousAndNextAdjacentNumbers(
            i - 1,
            arr[i - 1],
            symbolIndex
          );
          numbersMatch = numbersMatch.concat(number);
        }
        if (/[0-9]/.test(bottom)) {
          const number = findPreviousAndNextAdjacentNumbers(
            i + 1,
            arr[i + 1],
            symbolIndex
          );
          numbersMatch = numbersMatch.concat(number);
        }

        if (/[0-9]/.test(bottomLeft)) {
          const number = findPreviousAndNextAdjacentNumbers(
            i + 1,
            arr[i + 1],
            symbolIndex
          );
          numbersMatch = numbersMatch.concat(number);
        }

        if (/[0-9]/.test(bottomRight)) {
          const number = findPreviousAndNextAdjacentNumbers(
            i + 1,
            arr[i + 1],
            symbolIndex
          );
          numbersMatch = numbersMatch.concat(number);
        }
      }
    }
  }

  const uniqueNumbersMatch = removeDuplicates(numbersMatch);
  uniqueNumbersMatch.sort((a, b) => a.line - b.line);

  for (const { number } of uniqueNumbersMatch) {
    sum += number;
  }

  return sum;
}

console.log(findNumberAdjacentToSymbol(lines));
