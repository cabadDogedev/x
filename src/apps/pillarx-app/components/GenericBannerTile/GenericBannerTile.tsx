// types
import { GenericBannerDisplay, Projection } from '../../../../types/api';

// components
import TileContainer from '../TileContainer/TileContainer'
import SkeletonLoader from '../../../../components/SkeletonLoader';

type GenericBannerTileProps = {
    data: Projection | undefined;
    isDataLoading: boolean;
}

const GenericBannerTile = ({ data, isDataLoading }: GenericBannerTileProps) => {
    const { meta } = data || {};
    const bannerDisplay = meta?.display as GenericBannerDisplay | undefined;

    const handleOpenBannerLink = () => {
            window.open(bannerDisplay?.cta?.href, '_blank');
    };

    if (!data || isDataLoading) {
        return (
        <TileContainer id='generic-banner-tile-loader' className='p-1 flex-col'>
            <div className='mt-32 p-10 tablet:mt-16 mobile:mt-9 mobile:p-4' data-testid='generic-banner-loading'>
                <SkeletonLoader  $height='30px' $width='180px' $marginBottom='10px' $radius='6px' />
                <SkeletonLoader  $height='20px' $width='150px' $marginBottom='16px' $radius='6px' />
                <SkeletonLoader  $height='35px' $width='100px' $marginBottom='16px' $radius='6px' />
            </div>
        </TileContainer>
        )
    }

    return (
        <TileContainer id='generic-banner-tile' className={`p-1 flex-col ${!bannerDisplay && 'hidden'}`}>
            <div className="flex flex-col rounded-2xl  bg-cover bg-no-repeat bg-center" style={{ backgroundImage: bannerDisplay?.backgroundImage && `url(${bannerDisplay.backgroundImage})` }}>
                <div className='mt-32 p-10 tablet:mt-16 mobile:mt-9 mobile:p-4'>
                    <p className='text-[45px] font-medium tablet:leading-[67.5px] desktop:leading-[67.5px] mobile:text-xl mobile:leading-[30px]'>{bannerDisplay?.title && bannerDisplay.title}</p>
                    <p className='font-medium desktop:text-[22px] tablet:text-[22px] tablet:leading-[33px] desktop:leading-[33px] mobile:text-sm'>{bannerDisplay?.subtitle && bannerDisplay.subtitle}</p>
                    {(bannerDisplay?.cta?.text && bannerDisplay?.cta?.href) &&
                    <button className='mt-10 mobile:mt-4' onClick={handleOpenBannerLink}>
                        <p className='font-medium bg-container_grey rounded-md py-3 px-5 mobile:text-sm mobile:py-2 mobile:px-4'>{bannerDisplay.cta.text && bannerDisplay.cta.text}</p>
                    </button>}
                </div>
            </div>
        </TileContainer>
    )
};

export default GenericBannerTile;
