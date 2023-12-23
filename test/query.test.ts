import { Queryable } from '../src/match';
import { TournamentQuery } from '../src/query';

describe.each`
  scenario           | winLoss                                | query                      | expected
  ${'Empty query'}   | ${['player 1|23|17']}                  | ${''}                      | ${'Query cannot be empty'}
  ${'Invalid query'} | ${['player 1|23|17']}                  | ${'invalid query'}         | ${'Invalid query: invalid query'}
  ${'One match'}     | ${['player 1|23|17']}                  | ${'Games Player player 1'} | ${'23 17'}
  ${'Two match '}    | ${['player 2|10|10', 'player 2|15|0']} | ${'Games Player player 2'} | ${'25 10'}
`(
  'Query games for player. Given winLoss: $winLoss and query: $query',
  ({ scenario, winLoss, query, expected }) => {
    test(`Scenario: ${scenario}. Response should be: ${expected}`, () => {
      const matches: Queryable[] = [];
      for (let i = 0; i < winLoss.length; i++) {
        const queryable = createQueryable({ winLoss: winLoss[i] });
        matches.push(queryable);
      }

      const tournamentQuery = new TournamentQuery(matches);
      const result = tournamentQuery.processQuery(query);
      expect(result).toEqual(expected);
    });
  },
);

describe.each`
  scenario                      | matchResult                                                 | query                | expected
  ${'Empty query'}              | ${['01|player A|player B|2|0']}                             | ${''}                | ${'Query cannot be empty'}
  ${'Invalid (case sensitive)'} | ${['01|player A|player B|2|0']}                             | ${'score match 123'} | ${'Invalid query: score match 123'}
  ${'Match not found'}          | ${['01|player A|player B|2|0']}                             | ${'Score Match 03'}  | ${'Could not find match with id: 03'}
  ${'Match not complete'}       | ${['03']}                                                   | ${'Score Match 03'}  | ${'Match is not complete'}
  ${'One match'}                | ${['01|player A|player B|2|0']}                             | ${'Score Match 01'}  | ${'player A defeated player B\n2 sets to 0'}
  ${'Two match'}                | ${['01|player A|player B|2|0', '02|player B|player C|3|1']} | ${'Score Match 02'}  | ${'player B defeated player C\n3 sets to 1'}
`(
  'Query match result. Given winLoss: $winLoss and query: $query',
  ({ scenario, matchResult, query, expected }) => {
    test(`Scenario: ${scenario}. Response should be: ${expected}`, () => {
      const matches: Queryable[] = [];
      for (let i = 0; i < matchResult.length; i++) {
        const queryable = createQueryable({ matchResult: matchResult[i] });
        matches.push(queryable);
      }

      const tournamentQuery = new TournamentQuery(matches);
      const result = tournamentQuery.processQuery(query);
      expect(result).toEqual(expected);
    });
  },
);

// Helper to mock the Queryable interface
function createQueryable(params: {
  winLoss?: string;
  matchResult?: string;
}): Queryable {
  const [player, win, loss] = params.winLoss ? params.winLoss.split('|') : [];
  const queryGamesForPlayer = (query: string) => {
    if (player === query) {
      return { win: parseInt(win), loss: parseInt(loss) };
    }
    return { win: 0, loss: 0 };
  };

  const [id, winner, loser, winnerSets, loserSets] = params.matchResult
    ? params.matchResult.split('|')
    : [];
  const queryMatchResult = () => {
    if (!winner || !loser || !winnerSets || !loserSets) {
      return undefined;
    }
    return {
      winner,
      loser,
      winnerSets: parseInt(winnerSets),
      loserSets: parseInt(loserSets),
    };
  };

  return { id, queryGamesForPlayer, queryMatchResult };
}
