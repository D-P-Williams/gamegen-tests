import { Game, Session } from "./GameGen";
import { shuffleArray } from "./Main";
import PlayTime from "./PlayTime";

export default class GameSelector {
  private readonly playtime: PlayTime;
  private readonly possibleGames: Game[];
  private readonly courts: number;

  constructor(playtime: PlayTime, possibleGames: Game[], courts: number) {
    this.playtime = playtime;
    this.possibleGames = possibleGames;
    this.courts = courts;
  }

  getNextSession(): Session {
    const playerCount = 4;

    // Get the ordered list of players and trim it to the number of players
    let orderedPlayers = this.playtime
      .GetPlaytimeOrderedPlayers()
      .slice(0, playerCount * this.courts);

    // Shuffle the array to avoid players on bench always switching in together
    shuffleArray(orderedPlayers);

    const session: Session = { concurrentGames: [] } satisfies Session;

    for (let i = 0; i < this.courts; i += 1) {
      // Get the next set of players to put into a match and slice them out of the orderedPlayers array
      const nextPlayers = orderedPlayers.slice(0, 4);
      orderedPlayers = orderedPlayers.slice(4);

      const filteredGames = this.possibleGames.filter((x) => {
        let result: number = 0;

        nextPlayers.forEach((player) => {
          if (x.key.includes(player.name)) {
            result += 1;
          }
        });

        return result === playerCount;
      });

      const selectedGame =
        filteredGames[Math.floor(Math.random() * (filteredGames.length - 1))];

      session.concurrentGames.push(selectedGame);

      this.playtime.RecordMatch(session);
    }

    return session;
  }
}
