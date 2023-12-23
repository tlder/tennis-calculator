import fs from 'fs';
import { Match, Point } from './match';
import { createInterface } from 'readline';

type LineType = 'match' | 'players' | 'point' | 'blank';

function readFile(path: string): Match[] {
  if (!fs.existsSync(path)) {
    throw new Error(`File ${path} does not exist`);
  }

  // intentionally synchronous to avoid dealing with async/await
  const content = fs.readFileSync(path, 'utf-8');

  const lines = content.split('\n');

  return processLines(lines);
}

function processLines(lines: string[]): Match[] {
  const matches: Match[] = [];

  let currentMatch: Match = new Match();
  for (const line of lines) {
    const trim = line.trim();
    const lineType = parseLineType(trim);

    switch (lineType) {
      case 'match':
        // New match encountered, add the current match to the list
        if (currentMatch.isValid()) {
          matches.push(currentMatch);
          currentMatch = new Match();
        }

        // Everything after "Match: "
        currentMatch.withId(trim.slice(7));
        break;

      case 'players':
        const [player1, player2] = trim.split(' vs ');
        currentMatch.withPlayer1(player1).withPlayer2(player2);
        break;

      case 'point':
        currentMatch.addPoint(trim as Point);
        break;

      case 'blank':
      default:
      //noop
    }
  }

  if (currentMatch.isValid()) {
    matches.push(currentMatch);
  }

  return matches;
}

function parseLineType(line: string): LineType {
  if (line === '') {
    return 'blank';
  }

  if (line.match(/Match: .+/)) {
    return 'match';
  }

  if (line.match(/.+ vs .+/)) {
    return 'players';
  }

  if (['0', '1'].includes(line)) {
    return 'point';
  }

  throw new Error(`Line ${line} is not valid`);
}

async function readQueries(): Promise<string[]> {
  const results = [];
  for await (const line of createInterface({ input: process.stdin })) {
    // In case we're doing interactive mode
    if (line === 'q') {
      break;
    }

    if (line) {
      results.push(line.trim());
    }
  }

  return results;
}

export { readFile, readQueries };
