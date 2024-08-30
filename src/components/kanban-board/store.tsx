"use client";
import { createContext, useContext, useRef } from "react";
import { createStore, useStore } from "zustand";

import { BoardColumn, ProjectPreference } from "@/lib/validations/board";

interface KanbanBoardProps {
  projects: ProjectPreference[];
  columns: BoardColumn[];
}

export type StateSetter<T> = (fn: (prev: T) => T) => void;

interface KanbanBoardState extends KanbanBoardProps {
  updateProjects: StateSetter<ProjectPreference[]>;
}

type BoardDetailsStore = ReturnType<typeof createBoardDetailsStore>;

const createBoardDetailsStore = (initProps?: Partial<KanbanBoardProps>) => {
  const DEFAULT_PROPS: KanbanBoardProps = {
    projects: [],
    columns: [],
  };

  return createStore<KanbanBoardState>()((set) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    updateProjects: (fn: (prev: ProjectPreference[]) => ProjectPreference[]) =>
      set((state) => ({ projects: fn(state.projects) })),
  }));
};

const KanbanBoardContext = createContext<BoardDetailsStore | null>(null);

export function BoardDetailsProvider({
  children,
  ...props
}: React.PropsWithChildren<KanbanBoardProps>) {
  const storeRef = useRef<BoardDetailsStore>();
  if (!storeRef.current) {
    storeRef.current = createBoardDetailsStore(props);
  }

  return (
    <KanbanBoardContext.Provider value={storeRef.current}>
      {children}
    </KanbanBoardContext.Provider>
  );
}

export function useBoardDetails<T>(
  selector: (state: KanbanBoardState) => T,
): T {
  const store = useContext(KanbanBoardContext);
  if (!store) {
    throw new Error("Missing BoardDetailsProvider in the tree");
  }

  return useStore(store, selector);
}
