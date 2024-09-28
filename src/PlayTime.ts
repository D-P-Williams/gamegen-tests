import { Session } from "./GameGen";

export interface Player {
  name: string;
  playtime: number;
}

export default class PlayTime {
  private readonly players: string[];
  private playtime: Player[] = [];

  constructor(players: string[]) {
    this.players = players;

    // instantiate the playtime map with 0 values
    this.players.forEach((player) => {
      this.playtime.push({ name: player, playtime: 0 });
    });
  }

  GetPlayerPlaytime(player: string): number | undefined {
    return this.playtime.find((x) => x.name === player)?.playtime;
  }

  /**
   * Return a list of players, ordered by descending playtime.
   * i.e. index 0 has the least playtime.
   *
   * @returns An ordered list of `Player`'s
   */
  GetPlaytimeOrderedPlayers(): Player[] {
    return this.playtime.sort((a, b) => {
      return a.playtime >= b.playtime ? 1 : -1;
    });
  }

  /**
   * Record a session to update the playtime of the players in the session
   *
   * @param gameSession The session which has been played
   */
  RecordMatch(gameSession: Session) {
    gameSession.concurrentGames.forEach((game) => {
      this.incrementPair(game.pair1.pair);
      this.incrementPair(game.pair2.pair);
    });
  }

  /**
   * Increment the playtime of both players in a pair by 1
   */
  incrementPair(pair: string[]) {
    pair.forEach((pairName) => {
      const playerIdx = this.playtime.findIndex((x) => x.name === pairName);

      this.playtime[playerIdx].playtime += 1;
    });
  }
}
