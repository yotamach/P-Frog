import { fetchTasks, tasksAdapter, tasksReducer } from './auth.slice';

describe('tasks reducer', () => {
  it('should handle initial state', () => {
    const expected = tasksAdapter.getInitialState({
      loadingStatus: 'not loaded',
      error: null,
    });

    expect(tasksReducer(undefined, { type: '' })).toEqual(expected);
  });

  it('should handle fetchTaskss', () => {
    let state = tasksReducer(undefined, fetchTasks.pending('Task'));

    expect(state).toEqual(
      expect.objectContaining({
        loadingStatus: 'loading',
        error: null,
        entities: {},
      })
    );

    state = tasksReducer(state, fetchTasks.fulfilled([{ id: 1 }], 'Task'));

    expect(state).toEqual(
      expect.objectContaining({
        loadingStatus: 'loaded',
        error: null,
        entities: { 1: { id: 1 } },
      })
    );

    state = tasksReducer(
      state,
      fetchTasks.rejected(new Error('Uh oh'), 'Task')
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
