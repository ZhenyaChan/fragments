const { expectCt } = require('helmet');
const {
  writeFragment,
  writeFragmentData,
  readFragment,
  readFragmentData,
  listFragments,
} = require('../../src/model/data/memory');

describe('test In-Memory Database backend', () => {
  test('readFragment() returns the same fragment metadata we writeFragment() into database', async () => {
    await writeFragment({ ownerId: '001', id: '1', fragment: 'test fragment' });
    const result = await readFragment('001', '1');
    expect(result).toEqual({ ownerId: '001', id: '1', fragment: 'test fragment' });
  });

  test('readFragment() throws with incorrect ownerId and fragment id ', async () => {
    expect(() => readFragment('002', '222').expect.toThrow());
  });
});
