import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import axios from 'axios';

// providers
import AllowedAppsProvider from '../../providers/AllowedAppsProvider';

// hooks
import useAllowedApps from '../../hooks/useAllowedApps';

describe('AllowedAppsProvider', () => {
  const allowedAppsMock =  [
    { id: 'allowed-app-1' },
    { id: 'allowed-app-2' },
    { id: 'allowed-app-3' },
  ]

  let wrapper: React.FC;

  beforeEach(() => {
    wrapper = ({ children }: React.PropsWithChildren) => (
      <AllowedAppsProvider>
        {children}
      </AllowedAppsProvider>
    );

    (axios.get as jest.Mock).mockImplementation(() => Promise.resolve({ data: { apps: allowedAppsMock } }));
  });

  it('initializes with empty list and loading state', () => {
    const { result } = renderHook(() => useAllowedApps(), { wrapper });
    expect(result.current.isLoading).toEqual(true);
    expect(result.current.allowed).toEqual([]);
  });

  it('updates list correctly', async () => {
    const { result } = renderHook(() => useAllowedApps(), { wrapper });

    expect(result.current.isLoading).toEqual(true);

    await waitFor(async () => {
      expect(result.current.isLoading).toEqual(false);
    });

    expect(result.current.allowed).toEqual(allowedAppsMock.map(app => app.id));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
