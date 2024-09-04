"use client";
import { ExportCSVButton } from "@/components/export-csv";

import { AllocationCsvData } from "@/lib/validations/allocation-csv-data";

export function ExportDataButton({ data }: { data: AllocationCsvData[] }) {
  const header = [
    "Project ID",
    "Student GUID",
    "Student Matric.",
    "Student Level",
    "Project Title",
    "Project Description",
    "Project Special Technical Requirements",
    "Student Ranking",
    "Supervisor GUID",
    "Supervisor Name",
  ];

  const exportData = data.map((e) => [
    e.project.id,
    e.student.id,
    e.student.matric,
    e.student.level,
    e.project.title,
    e.project.description,
    e.project.specialTechnicalRequirements,
    e.student.ranking,
    e.supervisor.id,
    e.supervisor.name,
  ]);

  return (
    <ExportCSVButton
      text="Export Data to CSV"
      filename="project_allocation_data"
      header={header}
      data={exportData}
    />
  );
}
