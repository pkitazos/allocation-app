"use client";
import {
  MatchingInfo,
  StudentRow,
} from "@/lib/validations/allocation-adjustment";
import { createContext, useContext, useRef } from "react";
import { createStore, useStore } from "zustand";

interface AllocDetailsProps {
  validOverall: boolean;
  rowValidities: boolean[];
  profile: number[];
  weight: number;
  conflictingWith: string[];

  rowConflicts: string[][];
  allOriginalRows: StudentRow[];
  allWorkingRows: StudentRow[];
  visibleRows: StudentRow[];
  changedRows: StudentRow[];
}

interface AllocDetailsState extends AllocDetailsProps {
  setValidOverall: (isValid: boolean) => void;
  setWeight: (weight: number) => void;
  setProfile: (profile: number[]) => void;
  setRowValidities: (validities: boolean[]) => void;
  updateConflicts: (conflicts: string[]) => void;

  updateVisibleRows: (updatedRows: StudentRow[]) => void;
  updateWorkingRows: (updatedRows: StudentRow[]) => void;

  updateMatchingInfo: (rows: MatchingInfo) => void;
  updateRowConflicts: (rows: string[][]) => void;
}

type AllocDetailsStore = ReturnType<typeof createAllocDetailsStore>;

const createAllocDetailsStore = (initProps?: Partial<AllocDetailsProps>) => {
  const DEFAULT_PROPS: AllocDetailsProps = {
    validOverall: true,
    rowValidities: [],
    profile: [],
    weight: NaN,
    conflictingWith: [],

    rowConflicts: [],
    allOriginalRows: [],
    allWorkingRows: [],
    visibleRows: [],
    changedRows: [],
  };
  return createStore<AllocDetailsState>()((set) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    setValidOverall: (val) => set(() => ({ validOverall: val })),
    setRowValidities: (val) => set(() => ({ rowValidities: val })),
    setWeight: (val) => set(() => ({ weight: val })),
    setProfile: (val) => set(() => ({ profile: val })),
    updateConflicts: (val) => set(() => ({ conflictingWith: val })),

    updateVisibleRows: (val) => set(() => ({ visibleRows: val })),
    updateWorkingRows: (val) => set(() => ({ allWorkingRows: val })),

    updateMatchingInfo: (val) => set(() => ({ ...val })),
    updateRowConflicts: (val) => set(() => ({ rowConflicts: val })),
  }));
};

// context stuff

const AllocDetailsContext = createContext<AllocDetailsStore | null>(null);

export function AllocDetailsProvider({
  children,
  ...props
}: React.PropsWithChildren<AllocDetailsProps>) {
  const storeRef = useRef<AllocDetailsStore>();
  if (!storeRef.current) {
    storeRef.current = createAllocDetailsStore(props);
  }

  return (
    <AllocDetailsContext.Provider value={storeRef.current}>
      {children}
    </AllocDetailsContext.Provider>
  );
}

export function useAllocDetails<T>(
  selector: (state: AllocDetailsState) => T,
): T {
  const store = useContext(AllocDetailsContext);
  if (!store) {
    throw new Error("Missing AllocDetailsContext.Provider in the tree");
  }

  return useStore(store, selector);
}
