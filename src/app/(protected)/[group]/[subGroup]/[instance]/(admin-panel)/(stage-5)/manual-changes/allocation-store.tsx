"use client";
import { createContext, useContext, useRef } from "react";
import { createStore, useStore } from "zustand";

interface AllocationDetailsProps {
  isValid: boolean;
  rowValidities: boolean[];
  profile: number[];
  weight: number;
  conflictingWith: string[];
}

interface AllocationDetailsState extends AllocationDetailsProps {
  setValidity: (isValid: boolean) => void;
  setWeight: (weight: number) => void;
  setProfile: (profile: number[]) => void;
  setRowValidities: (validities: boolean[]) => void;
  updateConflicts: (conflicts: string[]) => void;
}

type AllocationDetailsStore = ReturnType<typeof createAllocationDetailsStore>;

const createAllocationDetailsStore = (
  initProps?: Partial<AllocationDetailsProps>,
) => {
  const DEFAULT_PROPS: AllocationDetailsProps = {
    isValid: true,
    rowValidities: [],
    profile: [],
    weight: NaN,
    conflictingWith: [],
  };
  return createStore<AllocationDetailsState>()((set) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    setValidity: (val) => set(() => ({ isValid: val })),
    setRowValidities: (val) => set(() => ({ rowValidities: val })),
    setWeight: (val) => set(() => ({ weight: val })),
    setProfile: (val) => set(() => ({ profile: val })),
    updateConflicts: (val) => set(() => ({ conflictingWith: val })),
  }));
};

// context stuff

const AllocDetailsContext = createContext<AllocationDetailsStore | null>(null);

export function AllocDetailsProvider({
  children,
  ...props
}: React.PropsWithChildren<AllocationDetailsProps>) {
  const storeRef = useRef<AllocationDetailsStore>();
  if (!storeRef.current) {
    storeRef.current = createAllocationDetailsStore(props);
  }

  return (
    <AllocDetailsContext.Provider value={storeRef.current}>
      {children}
    </AllocDetailsContext.Provider>
  );
}

export function useAllocDetailsContext<T>(
  selector: (state: AllocationDetailsState) => T,
): T {
  const store = useContext(AllocDetailsContext);
  if (!store) {
    throw new Error("Missing AllocDetailsContext.Provider in the tree");
  }

  return useStore(store, selector);
}
