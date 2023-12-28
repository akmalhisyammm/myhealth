'use client';

import { createContext } from 'react';

import type { Identity, ActorSubclass } from '@dfinity/agent';
import type { AuthClient } from '@dfinity/auth-client';
import type { Principal } from '@dfinity/principal';
import type { _SERVICE } from '@/declarations/myhealth_backend/myhealth_backend.did';

type Context = {
  authClient: AuthClient | null;
  actor: ActorSubclass<_SERVICE> | null;
  identity: Identity | null;
  principal: Principal | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: () => void;
  signOut: () => void;
};

export const AuthContext = createContext<Context>({
  authClient: null,
  actor: null,
  identity: null,
  principal: null,
  isAuthenticated: false,
  isLoading: true,
  signIn: () => {},
  signOut: () => {},
});
