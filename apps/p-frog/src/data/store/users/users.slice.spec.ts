import { fetchUsers, usersAdapter, usersReducer } from './users.slice';

describe('users reducer', () => {
  it('should handle initial state', () => {
    const expected = usersAdapter.getInitialState({
      loadingStatus: 'not loaded',
      error: null,
    });

    expect(usersReducer(undefined, { type: '' })).toEqual(expected);
  });

  it('should handle fetchUserss', () => {
    let state = usersReducer(undefined, fetchUsers.pending(null, null));

    expect(state).toEqual(
      expect.objectContaining({
        loadingStatus: 'loading',
        error: null,
        entities: {},
      })
    );

    state = usersReducer(state, fetchUsers.fulfilled([{ id: 1 }], null, null));

    expect(state).toEqual(
      expect.objectContaining({
        loadingStatus: 'loaded',
        error: null,
        entities: { 1: { id: 1 } },
      })
    );

    state = usersReducer(
      state,
      fetchUsers.rejected(new Error('Uh oh'), null, null)
    );

    expect(state).toEqual(
      expect.objectContaining({
        loadingStatus: 'error',
        error: 'Uh oh',
        entities: { 1: { id: 1 } },
      })
    );
  });
});
