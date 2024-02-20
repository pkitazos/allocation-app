type Id = string | number;

export type BoardColumn = { id: Id; displayName: string };

export type ProjectPreference = {
  id: Id;
  columnId: Id;
  title: string;
  rank: number;
  supervisorId: string;
  supervisorName: string;
};

export type SortablePreference = {
  id: string;
  title: string;
  rank: number;
  changed?: boolean;
};
