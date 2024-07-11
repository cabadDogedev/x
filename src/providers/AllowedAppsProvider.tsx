import axios from 'axios';
import React, { createContext, useEffect, useMemo } from 'react';

export interface AllowedAppsContext {
  data: {
    isLoading: boolean;
    allowed: string[];
  }
}

export const AllowedAppsContext = createContext<AllowedAppsContext | null>(null);

interface ApiAllowedApp {
  appId: string;
}

const AllowedAppsProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [allowed, setAllowed] = React.useState<string[]>([]);

  useEffect(() => {
    let expired = false;

    (async () => {
      try {
        const { data } = await axios.get(
          process.env.REACT_APP_USE_TESTNETS === 'true' ?
          'https://apps-nubpgwxpiq-uc.a.run.app' :
          'https://apps-7eu4izffpa-uc.a.run.app'
        );
        if (expired || !data?.length) {
          setIsLoading(false);
          return;
        }
        setAllowed(data?.map((app: ApiAllowedApp) => app.appId));
      } catch (e) {
        console.warn('Error calling PillarX apps API', e);
      }
      setIsLoading(false);
    })();

    return () => {
      expired = true;
    };
  }, []);

  const contextData = useMemo(() => ({
    isLoading,
    allowed,
  }), [
    isLoading,
    allowed,
  ]);

  return (
    <AllowedAppsContext.Provider value={{ data: contextData }}>
      {children}
    </AllowedAppsContext.Provider>
  );
}

export default AllowedAppsProvider;
