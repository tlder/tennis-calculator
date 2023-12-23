import { Match } from '../src/match';

describe.each`
  scenario                               | points          | games
  ${'adv reset to deuce'}                | ${'01010101'}   | ${[]}
  ${'adv reset to deuce, player 1 wins'} | ${'0101010100'} | ${['p1']}
  ${'adv reset to deuce, player 2 wins'} | ${'0101010111'} | ${['p2']}
  ${'player 1 wins at 40'}               | ${'0000'}       | ${['p1']}
  ${'player 1 wins with adv'}            | ${'01010100'}   | ${['p1']}
  ${'player 2 wins at 40'}               | ${'1111'}       | ${['p2']}
  ${'player 2 wins with adv'}            | ${'01010111'}   | ${['p2']}
  ${'player 1 wins 2 games'}             | ${'00000000'}   | ${['p1', 'p1']}
  ${'player 2 wins 2 games'}             | ${'11111111'}   | ${['p2', 'p2']}
  ${'players win a game each'}           | ${'11110000'}   | ${['p2', 'p1']}
`('Given points: $points', ({ scenario, points, games }) => {
  const match = new Match()
    .withId('id')
    .withPlayer1('p1')
    .withPlayer2('p2');

  test(`Scenario: ${scenario}. Should have games: ${games}`, () => {
    for (let i = 0; i < points.length; i++) {
      match.addPoint(points[i]);
    }
    expect(match.games).toEqual(games);
  });
});

describe.each`
  scenario                     | games             | sets
  ${'No games played'}         | ${[]}             | ${[0, 0]}
  ${'Not enough games played'} | ${'00000'}        | ${[0, 0]}
  ${'Player 1 wins a set'}     | ${'000000'}       | ${[1, 0]}
  ${'Player 2 wins a set'}     | ${'111111'}       | ${[0, 1]}
  ${'Players both win a set'}  | ${'000000111111'} | ${[1, 1]}
`('Given games: $games', ({ scenario, games, sets }) => {
  const match = new Match()
    .withId('id')
    .withPlayer1('player1')
    .withPlayer2('player2');

  test(`Scenario: ${scenario}. Should have sets: ${sets}`, () => {
    for (let i = 0; i < games.length; i++) {
      match.playerWinsGame(games[i]);
    }
    expect(match.player1Sets).toEqual(sets[0]);
    expect(match.player2Sets).toEqual(sets[1]);
  });
});

describe.each`
  scenario                         | games
  ${'No games won'}                | ${[0, 0]}
  ${'Player 1 wins all the games'} | ${[3, 0]}
  ${'Player 2 wins all the games'} | ${[0, 3]}
  ${'Player 1 wins by 1'}          | ${[3, 2]}
  ${'Player 2 wins by 1'}          | ${[2, 3]}
`('Given games: $games', ({ scenario, games }) => {
  const match = new Match()
    .withId('id')
    .withPlayer1('player1')
    .withPlayer2('player2');

  test(`Scenario: ${scenario}. Should have win/loss: ${games}`, () => {
    for (let i = 0; i < games[0]; i++) {
      match.playerWinsGame('0');
    }

    for (let i = 0; i < games[1]; i++) {
      match.playerWinsGame('1');
    }

    expect(match.queryGamesForPlayer('player1')).toEqual({
      win: games[0],
      loss: games[1],
    });

    expect(match.queryGamesForPlayer('player2')).toEqual({
      win: games[1],
      loss: games[0],
    });
  });
});

describe.each`
  scenario                | games                   | matchResult
  ${'No games won'}       | ${''}                   | ${undefined}
  ${'Player 1 wins all'}  | ${'000000000000'}       | ${{ winner: 'player1', loser: 'player2', winnerSets: 2, loserSets: 0 }}
  ${'Player 1 wins by 1'} | ${'000000111111000000'} | ${{ winner: 'player1', loser: 'player2', winnerSets: 2, loserSets: 1 }}
  ${'Player 2 wins all'}  | ${'111111111111'}       | ${{ winner: 'player2', loser: 'player1', winnerSets: 2, loserSets: 0 }}
  ${'Player 2 wins by 1'} | ${'111111000000111111'} | ${{ winner: 'player2', loser: 'player1', winnerSets: 2, loserSets: 1 }}
`('Given games: $games', ({ scenario, games, matchResult }) => {
  const match = new Match()
    .withId('id')
    .withPlayer1('player1')
    .withPlayer2('player2');

  test(`Scenario: ${scenario}. Should have result: ${matchResult}`, () => {
    for (let i = 0; i < games.length; i++) {
      match.playerWinsGame(games[i]);
    }

    expect(match.queryMatchResult()).toEqual(matchResult);
  });
});
