import fs from "fs/promises";

const input = await fs.readFile("./input.txt", "utf8");
const lines = input.split("\n");

console.time("calculateRaceScore");

function formatInputToObject(arr) {
  const formattedLines = [];

  for (const line of lines) {
    const [key, ...values] = line.split(" ");
    const formattedValues = values.filter((value) => value.length > 0);
    const formattedKey = key.slice(0, key.length - 1).toLowerCase();
    formattedLines.push({ [formattedKey]: formattedValues });
  }

  return formattedLines;
}

// console.log(formatInputToObject(lines));
function calculateRaceScore(arr) {
  const formattedLines = formatInputToObject(arr);

  const raceScores = [];

  for (let i = 0; i < formattedLines[0].time.length; i++) {
    const time = formattedLines[0].time[i];
    const distance = formattedLines[1].distance[i];
    const maxDistances = [];

    let counter = 0;
    for (let j = 1; j < time; j++) {
      const remainingTime = time - j;
      const maxDistance = remainingTime * j;

      if (maxDistance > distance) {
        counter++;
      }
    }
    raceScores.push(counter);
  }
  const score = raceScores.reduce((a, b) => a * b);

  return score;
}

console.log(calculateRaceScore(lines));
console.timeEnd("calculateRaceScore");
