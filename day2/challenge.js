import fs from "fs/promises";

const input = await fs.readFile("./input.txt", "utf8");
const lines = input.split("\n");

function convertToObject(line) {
  const [id, example] = line.split(": ");

  const games = example.split(";");

  const uniqueGames = [];
  for (let i = 0; i < games.length; i++) {
    const game = games[i].split(",").map((element) => {
      element = element.trim();
      const [number, color] = element.split(" ");
      const newGame = {};
      newGame[color] = number;
      return newGame;
    });

    uniqueGames.push(...game);
  }
  return {
    gameIds: id.split(" ")[1],
    games: uniqueGames,
  };
}

const inputArray = lines.map(convertToObject);
const bag = { red: 12, green: 13, blue: 14 };

function checkBag(bag, game) {
  const keys = Object.keys(bag);
  const possibleGames = [];
  for (let i = 0; i < game.length; i++) {
    const element = game[i];
    let isGood = true;
    for (let j = 0; j < element.games.length; j++) {
      const game = element.games[j];
      const key = Object.keys(game)[0];
      if (!(bag[key] >= parseInt(game[key]))) {
        console.log("not good");
        isGood = false;
      }
    }
    if (isGood) {
      possibleGames.push(element);
    }
  }
  const sum = possibleGames.reduce((acc, curr) => {
    return acc + parseInt(curr.gameIds);
  }, 0);

  return sum;
}

function checkMinimumCubes(game) {
  const color = ["red", "green", "blue"];

  let sum = 0;
  for (const element of game) {
    let red = 0;
    let green = 0;
    let blue = 0;
    console.log(red, green, blue);
    for (let i = 0; i < element.games.length; i++) {
      const game = element.games[i];
      const key = Object.keys(game)[0];
      const colorNumber = parseInt(game[key]);
      if (key === "red" && colorNumber > red) {
        red = colorNumber;
      } else if (key === "green" && colorNumber > green) {
        green = colorNumber;
      } else if (key === "blue" && colorNumber > blue) {
        blue = colorNumber;
      }
    }
    const multiplied = red * green * blue;
    sum += multiplied;
  }

  return sum;
}

console.log(checkBag(bag, inputArray));
console.log(checkMinimumCubes(inputArray));
