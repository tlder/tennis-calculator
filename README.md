# Tennis Calculator

This is a solution to the [Tennis Calculator problem](PROBLEM.md).

## Instructions

Checkout the code and run:

```shell
npm install
```

### Running the calculator


```shell
npm run game test/data/full_tournament.txt <<EOF
  Score Match 02
  Games Player Person A
EOF
```

### Running the tests

```shell
npm run test

# with code coverage
npm run test:coverage
```

## Explanation

The solution involves reading the input file and splitting it by lines. Each line 
is then parsed into a `Match` object. The `Match` object keeps track of the current
game and set scores. 

The `Match` class also implements the `Queryable` interface which allows it to 
be decoupled from `TournamentQuery` for easier testing. 

The `TournamentQuery` class is used to query the score of a match. It is 
constructed with an array of `Queryable` objects and then the `processQuery`
function is used to parse the query string and return the result. There is 
some basic error handling to ensure that the query is valid.

## Assumptions

1. The input file should be in a valid format with enough points to complete a match
2. Any points added after a match are ignored
3. Queries are case-sensitive
