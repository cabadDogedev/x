// reducer
import {
    setAmountReceive,
    setAmountSwap,
    setReceiveChain,
    setReceiveToken,
    setSwapChain,
    setSwapToken,
} from '../../reducer/theExchangeSlice';

// hooks
import {
    useAppDispatch,
    useAppSelector
} from '../../hooks/useReducerHooks';

// images
import SwapIcon from '../../images/arrow-swap-horizontal.png';
import { AmountType, ChainType } from '../../utils/types';
import { Token } from '@etherspot/prime-sdk/dist/sdk/data';

type SwitchCardsButtonType = {
    onSwap: () => void;
};

const SwitchCardsButton = ({ onSwap }: SwitchCardsButtonType) => {
    const dispatch = useAppDispatch();
    const swapChain = useAppSelector((state) => state.swap.swapChain as ChainType);
    const receiveChain = useAppSelector((state) => state.swap.receiveChain as ChainType);
    const swapToken = useAppSelector((state) => state.swap.swapToken as Token);
    const receiveToken = useAppSelector((state) => state.swap.receiveToken as Token);
    const amountSwap = useAppSelector((state) => state.swap.amountSwap as AmountType);
    const amountReceive = useAppSelector((state) => state.swap.amountReceive as AmountType);

    // swapCards allow the user to switch between Swap and Receive cards
    const swapCardsAction = () => {
        onSwap();
        dispatch(setSwapChain(receiveChain));
        dispatch(setReceiveChain(swapChain));
        dispatch(setSwapToken(receiveToken));
        dispatch(setReceiveToken(swapToken));
        dispatch(setAmountSwap(amountReceive));
        dispatch(setAmountReceive(amountSwap));
    };

    return (
        <button
            onClick={swapCardsAction}
            className="absolute self-center w-[34px] h-[34px] p-2 bg-white rounded-[3px] desktop:p-4 desktop:w-14 desktop:h-14"
        >
            <img src={SwapIcon} className="w-[18px] h-[18px] desktop:w-6 desktop:h-6" />
        </button>
    );
};

export default SwitchCardsButton;
