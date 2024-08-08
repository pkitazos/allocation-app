export function extractMatchingDetails(
  allStudents: { id: string; name: string | null }[],
  allProjects: { id: string; title: string }[],
  studentId: string,
  projectId: string,
  studentRank: number,
) {
  const studentIdx = allStudents.findIndex(
    (student) => student.id === studentId,
  );
  if (studentIdx === -1) throw new Error("Student not found");

  const student = allStudents[studentIdx];

  if (projectId === "0") {
    return {
      studentId,
      studentName: student.name!,
      projectId: "-",
      projectTitle: "-",
      studentRank: "-",
    };
  }

  const projectIdx = allProjects.findIndex(
    (project) => project.id === projectId,
  );

  if (projectIdx === -1) throw new Error(`Project not found: ${projectId}`);

  return {
    studentId,
    studentName: student.name!,
    projectId,
    projectTitle: allProjects[projectIdx].title,
    studentRank,
  };
}
