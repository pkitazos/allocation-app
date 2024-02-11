export type ProjectDetails = {
  capacityLowerBound: number;
  capacityUpperBound: number;
  allocatedTo: string[];

  // TODO: take supervisor capacities into account
  // supervisor: {
  //   supervisorInstanceDetails: {
  //     projectAllocationLowerBound: number;
  //     projectAllocationTarget: number;
  //     projectAllocationUpperBound: number;
  //   }[];
  // };
};

export type MatchingInfo = {
  profile: number[];
  weight: number;
  isValid: boolean;
  rowValidities: boolean[];
};

export type StudentRow = {
  student: {
    id: string;
    name: string;
  };
  projectPreferences: {
    id: string;
    capacityLowerBound: number;
    capacityUpperBound: number;
    allocatedTo: string[];
    selected: boolean;
  }[];
};

// TODO: remove string indexing
export type RowProject = StudentRow["projectPreferences"][number];
