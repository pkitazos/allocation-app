# Access Control

## Specific UI components

### role:admin

- `/[group]`

  - `super-admin` can view admin removal button

- `/[subGroup]`

  - `super-admin` + `group-admin` can view admin removal button
  - `super-admin` + `group-admin` can view admin danger zone

- `/[group]/[subGroup]/[instance]/manual-changes`

  - `super-admin` can enable debug component

- `/[instance]/projects`

  - can view "Actions" column
  - can view checkbox column on data table during `PROJECT_SUBMISSION` stage
  - can view delete button on data table "Actions" column header during `PROJECT_SUBMISSION` stage once they select any number of rows
  - can view delete button in the actions available in each row during `PROJECT_SUBMISSION` stage

- `/[instance]/projects/[id]`

  - can view "Edit or Delete" button during `PROJECT_SUBMISSION` stage

- `/[instance]/students`

  - can view checkbox column on data table during [`SETUP`, `PROJECT_SUBMISSION`, `PROJECT_SELECTION`] stages
  - can view remove button on data table "Actions" column header during [`SETUP`, `PROJECT_SUBMISSION`, `PROJECT_SELECTION`] stages once they select any number of rows
  - can view remove button in the actions available in each row during [`SETUP`, `PROJECT_SUBMISSION`, `PROJECT_SELECTION`] stages

- `/[instance]/supervisors`

  - can view checkbox column on data table during [`SETUP`, `PROJECT_SUBMISSION`, `PROJECT_SELECTION`] stages
  - can view remove button on data table "Actions" column header during [`SETUP`, `PROJECT_SUBMISSION`, `PROJECT_SELECTION`] stages once they select any number of rows
  - can view remove button in the actions available in each row during [`SETUP`, `PROJECT_SUBMISSION`, `PROJECT_SELECTION`] stages

### role:supervisor

- `/[instance]`

  - can view "New Project" button on sidebar during `PROJECT_SUBMISSION`
  - can view "My Allocations" button on sidebar during `ALLOCATION_PUBLICATION`

- `/[instance]/projects`

  - can view "Actions" column
  - can view delete button in the actions available in each row during `PROJECT_SUBMISSION` stage if row contains a project they supervise

- `/[instance]/projects/[id]`

  - can view "Edit or Delete" button during `PROJECT_SUBMISSION` stage if this is a project they supervise

### role:students

- `/[instance]`

  - can view "My Allocation" button on sidebar during `ALLOCATION_PUBLICATION`

- `/[instance]/projects/[id]`

  - can view project Preference button during `PROJECT SUBMISSION` stage
