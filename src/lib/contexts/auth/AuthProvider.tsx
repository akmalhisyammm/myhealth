'use client';

import { useEffect, useState } from 'react';
import { AuthClient } from '@dfinity/auth-client';

import { AuthContext } from './AuthContext';
import { createActor } from '@/declarations/myhealth_backend';

import type { ActorSubclass, Identity } from '@dfinity/agent';
import type { Principal } from '@dfinity/principal';
import type { _SERVICE } from '@/declarations/myhealth_backend/myhealth_backend.did';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [actor, setActor] = useState<ActorSubclass<_SERVICE> | null>(null);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [principal, setPrincipal] = useState<Principal | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const initializeClient = async (client: AuthClient) => {
    const isAuthenticated = await client.isAuthenticated();
    setIsAuthenticated(isAuthenticated);

    const identity = client.getIdentity();
    setIdentity(identity);

    const principal = identity.getPrincipal();
    setPrincipal(principal);

    const actor = createActor(process.env.NEXT_PUBLIC_CANISTER_ID_MYHEALTH_BACKEND || '', {
      agentOptions: {
        host: process.env.NEXT_PUBLIC_IC_HOST,
        identity,
      },
    });

    setActor(actor);
    setAuthClient(client);
  };

  const signIn = async () => {
    if (!authClient) return;

    setIsLoading(true);

    await authClient.login({
      identityProvider:
        process.env.NEXT_PUBLIC_DFX_NETWORK === 'ic'
          ? 'https://identity.ic0.app/#authorize'
          : `${process.env.NEXT_PUBLIC_IC_HOST}?canisterId=${process.env.NEXT_PUBLIC_CANISTER_ID_INTERNET_IDENTITY}#authorize`,
      maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
      onSuccess: async () => await initializeClient(authClient),
    });

    setIsLoading(false);
  };

  const signOut = async () => {
    if (!authClient) return;

    setIsLoading(true);

    await authClient.logout();
    await initializeClient(authClient);

    setIsLoading(false);
  };

  useEffect(() => {
    AuthClient.create()
      .then(async (client) => await initializeClient(client))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authClient,
        actor,
        identity,
        principal,
        isAuthenticated,
        isLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
