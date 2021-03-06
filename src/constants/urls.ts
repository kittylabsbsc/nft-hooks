import { Networks } from './networks';

export const THEGRAPH_API_URL_BY_NETWORK = {
  [Networks.MAINNET]: 'https://api.thegraph.com/subgraphs/name/bitbd83/tulisubmainnet',
  [Networks.RINKEBY]: 'https://api.thegraph.com/subgraphs/name/bitbd83/tulisubrinkeby',
  [Networks.BSC]: 'https://api.thegraph.com/subgraphs/name/bitbd83/tulisubbsc',
  [Networks.POLYGON]: 'https://api.thegraph.com/subgraphs/name/bitbd83/tulisubpolygon',
};

export const THEGRAPH_UNISWAP_URL_BY_NETWORK = {
  [Networks.MAINNET]: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
  [Networks.RINKEBY]:
    'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v2-rinkeby',
};

export const OPENSEA_API_URL_BY_NETWORK = {
  [Networks.MAINNET]: 'https://api.opensea.io/api/v1/',
  [Networks.RINKEBY]: 'https://rinkeby-api.opensea.io/api/v1/',
};

export const TULI_USERNAME_API_URL = 'https://tuli.work/profile/';
