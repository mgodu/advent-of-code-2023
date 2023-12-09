import fs from "fs/promises";

const input = await fs.readFile("./input.txt", "utf8");
const lines = input.split("\n");

function formatInputToObject(arr) {
  const formattedLines = {};

  const filteredInput = arr.filter((element) => element.length > 0);

  const maps = [
    "seed-to-soil map:",
    "soil-to-fertilizer map:",
    "fertilizer-to-water map:",
    "water-to-light map:",
    "light-to-temperature map:",
    "temperature-to-humidity map:",
    "humidity-to-location map:",
  ];

  const names = [
    "seedToSoil",
    "soilToFertilizer",
    "fertilizerToWater",
    "waterToLight",
    "lightToTemperature",
    "temperatureToHumidity",
    "humidityToLocation",
  ];

  const firstPart = arr[0].split(":");
  formattedLines[firstPart[0]] = firstPart[1]
    .split(" ")
    .filter((element) => element.length > 0)
    .map((element) => parseInt(element));

  for (let i = 0; i < maps.length; i++) {
    const map = maps[i];
    const mapName = names[i];
    const firstIndex = filteredInput.indexOf(map);
    const lastIndex =
      i === maps.length - 1
        ? filteredInput.length
        : filteredInput.indexOf(maps[i + 1]);
    const mapArray = [];

    for (let j = firstIndex + 1; j < lastIndex; j++) {
      mapArray.push(
        filteredInput[j].split(" ").map((element) => parseInt(element))
      );
    }

    formattedLines[mapName] = mapArray;
  }

  return formattedLines;
}

function findRange(arr) {
  const seedInput = formatInputToObject(arr);

  const seedsLocation = [];

  const names = [
    "seedToSoil",
    "soilToFertilizer",
    "fertilizerToWater",
    "waterToLight",
    "lightToTemperature",
    "temperatureToHumidity",
    "humidityToLocation",
  ];

  const seeds = [];

  for (let i = 0; i < seedInput.seeds.length; i = i + 2) {
    const seed = seedInput.seeds[i];
    seeds.push({ seed, range: seedInput.seeds[i + 1] });
  }

  //   console.log(seeds);

  for (let i = 0; i < seeds.length; i++) {
    // console.log(i);
    for (let j = seeds[i].seed; j < seeds[i].seed + seeds[i].range; j++) {
      //   console.log(j);
      const seed = j;
      const seedLocation = {};
      seedLocation.seed = seed;

      let seedMap = seed;
      for (let i = 0; i < 7; i++) {
        const map = seedInput[names[i]];
        const mapName = names[i];
        for (let j = 0; j < map.length; j++) {
          const mapElement = map[j];
          if (
            mapElement[1] <= seedMap &&
            seedMap <=
              (mapElement[1] > 0
                ? mapElement[1] + mapElement[2] - 1
                : mapElement[1] + mapElement[2])
          ) {
            const mapMap = seedMap - mapElement[1] + mapElement[0];
            seedLocation[mapName] = mapMap;
          }
        }

        if (!seedLocation[mapName]) {
          seedLocation[mapName] = seedMap;
        }
        seedMap = seedLocation[mapName];
      }
      seedsLocation.push(seedLocation);
    }
  }

  seedsLocation.sort((a, b) => a.humidityToLocation - b.humidityToLocation);
  //   console.log(seedsLocation.length);
  return seedsLocation[0].humidityToLocation;
}

console.log(findRange(lines));
