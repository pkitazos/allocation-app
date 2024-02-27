# Student-Project Allocation App

## Introduction

Thank you for taking the time to perform an evaluation of the web app I've built as part of my Level 4 Honours Project. The application is a platform aiming to streamline the process of performing Student-Project Allocations.

If you are a UofG CS student, think of this as an updated version of the application we had to use at the start of the year to select and submit a list of projects in order of most to least preferred, given some additional constraints.

The platform hosts not only the student-facing functionality, but everything necessary to perform a student project allocation from scratch.

## Evaluator Roles

As such, you'll be evaluating the project as 3 separate users with 3 distinct roles:

- Admin
- Supervisor
- Student

You've been sent login credentials for the three different user accounts. The task sheet (found here) will clearly state when you need to switch from one account to another.

There is an evaluation form (found here) with some simple questions to understand whether the user interface and experience is simple and intuitive. You may choose to answer these questions after you've completed all the tasks on the task sheet, or as you're going through it.

## Project specific language

#### Allocation Instances

The platform is built to be able to host student project allocation for the entire university, not just a single school. As a result allocation "spaces" are split into `Allocation Groups`, `Allocation Sub-Groups` and `Allocation Instances`, where you can think about `Allocation Groups` being the different schools in the university (School of Computing Science, School of Engineering, etc.), `Allocation Sub-Groups` being the different levels within a school (level 4, level 5, etc.), and `Instances` denoting a particular academic year.

#### Matching

This is a specific matching between projects and students that was obtained by running a particular matching algorithm. Different matching algorithms produce different matchings, which have different properties (size, weight, profile). An `Allocation Instance` admin might want to run one, or several, matching algorithms and compare the different results obtained to ensure projects are allocated to students and supervisors fairly.
