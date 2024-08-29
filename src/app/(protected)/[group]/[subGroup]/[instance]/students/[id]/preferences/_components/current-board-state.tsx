"use client";
import { Stage } from "@prisma/client";
import { useParams } from "next/navigation";

import { AccessControl } from "@/components/access-control";
import { BoardDetailsProvider } from "@/components/kanban-board/store";
import { Card, CardContent } from "@/components/ui/card";

import { BoardColumn, ProjectPreference } from "@/lib/validations/board";
import { ProjectTableDataDto } from "@/lib/validations/dto/project";
import { PageParams } from "@/lib/validations/params";

import { KanbanBoardSection } from "./kanban-board-section";
import { NewPreferenceButton } from "./new-preference-button";

export function CurrentBoardState({
  availableProjects,
  initialColumns,
  initialProjects,
}: {
  availableProjects: ProjectTableDataDto[];
  initialColumns: BoardColumn[];
  initialProjects: ProjectPreference[];
}) {
  const params = useParams<PageParams>();
  return (
    <BoardDetailsProvider projects={initialProjects} columns={initialColumns}>
      <section className="flex w-full max-w-7xl flex-col">
        <AccessControl allowedStages={[Stage.PROJECT_SELECTION]}>
          <Card className="my-4">
            <CardContent className="flex items-center justify-between pt-6">
              <p className="font-medium">
                Add new project to student preferences
              </p>
              <NewPreferenceButton availableProjects={availableProjects} />
            </CardContent>
          </Card>
        </AccessControl>
        <KanbanBoardSection studentId={params.id} />
      </section>
    </BoardDetailsProvider>
  );
}
