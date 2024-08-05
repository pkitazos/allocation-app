## External Endpoints

1. setup mutations that will hit external endpoints

   - create button that when clicked will call this trpc mutation ("send to project marking server")
   - the mutation will use axios to call the endpoint
   - we will create a zod schema to validate the response
   - we can then use the response to update our db if necessary (i.e when creating projects)

---

there are 2 endpoints that we need to hit

`create_projects`

- Inputs: supervisor_guid, project_name, project_description, project_capacity, is_software_engineer_project, project_type, evaluation_required, special_technical_requirements
  - is_software_engineer_project and evaluation_required can be false, and project_type will be 0 if supervisor defined or 1 if student defined
- Returns: project_id as created by your backend

`assign_students`

- Inputs: student_id, project_id
- Returns: error (0 for no error, 1 for project already at capacity, 2 for anything else)

---

-> we will have a button that we press

-> onClick function calls procedure (mutation) which handles all of the logic

-> the mutation will call the first endpoint, wait for a response, and if successful, it will then call the second endpoint

    1) // gather data for first endpoint call

    2) const res = await axios.post("create_projects")

    3) // validate response

    4) // update db with external system project IDs

    5) // gather data for second endpoint call

    6) await axios.post("assign_students")

---

1. gather data for first endpoint call

- The first endpoint needs information about all of the allocated projects
- One project requires all the information listed below - a schema will need to be created and type inferred

```ts
type ExternalProject = {
  project_id: string; // <-- this one should be our id, which they should return in the response alongside the new id
  supervisor_guid: string;
  project_name: string;
  project_description: string;
  special_technical_requirements: string; // (needs to be added to db)
  project_capacity: number;
  is_software_engineer_project: false; // (subject to change)
  project_type: 0 | 1; // number literal (0 | 1)
  evaluation_required: false;
};
```

- The endpoint payload should be of type ExternalProject[]
- once we have all of this information from the database collected and formatted we are ready to call the external endpoint

<!-- pseudo code here -->

---

2. const res = await axios.post("create_projects")

<!-- pseudo code here -->

---

3. validate response

- the response we get from the call to the external endpoint needs to be safeParsed to ensure type safety

- we need to construct a schema that will validate this response, something like this

```ts
const responseSchema = z.array({
    external_project_id: z.string()
    internal_project_id: z.string()
})
```

<!-- pseudo code here -->

```ts
const result = await axios
  .post("create_projects", payload)
  .then((res) => res.json())
  .then(responseSchema.safeParse);

if (!result.ok) throw new Error();

const internalExternalProjectIdMapping = result.data;

// looks something like this
const internalExternalProjectIdMapping = [
  { internal_id: 123, external_id: "abc" },
  { internal_id: 1234, external_id: "abcd" },
];
```

otherwise handle this error somehow

---

4. update db with external system project IDs

- we now need to update all of the projects with the external id we received

- so we will go through the response.data, find the external_id of each project and update the database to reflect that

    <!-- pseudo code here -->

```ts
for (const project of internalExternalProjectIdMapping) {
  await tx.project.update({
    where: { id: project.internal_id },
    data: { externalId: project.external_id },
  });
}
```

---

5. gather data for second endpoint call

- The second endpoint needs information about all of the matchings
- One matching is represented by a student_id and a project_id

```ts
type StudentProjectMatching = {
  studentId: string;
  projectExternalId: string;
};
```

<!-- pseudo code here -->

- The endpoint payload should be of type StudentProjectMatching[]
- once we have all of this information from the database collected and formatted we are ready to call the external endpoint

---

6. await axios.post("assign_students")

<!-- pseudo code here -->
