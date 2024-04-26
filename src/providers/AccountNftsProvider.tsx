import React, { createContext, useEffect, useMemo, useRef } from 'react';
import { useEtherspotNfts, useWalletAddress } from '@etherspot/transaction-kit';
import { NftCollection, Nft } from '@etherspot/prime-sdk/dist/sdk/data';
import isEqual from 'lodash/isEqual';
import differenceWith from 'lodash/differenceWith';

// utils
import { visibleChains } from '../utils/blockchain';

// services
import { getJsonItem, setJsonItem, storageKey } from '../services/dappLocalStorage';

export interface INfts {
  [chainId: number]: {
    [walletAddress: string]: NftCollection[]
  };
}

export interface AccountNftsContext {
  listenerRef: React.MutableRefObject<AccountNftsListenerRef>;
  data: {
    nfts: INfts;
  }
}

export interface AccountNftsListenerRef {
  onNftReceived?: (chainId: number, walletAddress: string, nft: Nft) => void;
  onNftSent?: (chainId: number, walletAddress: string, nft: Nft) => void;
  prevNfts?: INfts;
}

export const AccountNftsContext = createContext<AccountNftsContext | null>(null);

const AccountNftsProvider = ({ children }: React.PropsWithChildren) => {
  const { getAccountNfts } = useEtherspotNfts();
  const walletAddress = useWalletAddress();
  const [nfts, setNfts] = React.useState<INfts>(getJsonItem(storageKey.nfts) ?? {});
  const listenerRef = useRef<AccountNftsListenerRef>({});

  useEffect(() => {
    let expired = false;
    let timeout: NodeJS.Timeout;

    const refresh = async () => {
      if (!walletAddress) return;

      const chainIds = visibleChains.map((chain) => chain.id);

      // sequential to avoid throttling
      for (const chainId of chainIds) {
        if (expired) return;

        const accountNfts = await getAccountNfts(walletAddress, chainId);
        if (expired) return;

        // update each chain ID separately for faster updates
        setNfts((current) => {
          // deep compare per chainId and walletAddress
          return !accountNfts?.length || isEqual(current?.[chainId]?.[walletAddress], accountNfts)
            ? current
            : { ...current, [chainId]: { ...current[chainId] ?? {}, [walletAddress]: accountNfts } }
        });
      }

      if (expired) return;

      timeout = setTimeout(refresh, 5000); // confirmed block time depending on chain is ~1-10s
    }

    refresh();

    return () => {
      expired = true;
      if (timeout) clearTimeout(timeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);

  useEffect(() => {
    setJsonItem(storageKey.nfts, nfts);
  }, [nfts]);

  useEffect(() => {
    if (!Object.keys(nfts).length) return; // nothing added yet

    // only store for the initial run
    if (!Object.keys(listenerRef.current?.prevNfts ?? {}).length) {
      listenerRef.current.prevNfts = nfts;
      return;
    }

    if (listenerRef.current?.onNftReceived || listenerRef.current?.onNftSent) {
      Object.keys(nfts).forEach((chainId) => {
        Object.keys(nfts[+chainId] ?? {}).forEach((walletAddress) => {
          const collections = (nfts[+chainId][walletAddress] ?? []) as NftCollection[];
          collections.forEach((collection) => {
            const prevCollection = listenerRef.current.prevNfts?.[+chainId]?.[walletAddress]
              ?.find((prevCollection) => prevCollection.contractAddress === collection.contractAddress);

            const receivedNfts = differenceWith(
              collection?.items ?? [],
              prevCollection?.items ?? [],
              isEqual,
            );

            receivedNfts.forEach((nft) => {
              if (!listenerRef.current.onNftReceived) return;
              listenerRef.current.onNftReceived(+chainId, walletAddress, nft);
            });

            const sentNfts = differenceWith(
              prevCollection?.items ?? [],
              collection?.items ?? [],
              isEqual,
            );

            sentNfts.forEach((nft) => {
              if (!listenerRef.current.onNftSent) return;
              listenerRef.current.onNftSent(+chainId, walletAddress, nft);
            });
          });
        });
      });
    }

    listenerRef.current.prevNfts = nfts;
  }, [nfts, listenerRef]);

  const contextData = useMemo(() => ({
    nfts,
  }), [
    nfts,
  ]);

  return (
    <AccountNftsContext.Provider value={{ listenerRef, data: contextData }}>
      {children}
    </AccountNftsContext.Provider>
  );
}

export default AccountNftsProvider;
