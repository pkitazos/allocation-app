import { Heading, SubHeading } from "@/components/heading";
import { PageWrapper } from "@/components/page-wrapper";

import { api } from "@/lib/trpc/server";
import { InstanceParams } from "@/lib/validations/params";

import { StudentPreferenceDataTable } from "./_components/student-preference-data-table";

interface PageParams extends InstanceParams {
  id: string;
}

export default async function Page({ params }: { params: PageParams }) {
  const studentId = params.id;
  const { user: student } = await api.user.student.getById({
    params,
    studentId,
  });

  const data = await api.user.student.preference.getAll({
    params,
    studentId,
  });

  const role = await api.user.role({ params });

  return (
    <PageWrapper>
      <Heading>{student.name}</Heading>
      <SubHeading>Details</SubHeading>
      <div className="flex flex-col">
        <div className="flex gap-2">
          <span className="w-16 font-semibold text-slate-500">ID:</span>
          <p className="col-span-9">{studentId}</p>
        </div>
        <div className="flex gap-2">
          <span className="w-16 font-semibold text-slate-500">Email:</span>
          <p className="col-span-9">{student.email}</p>
        </div>
      </div>
      <SubHeading>Preferences</SubHeading>
      <StudentPreferenceDataTable
        role={role}
        data={data}
        studentId={studentId}
      />
    </PageWrapper>
  );
}
