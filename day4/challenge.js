import fs from "fs/promises";

const input = await fs.readFile("./input.txt", "utf8");
const lines = input.split("\n");

function formatLines(arr) {
  const formattedLines = [];
  for (const line of arr) {
    const firstPart = line.split(":");
    const secondPart = firstPart[1].split("|");

    const game = firstPart[0].trim().split(" ");
    const winningNumbers = secondPart[0].trim().split(" ");
    const playedNumbers = secondPart[1]
      .trim()
      .split(" ")
      .filter((element) => element.length > 0);

    formattedLines.push({
      game: parseInt(game[game.length - 1]),
      winningNumbers,
      playedNumbers,
    });
  }
  return formattedLines;
}

function findPoints(arr) {
  const points = [];

  const formattedLines = formatLines(arr);

  for (const line of formattedLines) {
    const { game, winningNumbers, playedNumbers } = line;
    let point = 0;
    for (const number of playedNumbers) {
      if (winningNumbers.includes(number)) {
        if (point === 0) {
          point = 1;
        } else {
          point = point * 2;
        }
      }
    }
    points.push({ game, point });
  }

  let sum = 0;

  for (const point of points) {
    sum += point.point;
  }

  return sum;
}

console.log(findPoints(lines));
