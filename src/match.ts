// Represent a point for either player 1 or player 2
type Point = '0' | '1';
type Player = string;
type WinLoss = { win: number; loss: number };
type MatchResult = {
  winner: Player;
  loser: Player;
  winnerSets: number;
  loserSets: number;
};

/**
 * Interface for querying a match
 */
interface Queryable {
  id: string;
  queryGamesForPlayer(player: Player): WinLoss;
  queryMatchResult(): MatchResult | undefined;
}

const SETS_TO_WIN = 2;

/**
 * A tennis match is made up of points, games, and sets. A set is won by the
 * first player to win 6 games. The match is won by the first player to
 * win 2 sets.
 */
class Match implements Queryable {
  id: string;
  player1: Player;
  player2: Player;

  // Array of winners for each game
  games: Player[];

  // The number points within the current game
  player1Points: number;
  player2Points: number;

  // The number of games won within the current set
  player1Games: number;
  player2Games: number;

  // The number of sets won by each player
  player1Sets: number;
  player2Sets: number;

  /**
   * The result of the match or undefined if the match is not complete
   */
  matchResult?: MatchResult;

  constructor() {
    this.id = '';
    this.player1 = '';
    this.player2 = '';

    this.games = [];

    this.player1Points = 0;
    this.player2Points = 0;

    this.player1Games = 0;
    this.player2Games = 0;

    this.player1Sets = 0;
    this.player2Sets = 0;
  }

  withId(id: string): Match {
    this.id = id;
    return this;
  }

  withPlayer1(player1: Player): Match {
    this.player1 = player1;
    return this;
  }

  withPlayer2(player2: Player): Match {
    this.player2 = player2;
    return this;
  }

  addPoint(point: Point): Match {
    if (this.matchResult) return this;
    if (point === '0') this.player1Points++;
    if (point === '1') this.player2Points++;

    // Deuce
    if (this.player1Points === 4 && this.player2Points === 4) {
      this.player1Points = 3;
      this.player2Points = 3;

      // Player 1 win by adv
    } else if (this.player1Points === 5 && this.player2Points === 3) {
      this.playerWinsGame('0');

      // Player 2 win by adv
    } else if (this.player2Points === 5 && this.player1Points === 3) {
      this.playerWinsGame('1');

      // Player 1 win by 40
    } else if (this.player1Points === 4 && this.player2Points < 3) {
      this.playerWinsGame('0');
    }

    // Player 2 win by 40
    else if (this.player2Points === 4 && this.player1Points < 3) {
      this.playerWinsGame('1');
    }

    return this;
  }

  playerWinsGame(point: Point) {
    if (this.matchResult) return;

    if (point === '0') {
      this.player1Games++;
      this.games.push(this.player1);
    }

    if (point === '1') {
      this.player2Games++;
      this.games.push(this.player2);
    }

    this.player1Points = 0;
    this.player2Points = 0;

    // Determine if the set has been won
    if (this.player1Games === 6) {
      this.playerWinsSet('0');
    } else if (this.player2Games === 6) {
      this.playerWinsSet('1');
    }
  }

  playerWinsSet(point: Point) {
    if (this.matchResult) return;
    if (point === '0') this.player1Sets++;
    if (point === '1') this.player2Sets++;

    if (this.player1Sets === SETS_TO_WIN) {
      this.matchResult = {
        winner: this.player1,
        loser: this.player2,
        winnerSets: this.player1Sets,
        loserSets: this.player2Sets,
      };
    } else if (this.player2Sets === SETS_TO_WIN) {
      this.matchResult = {
        winner: this.player2,
        loser: this.player1,
        winnerSets: this.player2Sets,
        loserSets: this.player1Sets,
      };
    }

    // Reset games
    this.player1Games = 0;
    this.player2Games = 0;
  }

  isValid(): boolean {
    return (
      this.id !== '' &&
      this.player1 !== '' &&
      this.player2 !== '' &&
      this.matchResult !== undefined
    );
  }

  queryGamesForPlayer(player: Player): WinLoss {
    const win = this.games.filter((game) => game === player).length;
    const loss = this.games.filter((game) => game !== player).length;
    return { win, loss };
  }

  queryMatchResult(): MatchResult | undefined {
    return this.matchResult;
  }
}

export { Point, Player, WinLoss, Match, Queryable };
