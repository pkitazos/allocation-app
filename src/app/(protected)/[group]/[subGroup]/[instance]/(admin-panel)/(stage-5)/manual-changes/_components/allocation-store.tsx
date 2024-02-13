/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import {
  ProjectInfo,
  StudentRow,
} from "@/lib/validations/allocation-adjustment";
import { createContext, useContext, useRef } from "react";
import { createStore, useStore } from "zustand";

interface AllocDetailsProps {
  profile: number[];
  weight: number;

  projects: ProjectInfo[];
  studentsBackup: StudentRow[];
  students: StudentRow[];
  selectedStudentIds: string[];
}

interface AllocDetailsState extends AllocDetailsProps {
  setWeight: (weight: number) => void;
  setProfile: (profile: number[]) => void;

  setSelectedStudentIds: (ids: string[]) => void;
  updateProjects: (projects: ProjectInfo[]) => void;
}

type AllocDetailsStore = ReturnType<typeof createAllocDetailsStore>;

const createAllocDetailsStore = (initProps?: Partial<AllocDetailsProps>) => {
  const DEFAULT_PROPS: AllocDetailsProps = {
    profile: [],
    weight: NaN,

    studentsBackup: [],
    projects: [],
    students: [],
    selectedStudentIds: [],
  };

  return createStore<AllocDetailsState>()((set) => ({
    ...DEFAULT_PROPS,
    ...initProps,

    setWeight: (val) => set(() => ({ weight: val })),
    setProfile: (val) => set(() => ({ profile: val })),

    setSelectedStudentIds: (val) => set(() => ({ selectedStudentIds: val })),
    updateProjects: (projects) => set(() => ({ projects })),
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
