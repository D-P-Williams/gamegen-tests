/**
 * A single doubles team
 */
type Pair = {
  pair: string[];
  key: string;
};

/**
 * A single doubles game
 */
export type Game = {
  pair1: Pair;
  pair2: Pair;
  court: number;
  key: string;
};

/**
 * A session contains all courts playing at once
 */
export type Session = {
  concurrentGames: Game[];
};

export default class GameGen {
  private readonly players: string[];
  private readonly courts: number;

  constructor(players: string[], courts: number = 1) {
    this.players = players;
    this.courts = courts;
  }

  GetPlayers(): string[] {
    return this.players;
  }

  // Calculate player pair combinations
  pairCombinations(arr: Array<string>): Array<Pair> {
    return arr.flatMap((v, i) =>
      arr.slice(i + 1).map((w) => {
        return { pair: [v, w], key: [v, w].sort().join("-") } as Pair;
      })
    );
  }

  // Calculate game combinations from possible pairs
  GameCombinations(arr: Array<Pair>): Map<string, Game> {
    const games = new Map<string, Game>();

    arr.forEach((v, i) =>
      arr.slice(i + 1).forEach((w) => {
        if (!this.checkPairParticipantsUnique(v, w)) {
          return;
        }

        const gameKey = [v.key, w.key].sort().join(" vs ");

        if (!games.has(gameKey)) {
          games.set(gameKey, {
            pair1: v,
            pair2: w,
            key: gameKey,
          } as Game);
        }
      })
    );

    return games;
  }

  // Calculate session combinations from possible games
  sessionCombinations(arr: Map<string, Game>): Map<string, Session> {
    const sessions = new Map<string, Session>();

    // for each game
    arr.forEach((game) => {
      // Check every other game
      arr.forEach((possibleMatch) => {
        // Has unique participants
        if (this.checkGameParticipantsUnique(game, possibleMatch)) {
          // Then add it to the possible combinations list
          const localGame = game;
          const localPossibleMatch = possibleMatch;

          localGame.court = 1;
          localPossibleMatch.court = 2;

          const sessionKey = [game.key, possibleMatch.key].sort().join("-");

          if (!sessions.has(sessionKey)) {
            sessions.set(sessionKey, {
              concurrentGames: [localGame, localPossibleMatch],
            });
          }
        }
      });
    });

    return sessions;
  }

  checkPairParticipantsUnique(pair1: Pair, pair2: Pair): boolean {
    // if intersection return false, else true
    const intersection = pair1.pair.filter((x) => pair2.pair.includes(x));

    return intersection.length === 0;
  }

  checkGameParticipantsUnique(game1: Game, game2: Game): boolean {
    const intersection1 = this.checkPairParticipantsUnique(
      game1.pair1,
      game2.pair1
    );

    const intersection2 = this.checkPairParticipantsUnique(
      game1.pair2,
      game2.pair2
    );

    const intersection3 = this.checkPairParticipantsUnique(
      game1.pair1,
      game2.pair2
    );

    const intersection4 = this.checkPairParticipantsUnique(
      game1.pair2,
      game2.pair1
    );

    return intersection1 && intersection2 && intersection3 && intersection4;
  }

  GetGames(): Session[] {
    if (this.courts === 1) {
      return Array.from(
        this.GameCombinations(this.pairCombinations(this.players)).values()
      ).map((x) => {
        return { concurrentGames: [x] } as Session;
      });
    }

    return Array.from(
      this.sessionCombinations(
        this.GameCombinations(this.pairCombinations(this.players))
      ).values()
    );
  }
}
