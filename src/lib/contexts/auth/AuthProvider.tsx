'use client';

import { useEffect, useState } from 'react';
import { AuthClient } from '@dfinity/auth-client';

import { createActor } from '@/declarations/myhealth_backend';
import { AuthContext } from '@/lib/contexts/auth';

import type { Result } from 'azle';
import type { ActorSubclass } from '@dfinity/agent';
import type { Error, User, UserPayload } from '@/contract';
import type { _SERVICE } from '@/declarations/myhealth_backend/myhealth_backend.did';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [actor, setActor] = useState<ActorSubclass<_SERVICE> | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const initClient = async (client: AuthClient) => {
    try {
      setIsInitializing(true);
      setAuthClient(client);

      const actor = createActor(process.env.NEXT_PUBLIC_CANISTER_ID_MYHEALTH_BACKEND || '', {
        agentOptions: {
          host: process.env.NEXT_PUBLIC_IC_HOST,
          identity: client.getIdentity(),
        },
      });
      setActor(actor);

      const isCallerAuthenticated = await client.isAuthenticated();
      setIsAuthenticated(isCallerAuthenticated);

      if (!isCallerAuthenticated) {
        setUser(null);
        setIsRegistered(false);
        return;
      }

      const isCallerRegistered = await actor.isCallerRegistered();
      setIsRegistered(isCallerRegistered);

      if (!isCallerRegistered) return setUser(null);

      const user: Result<any, Error> = await actor.getCallerProfile();

      if (user.Err) throw new Error(Object.values(user.Err)[0]);
      setUser(user.Ok);
    } catch (err) {
      await client.logout();
      setAuthClient(client);

      const actor = createActor(process.env.NEXT_PUBLIC_CANISTER_ID_MYHEALTH_BACKEND || '', {
        agentOptions: {
          host: process.env.NEXT_PUBLIC_IC_HOST,
          identity: client.getIdentity(),
        },
      });
      setActor(actor);
      setIsAuthenticated(false);
      setIsRegistered(false);
      setUser(null);

      throw new Error('Terjadi kesalahan, silakan masuk kembali.');
    } finally {
      setIsInitializing(false);
    }
  };

  const signUp = async (payload: UserPayload) => {
    try {
      setIsLoading(true);

      if (!actor) throw new Error('Actor belum diinisialisasi.');

      const user: Result<any, Error> = await actor.createUser(payload);

      if (user.Err) throw new Error(Object.values(user.Err)[0]);
      setUser(user.Ok);
      setIsRegistered(true);
    } catch (err) {
      throw new Error('Terjadi kesalahan, silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async () => {
    try {
      setIsLoading(true);

      if (!authClient) throw new Error('Auth client belum diinisialisasi.');

      await authClient.login({
        identityProvider:
          process.env.NEXT_PUBLIC_DFX_NETWORK === 'ic'
            ? 'https://identity.ic0.app/#authorize'
            : `${process.env.NEXT_PUBLIC_IC_HOST}?canisterId=${process.env.NEXT_PUBLIC_CANISTER_ID_INTERNET_IDENTITY}#authorize`,
        maxTimeToLive: BigInt(12) * BigInt(3_600_000_000_000_000),
        onSuccess: async () => await initClient(authClient),
      });
    } catch (err) {
      throw new Error('Terjadi kesalahan, silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);

      if (!authClient) throw new Error('Auth client belum diinisialisasi.');

      await authClient.logout();
      await initClient(authClient);
    } catch (err) {
      throw new Error('Terjadi kesalahan, silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const refresh = async () => {
    try {
      setIsLoading(true);

      if (!authClient) throw new Error('Auth client belum diinisialisasi.');

      await initClient(authClient);
    } catch (err) {
      throw new Error('Terjadi kesalahan, silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    AuthClient.create({ idleOptions: { disableIdle: true } }).then(
      async (client) => await initClient(client)
    );
  }, []);

  return (
    <AuthContext.Provider
      value={{
        actor,
        user,
        isAuthenticated,
        isRegistered,
        isInitializing,
        isLoading,
        signUp,
        signIn,
        signOut,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
