import { readFile, readQueries } from './io';
import { TournamentQuery } from './query';

async function run(path: string) {
  const matches = readFile(path);
  const query = new TournamentQuery(matches);

  const queries = await readQueries();
  const queryResponses = [];
  for (let i = 0; i < queries.length; i++) {
    queryResponses.push(query.processQuery(queries[i]));
  }

  for (const response of queryResponses) {
    console.log(response + "\n");
  }
}

const args = process.argv.slice(2);
const path = args[0];

run(path);
