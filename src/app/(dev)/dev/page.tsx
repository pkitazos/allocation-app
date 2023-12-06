"use client";

const testAllocationData = {
  args: [["-na", "3", "-maxsize", "1", "-gre", "2", "-lsb", "3"]],
  students: [
    [1, 7],
    [1, 2, 3, 4, 5, 6],
    [2, 1, 4],
    [2],
    [1, 2, 3, 4],
    [2, 3, 4, 5, 6],
    [5, 3, 8],
  ],
  projects: [
    [0, 1, 1],
    [0, 1, 1],
    [0, 1, 1],
    [0, 1, 2],
    [0, 1, 2],
    [0, 1, 2],
    [0, 1, 3],
    [0, 1, 3],
  ],
  lecturers: [
    [0, 2, 3],
    [0, 2, 2],
    [0, 2, 2],
  ],
};

export default function Page() {
  console.log({ testAllocationData });
  return <div>dev</div>;
}
