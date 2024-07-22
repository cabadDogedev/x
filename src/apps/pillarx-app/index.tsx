import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import './styles/tailwindPillarX.css';

// types
import { Projection } from '../../types/api';

// hooks
import { useWalletAddress } from '@etherspot/transaction-kit';
import { useGetTilesInfoQuery } from './api/homeFeed';
import { useGetWaitlistQuery } from '../../services/pillarXApiWaitlist';

// utils
import { componentMap } from './utils/configComponent';

// components
import SkeletonTiles from './components/SkeletonTile/SkeletonTile';
import H1 from './components/Typography/H1';

// images
import PillarXLogo from './components/PillarXLogo/PillarXLogo';
import pillarLogoLight from './images/pillarX_full_white.png';

const App = () => {
  const [t] = useTranslation();
  const [page, setPage] = useState(1);
  const [isLoadingNextPage, setIsLoadingNextPage] = useState(true);
  const [pageData, setPageData] = useState<Projection[]>([]);

  const walletAddress = useWalletAddress();

  // The API call will not fire if there is no walletAddress
  const { data: apiData, isLoading: isApiLoading, isFetching, isSuccess } = useGetTilesInfoQuery( { page: page, address: walletAddress || '' }, { skip: !walletAddress });
  // This is a "fire and forget" call to the waitlist
  useGetWaitlistQuery(walletAddress || '');

  useEffect(() => {
    // when apiData loads, we save it in a state to keep previous data
      if (apiData && isSuccess) {
          setPageData((prevData) => [...prevData, ...apiData.projection]);
          setIsLoadingNextPage(true);
      }
  }, [apiData, isSuccess]);

  // scroll handler makes sure that when reaching the end of the page, it loads the next page
  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;
      if ((scrollTop + clientHeight >= scrollHeight - 100
        
      ) && !isFetching && isLoadingNextPage) {
        setIsLoadingNextPage(false);
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isFetching, isLoadingNextPage]);

// useMemo here to know reload all components and create a smoother scrolling experience
const DisplayAllTiles = useMemo(() => {
  const allTileComponents = [];
  
  for (let index = 0; index < pageData.length; index++) {
    const tileData = pageData[index];
    
    const TileComponent = componentMap[tileData.layout];
    
    if (TileComponent) {
      allTileComponents.push(<TileComponent key={index} data={tileData} isDataLoading={isApiLoading} />);
    }
  }
  
  return allTileComponents;
}, [pageData, isApiLoading]);

  return (
    <Wrapper>
      <PillarXLogo src={pillarLogoLight} className='object-contain h-[20px] mb-[70px] mobile:h-[18px] mobile:mb-[58px] self-center' />
      <H1 className='py-2.5 px-4 mobile:px-0'>{t`content.welcomeBack`} {walletAddress?.substring(0, 6)}...{walletAddress?.substring(walletAddress?.length - 5)}</H1>
        <div className='flex flex-col gap-[40px] tablet:gap-[28px] mobile:gap-[32px]'>
          {DisplayAllTiles}
          {isFetching && <><SkeletonTiles type='horizontal' /><SkeletonTiles type='vertical' /></>}
        </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  margin: 0 auto;
  flex-direction: column;

  @media (min-width: 800px) {
    padding: 50px 60px
  }

  @media (max-width: 800px) {
    padding: 50px 32px
  }

  @media (max-width: 360px) {
    padding: 32px 16px
  }
`;

export default App;
