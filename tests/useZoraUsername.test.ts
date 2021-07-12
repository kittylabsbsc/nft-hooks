import { renderHook } from '@testing-library/react-hooks';
import { cache } from 'swr';

import fetchMock from './setupFetchMock';

import { useTuliUsername } from '../src';
import { defaultFetchAgent } from '../src/context/NFTFetchContext';

describe('useTuliUsername', () => {
  beforeEach(() => {
    defaultFetchAgent.clearCache();
    fetchMock.reset();
    cache.clear();
  });

  it('loads tuli username information from server', async () => {
    fetchMock.post('https://tuli.ink/api/users', [
      {
        address: '0xab5801a7d398351b8be11c439e05c5b3259aec9b',
        username: 'vitalik',
        verified: true,
        website: null,
      },
      {
        address: '0xignore',
        username: 'ignore',
        verified: false,
        website: null,
      },
    ]);

    const { waitFor, result } = renderHook(() =>
      useTuliUsername('0xab5801a7d398351b8be11c439e05c5b3259aec9b')
    );

    await waitFor(() => result.current.username !== undefined);

    expect(result.current.error).toBeUndefined();
    expect(result.current.username).toEqual({
      address: '0xab5801a7d398351b8be11c439e05c5b3259aec9b',
      username: 'vitalik',
      verified: true,
      website: null,
    });
  });

  it('returns error when the webrequest fails', async () => {
    fetchMock.post('https://tuli.ink/api/users', 'Bad request', {
      response: { status: 402 },
    });

    const { waitFor, result } = renderHook(() => useTuliUsername('0xeeee'));

    await waitFor(() => result.current.error !== undefined);

    expect(result.current.error.toString()).toEqual('RequestError: Request Status = 402');
    expect(result.current.username).toBeUndefined();
  });

  it('batches multiple usernames', async () => {
    const useUsernamesMultiple = (a: string, b: string) => {
      const { username: usernamea, error: errorb } = useTuliUsername(a);
      const { username: usernameb, error: errora } = useTuliUsername(b);
      return { usernamea, usernameb, errora, errorb };
    };
    fetchMock.post('https://tuli.ink/api/users', [
      {
        address: '0xab5801a7d398351b8be11c439e05c5b3259aec9b',
        username: 'vitalik',
        verified: true,
        website: null,
      },
      {
        address: '0xeee',
        username: 'ignore',
        verified: false,
        website: null,
      },
    ]);

    const { waitFor, result } = renderHook(() =>
      useUsernamesMultiple('0xab5801a7d398351b8be11c439e05c5b3259aec9b', '0xeee')
    );

    await waitFor(() => !!result.current.usernamea);

    expect(result.current.errora).toBeUndefined();
    expect(result.current.errorb).toBeUndefined();
    expect(result.current.usernamea).toEqual({
      address: '0xab5801a7d398351b8be11c439e05c5b3259aec9b',
      username: 'vitalik',
      verified: true,
      website: null,
    });
    expect(result.current.usernameb).toEqual({
      address: '0xeee',
      username: 'ignore',
      verified: false,
      website: null,
    });
  });
  it('fails with invalid json', async () => {
    fetchMock.post('https://tuli.ink/api/users', 'INVALID JSON', {
      response: { headers: { 'content-type': 'application/json' } },
    });

    const { waitFor, result } = renderHook(() => useTuliUsername('0xdeee'));

    await waitFor(() => !!result.current.error);

    expect(result.current.error.toString()).toEqual(
      'FetchError: invalid json response body at https://tuli.ink/api/users reason: Unexpected end of JSON input'
    );
    expect(result.current.username).toBeUndefined();
  });
});
