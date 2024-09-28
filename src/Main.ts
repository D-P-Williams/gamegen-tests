import GameGen, { Session } from "./GameGen";
import GameSelector from "./GameSelector";
import PlayTime from "./PlayTime";

const players = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"];

const courts: number = 2;

export default function Main() {
  // Randomly from all possible games
  randomGames(10);
  randomGames(100);
  randomGames(1000);

  // Playtime based
  PlayTimeBasedGames(10);
  PlayTimeBasedGames(100);
  PlayTimeBasedGames(1000);

  // For benchmarking a particular method
  // for (let i = 0; i < 5; i++) {
  //   PlayTimeBasedGames(1000);
  // }
}

function randomGames(qty: number) {
  const gameGen = new GameGen(players, courts);

  const possibleSessions = gameGen.GetGames();

  shuffleArray(possibleSessions);

  const firstX = possibleSessions.slice(0, qty);

  const sessionKeys = firstX.map(
    (x) => `${x.concurrentGames[0].key}  -  ${x.concurrentGames[1].key}`
  );

  const count: {
    [player: string]: number;
  } = {};

  sessionKeys.forEach((key) => {
    players.forEach((player) => {
      if (key.includes(player)) {
        if (!count[player]) {
          count[player] = 1;
        } else {
          count[player] += 1;
        }
      }
    });
  });

  console.log("\n\nRandom " + qty);
  console.log(count);
}

function PlayTimeBasedGames(qty: number) {
  const playtime = new PlayTime(players);

  const gameGenSingle = new GameGen(players, 1);

  const possibleGames = gameGenSingle.GetGames();

  const gameSelector = new GameSelector(
    playtime,
    possibleGames.map((x) => x.concurrentGames[0]),
    courts
  );

  const sessions: Session[] = [];

  for (let i = 0; i < qty; i++) {
    sessions.push(gameSelector.getNextSession());
  }

  var sessionKeys: string[];

  if (courts === 1) {
    sessionKeys = sessions.map((x) => x.concurrentGames[0].key);
  } else {
    sessionKeys = sessions.map(
      (x) => `${x.concurrentGames[0].key}  -  ${x.concurrentGames[1].key}`
    );
  }

  const count: {
    [player: string]: number;
  } = {};

  sessionKeys.forEach((key) => {
    players.forEach((player) => {
      if (key.includes(player)) {
        if (!count[player]) {
          count[player] = 1;
        } else {
          count[player] += 1;
        }
      }
    });
  });

  console.log("\n\nPlaytime based " + qty);
  console.log(count);
}

/* Randomize array in-place using Durstenfeld shuffle algorithm */
export function shuffleArray<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

Main();
