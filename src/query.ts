import { Queryable } from './match';

const REGEX_MATCH_QUERY = /Score Match (.+)/;
const REGEX_GAMES_QUERY = /Games Player (.+)/;

class TournamentQuery {
  matches: Queryable[];

  constructor(matches: Queryable[]) {
    this.matches = matches;
  }

  processQuery(query: string): string {
    if (!query) {
      return 'Query cannot be empty';
    }

    // Queries will be in the form of:
    // - Score Match <matchId>
    // - Games Player <playerName>

    const scoreMatch = query.match(REGEX_MATCH_QUERY);
    const gamesPlayer = query.match(REGEX_GAMES_QUERY);

    if (scoreMatch) {
      return this.processMatchQuery(scoreMatch[1]);
    } else if (gamesPlayer) {
      return this.processGamesQuery(gamesPlayer[1]);
    }

    return 'Invalid query: ' + query;
  }

  processMatchQuery(matchId: string): string {
    const match = this.matches.find((match) => match.id === matchId);
    if (!match) {
      return 'Could not find match with id: ' + matchId;
    }

    const matchResult = match.queryMatchResult();

    if (!matchResult) {
      return 'Match is not complete';
    }

    return (
      `${matchResult.winner} defeated ${matchResult.loser}\n` +
      `${matchResult.winnerSets} sets to ${matchResult.loserSets}`
    );
  }

  processGamesQuery(playerName: string): string {
    const winLoss = this.matches.map((match) =>
      match.queryGamesForPlayer(playerName),
    );

    const totals = winLoss.reduce((acc, curr) => {
      return {
        win: acc.win + curr.win,
        loss: acc.loss + curr.loss,
      };
    });

    return `${totals.win} ${totals.loss}`;
  }
}

export { TournamentQuery };
