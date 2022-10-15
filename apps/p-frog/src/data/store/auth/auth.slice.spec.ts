import { authReducer, initialAuthState, Login } from './auth.slice';

describe('auth reducer', () => {
  it('should handle initial state', () => {
    const expected = initialAuthState;

    expect(authReducer(undefined, { type: '' })).toEqual(expected);
  });

  it('should handle Login', () => {
    let state = authReducer(undefined, Login.pending('Auth'));

    expect(state).toEqual(
      expect.objectContaining({
        loadingStatus: 'loading',
        error: null,
        isAuth: false,
        statusMessage: null
      })
    );

    state = authReducer(state, Login.fulfilled(undefined, 'Auth'));

    expect(state).toEqual(
      expect.objectContaining({
        loadingStatus: 'loaded',
        error: null,
        isAuth: true,
        statusMessage: null
      })
    );

    state = authReducer(
      state,
      Login.rejected(null, 'Auth')
    );

    expect(state).toEqual(
      expect.objectContaining({
        error: { message: "Rejected"},
        isAuth: true, 
        loadingStatus: "error", 
        statusMessage: null
      })
    );
  });
});
