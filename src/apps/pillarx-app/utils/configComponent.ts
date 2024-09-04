// types
import { ApiLayout } from '../../../types/api';

// components
import AdvertTile from '../components/AdvertTile/AdvertTile';
import EditorialTile from '../components/EditorialTile/EditorialTile';
import GenericBannerTile from '../components/GenericBannerTile/GenericBannerTile';
import PortfolioOverview from '../components/PortfolioOverview/PortfolioOverview';
import TokensHorizontalTile from '../components/TokensHorizontalTile/TokensHorizontalTile';
import TokensVerticalTile from '../components/TokensVerticalTile/TokensVerticalTile';

type TileComponentType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key in ApiLayout]: React.FC<any>;
};
export const componentMap: TileComponentType = {
  [ApiLayout.OVERVIEW]: PortfolioOverview,
  [ApiLayout.TOKENS_HORIZONTAL]: TokensHorizontalTile,
  [ApiLayout.TOKENS_VERTICAL]: TokensVerticalTile,
  [ApiLayout.GENERIC_BANNER]: GenericBannerTile,
  [ApiLayout.EDITORIAL]: EditorialTile,
  [ApiLayout.AD]: AdvertTile,
};
