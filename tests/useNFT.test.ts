import { renderHook } from '@testing-library/react-hooks';
import { Networks, useNFT, useXNFT } from '../src';
import { TULI_MEDIA_CONTRACT_BY_NETWORK } from '../src/constants/addresses';
import { useOpenseaNFT } from '../src/hooks/useOpenseaNFT';

jest.mock('../src/hooks/useOpenseaNFT');
jest.mock('../src/hooks/useXNFT');

describe('useNFT', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('fetches opensea NFT', () => {
    renderHook(() => useNFT('0x00000000120040', '23'));
    expect(useOpenseaNFT).toHaveBeenLastCalledWith('0x00000000120040', '23', {});
    expect(useOpenseaNFT).toHaveBeenCalledTimes(1);
    expect(useXNFT).toHaveBeenLastCalledWith(undefined, {});
    expect(useOpenseaNFT).toHaveBeenCalledTimes(1);
  });
  it('fetches tuli NFT', () => {
    renderHook(() => useNFT(undefined, '23'));
    expect(useXNFT).toHaveBeenCalledWith('23', {});
    expect(useXNFT).toHaveBeenCalledTimes(1);
    expect(useOpenseaNFT).toHaveBeenCalledWith(undefined, undefined, {});
    expect(useOpenseaNFT).toHaveBeenCalledTimes(1);
  });
  it('fetches tuli NFT by address', () => {
    renderHook(() => useNFT(TULI_MEDIA_CONTRACT_BY_NETWORK[Networks.MAINNET], '23'));
    expect(useXNFT).toHaveBeenCalledWith("23", {});
    expect(useOpenseaNFT).toHaveBeenCalledWith(undefined, undefined, {});
    expect(useXNFT).toHaveBeenCalledTimes(1);
    expect(useOpenseaNFT).toHaveBeenCalledTimes(1);
  });
});
