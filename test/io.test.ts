import { readFile } from '../src/io';

describe('io', () => {
  it('should read a file without error', () => {
    const matches = readFile('test/data/full_tournament.txt');
    expect(matches).toHaveLength(2);

    expect(matches[0].id).toEqual('01');
    expect(matches[0].player1).toEqual('Person A');
    expect(matches[0].player2).toEqual('Person B');
    expect(matches[0].matchResult).toBeDefined()

    expect(matches[1].id).toEqual('02');
    expect(matches[1].player1).toEqual('Person A');
    expect(matches[1].player2).toEqual('Person C');
    expect(matches[1].matchResult).toBeDefined()
  });

  it('should throw an error if the file does not exist', () => {
    expect(() => readFile('test/data/does_not_exist.txt')).toThrow(
      'File test/data/does_not_exist.txt does not exist',
    );
  });
});
