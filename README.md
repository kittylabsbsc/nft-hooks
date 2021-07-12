## @tulilabs/nft-hooks

Simple React hooks to load Tuli NFT data. Includes on-chain data, NFT metadata, and tools for fetching NFT content if needed.

Put together, these power implementations of the xNFT protocol on any website.

This library consists of a data fetch class and associated React hooks to load NFT data is an easy, efficient manner. The API both batches and caches requests, meaning you can use the hooks across a page without needing to worry about significant performance penalties.

👯 See also: [@tulilabs/nft-components](https://github.com/kittylabsbsc/nft-components) a complimentary library to this one to render NFT data on a webpage.


Install:
```bash
yarn add @tulilabs/nft-hooks
```

Then you can import and use the hooks in your react application:

```ts
import {useXNFT, useNFTMetadata} from "@tulilabs/nft-hooks";

function MyNFT() {
  const {data} = useXNFT("20");
  const {metadata} = useNFTMetadata(data && data.metadataURI);

  return (
    <div>
      <h3>{metadata.title}</h3>
      <p>{metadata.description}</p>
      <p>Owned by: {data.owner.id}</p>
    </div>
  );
}
```

### All hooks:

| Hook | Usage |
| -- | -- |
| [useNFT](docs/useNFT.md) | Fetches on-chain NFT data for either tuli or non-tuli NFTs |
| [useXNFT](docs/useXNFT.md) | Fetches on-chain tuli xNFT data (most likely want to use useNFT) |
| [useAuctions](docs/useAuctions.md) | Fetches list of auctions given one or more curators from the Tuli auction house |
| [useNFTMetadata](docs/useNFTMetadata.md) | Fetches NFT metadata from a URL |
| [useNFTContent](docs/useNFTContent.md) | Fetches text content from server for rendering from content URL |

### Configuration:

To set the network configuration, wrap the hooks used with the `NFTFetchConfiguration` component.

```ts
import {Networks, NFTFetchConfiguration} from '@tulilabs/nft-hooks';

function NFTGallery() {
  return (
    <NFTFetchConfiguration network={Networks.MAINNET}>
      <NFTList>
    </NFTFetchConfiguration>
  );
}
```

### Data sources:

Currently data is fetched from:
1. TheGraph for auction information, xNFT information, and currency information
2. Direct metadata URIs for xNFT metadata
3. Opensea for non-tuli tracked NFTs

Links direct to tuli.ink interfaces, but can be overridden to directly use the [TDK](https://github.com/kittylabsbsc/tdk) instead.

### Development:

1. `git clone https://github.com/kittylabsbsc/nft-hooks`
2. `cd nft-hooks`
3. `npm i -g yarn` if you don't have yarn installed
4. `yarn`
5. `yarn run test` test your code

Pull requests and tickets are accepted for issues and improvements for this library.
