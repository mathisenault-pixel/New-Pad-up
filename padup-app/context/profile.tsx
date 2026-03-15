import React, { createContext, useContext, useState } from 'react';

export type Profile = {
  name: string;
  handle: string;
  location: string;
  since: string;
  level: string;
};

type ProfileCtx = {
  profile: Profile;
  updateProfile: (p: Partial<Profile>) => void;
};

const DEFAULT: Profile = {
  name: 'Thomas Mercier',
  handle: '@thomasmercier',
  location: 'Paris',
  since: '2019',
  level: '7',
};

const Ctx = createContext<ProfileCtx>({
  profile: DEFAULT,
  updateProfile: () => {},
});

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile>(DEFAULT);

  function updateProfile(p: Partial<Profile>) {
    setProfile((prev) => ({ ...prev, ...p }));
  }

  return (
    <Ctx.Provider value={{ profile, updateProfile }}>
      {children}
    </Ctx.Provider>
  );
}

export function useProfile() {
  return useContext(Ctx);
}
