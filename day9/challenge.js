import fs from "fs/promises";

const input = await fs.readFile("./input.txt", "utf8");
const lines = input.split("\n");

function formatInput(arr) {
  const formattedLines = [];

  for (const line of lines) {
    formattedLines.push([line.split(" ").map((element) => parseInt(element))]);
  }

  return formattedLines;
}

function findLineDifference(arr) {
  const newLine = [];

  for (let i = 0; i < arr.length - 1; i++) {
    const baselineElement = arr[i];
    const nextBaselineElement = arr[i + 1];

    newLine.push(nextBaselineElement - baselineElement);
  }

  return newLine;
}

function findHistoriesSum(arr) {
  const formattedLines = formatInput(arr);
  const histories = [];

  for (let i = 0; i < formattedLines.length; i++) {
    const history = formattedLines[i];
    let counter = 0;

    do {
      const nextLine = findLineDifference(history[counter]);
      history.push([...nextLine]);
      counter++;
    } while (!history[counter].every((num) => num === 0));

    for (let j = history.length - 2; j >= 0; j--) {
      const element = history[j];
      const previousElement = history[j + 1];

      element.push(
        element[element.length - 1] +
          previousElement[previousElement.length - 1]
      );

      if (j === 0) {
        histories.push(element[element.length - 1]);
      }
    }
  }

  const total = histories.reduce((a, b) => a + b);

  return total;
}

console.log(findHistoriesSum(lines));
