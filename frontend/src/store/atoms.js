import { atomWithStorage } from 'jotai/utils';

// Atom to store policies with localStorage persistence
export const policiesAtom = atomWithStorage('aia_policies', []);
