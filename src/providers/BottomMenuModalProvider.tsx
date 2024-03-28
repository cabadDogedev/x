import React, { createContext, useMemo } from 'react';

// components
import { SendModalData } from '../components/BottomMenuModal/SendModal';

export interface BottomMenuModalContext {
  data: {
    showTransactionConfirmation: (payload: SendModalData) => void;
    showSend: () => void;
    showHistory: () => void;
    showAccount:() => void;
    showApps: () => void;
    hide: () => void;
    active: BottomMenuItem | null;
  }
}

export const ProviderContext = createContext<BottomMenuModalContext | null>(null);

interface BottomMenuSend {
  type: 'send';
  payload?: SendModalData
}

export type BottomMenuItem = {
  type: 'history' | 'account' | 'apps';
} | BottomMenuSend;

const BottomMenuModalProvider = ({ children }: React.PropsWithChildren) => {
  const [activeMenuItem, setActiveMenuItem] = React.useState<BottomMenuItem | null>(null);

  const hide = () => setActiveMenuItem(null);

  const contextData = useMemo(() => ({
    showTransactionConfirmation: (payload?: SendModalData) => setActiveMenuItem({ type: 'send', payload }),
    showSend: () => setActiveMenuItem({ type: 'send' }),
    showHistory: () => setActiveMenuItem({ type: 'history' }),
    showAccount: () => setActiveMenuItem({ type: 'account' }),
    showApps: () => setActiveMenuItem({ type: 'apps' }),
    hide,
    active: activeMenuItem
  }), [activeMenuItem]);

  return (
    <ProviderContext.Provider value={{ data: contextData }}>
      {children}
    </ProviderContext.Provider>
  );
}

export default BottomMenuModalProvider;
