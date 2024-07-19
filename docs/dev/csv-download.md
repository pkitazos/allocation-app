## CSV Download

B) build export page

- create a view of the data that will be exported (this could be a data table)
- create a trpc query that computes and formats the relevant matching data to be exported
- create a button that when clicked will format + download said data as a csv

---

1. trpc query fetches data in column shape

2. columns display data in data table

3. function converts column data to csv

4. download button downloads the file

---

```ts
type AllocationInfo = {
  projectInternalId: string;
  projectExternalId: string;
  studentId: string;
  projectTitle: string;
  projectDescription: string;
  projectSpecialTechnicalRequirements: string;
  studentRanking: number;
};
```
