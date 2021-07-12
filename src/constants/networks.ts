type NetworkNames = 'MAINNET' | 'RINKEBY' | 'BSC' | 'POLYGON';
type NetworkIDs = '1' | '4' | '56' | '137';

// Supported networks with Tuli contract deployments.
// As more networks are supported by tuli more network IDs will be added.
const Networks: Record<NetworkNames, NetworkIDs> = {
  MAINNET: '1',
  RINKEBY: '4',
      BSC: '56',
  POLYGON: '137',
};

export { Networks };
export type { NetworkIDs };
