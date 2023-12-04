import fs from "fs/promises";

const input = await fs.readFile("./input.txt", "utf8");
const lines = input.split("\n");

function formatLines(arr) {
  const formattedLines = [];
  for (const line of arr) {
    const firstPart = line.split(":");
    const secondPart = firstPart[1].split("|");

    const card = firstPart[0].trim().split(" ");
    const winningNumbers = secondPart[0].trim().split(" ");
    const playedNumbers = secondPart[1]
      .trim()
      .split(" ")
      .filter((element) => element.length > 0);

    formattedLines.push({
      card: parseInt(card[card.length - 1]),
      winningNumbers,
      playedNumbers,
      numberOfCards: 1,
    });
  }
  return formattedLines;
}

function findHowManyScratchCards(arr) {
  const formattedLines = formatLines(arr);
  let scratchCards = formattedLines;

  for (let line of scratchCards) {
    const { card, winningNumbers, playedNumbers, numberOfCards } = line;

    for (let i = 0; i < numberOfCards; i++) {
      let score = 0;
      for (const number of winningNumbers) {
        if (playedNumbers.includes(number)) {
          score++;
        }
      }

      for (let i = 0; i < score; i++) {
        scratchCards[card + i].numberOfCards++;
      }
    }
  }

  const numberOfScratchCards = scratchCards.reduce(
    (acc, current) => acc + current.numberOfCards,
    0
  );

  return numberOfScratchCards;
}

console.log(findHowManyScratchCards(lines));
