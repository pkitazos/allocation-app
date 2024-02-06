type Id = string | number;

export type BoardColumn = { id: Id; displayName: string };

export type ProjectPreference = { id: Id; columnId: Id; title: string };
