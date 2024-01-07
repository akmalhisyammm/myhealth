'use client';

import { createContext } from 'react';

import type { ActorSubclass } from '@dfinity/agent';
import type { User, UserPayload } from '@/contract';
import type { _SERVICE } from '@/declarations/myhealth_backend/myhealth_backend.did';

type Context = {
  actor: ActorSubclass<_SERVICE> | null;
  user: User | null;
  isAuthenticated: boolean;
  isRegistered: boolean;
  isInitializing: boolean;
  isLoading: boolean;
  signUp: (payload: UserPayload) => Promise<void | null>;
  signIn: () => Promise<void | null>;
  signOut: () => Promise<void | null>;
  refresh: () => Promise<void | null>;
};

export const AuthContext = createContext<Context>({
  actor: null,
  user: null,
  isAuthenticated: false,
  isRegistered: false,
  isInitializing: false,
  isLoading: false,
  signUp: async () => null,
  signIn: async () => null,
  signOut: async () => null,
  refresh: async () => null,
});
