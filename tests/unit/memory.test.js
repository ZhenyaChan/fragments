const {
  writeFragment,
  writeFragmentData,
  readFragment,
  readFragmentData,
  listFragments,
  deleteFragment,
} = require('../../src/model/data/memory');

describe('test In-Memory Database backend and data model', () => {
  test('writeFragment() returns nothing', async () => {
    const result = await writeFragment({ ownerId: 'aaa', id: 'a', fragment: 'aaa fragment' });
    expect(result).toBe(undefined);
  });

  test('writeFragmentData() returns nothing', async () => {
    const result = await writeFragmentData('a', 'b', '');
    expect(result).toBe(undefined);
  });

  test('readFragment() returns the same fragment metadata we writeFragment() into database', async () => {
    await writeFragment({ ownerId: '001', id: '1', fragment: 'test fragment' });
    const result = await readFragment('001', '1');
    expect(result).toEqual({ ownerId: '001', id: '1', fragment: 'test fragment' });
  });

  test('readFragment() throws with non-existing ownerId and fragment id', async () => {
    expect(() => readFragment('002', '222').rejects.toThrow());
  });

  test('readFragmentData() returns the same fragment data we writeFragmentData() into database', async () => {
    await writeFragmentData('003', '3', '3rd test fragment data');
    const result = await readFragmentData('003', '3');
    expect(result).toEqual('3rd test fragment data');
  });

  test('readFragmentData() throws with non-existing fragment id', async () => {
    await writeFragment({ ownerId: '004', id: '4', fragment: '4rd test fragment' });
    expect(() => readFragmentData('004', '444').rejects.toThrow());
  });

  test('listFragments() returns array of fragment ids with the same ownerId', async () => {
    await writeFragment({ ownerId: '005', id: '5', fragment: '5th testing fragment' });
    await writeFragment({ ownerId: '005', id: '6', fragment: '6th testing fragment' });

    const idArray = await listFragments('005');
    expect(Array.isArray(idArray)).toBe(true);
    expect(idArray).toEqual(['5', '6']);
  });

  test('listFragments() returns array of expanded fragments with the same ownerId', async () => {
    await writeFragment({ ownerId: '006', id: '7', fragment: '7th testing fragment' });
    await writeFragment({ ownerId: '006', id: '8', fragment: '8th testing fragment' });

    const fragmentsArray = await listFragments('006', true);
    expect(Array.isArray(fragmentsArray)).toBe(true);
    expect(fragmentsArray).toEqual([
      { ownerId: '006', id: '7', fragment: '7th testing fragment' },
      { ownerId: '006', id: '8', fragment: '8th testing fragment' },
    ]);
  });

  test('deleteFragment() removes fragment data and metadata from database', async () => {
    await writeFragment({ ownerId: '009', id: '9', fragment: '9th testing fragment' });
    await writeFragmentData('009', '9', '9th testing fragment');

    const resultMetaData = await readFragment('009', '9');
    expect(resultMetaData).toEqual({ ownerId: '009', id: '9', fragment: '9th testing fragment' });
    const resultData = await readFragmentData('009', '9');
    expect(resultData).toEqual('9th testing fragment');

    await deleteFragment('009', '9');

    expect(() => readFragmentData('009', '9').rejects.toThrow());
    expect(() => readFragment('009', '9').rejects.toThrow());
  });
});
