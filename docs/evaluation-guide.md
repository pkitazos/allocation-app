# Student-Project Allocation App

## Introduction

Thank you for taking the time to perform an evaluation of the [web app](https://spa-app.optimalmatching.com/) I've built as part of my Level 4 Honours Project. The application is a platform aiming to streamline the process of performing Student-Project Allocations for all parties involved.

If you are a UofG CS student, think of this as an updated version of the application we had to use at the start of the year to select and submit a list of projects in order of most to least preferred, given some constraints.

There is an [evaluation form](https://uofg.qualtrics.com/jfe/form/SV_0ezNxahTBLeAfem) with some simple questions that will help me understand whether the user interface and experience is simple and intuitive. You may choose to answer these questions after you've completed all the tasks on the [task sheet](https://github.com/pkitazos/allocation-app/blob/main/docs/evaluation-task-sheet.md), or as you're going through it.

## Evaluator Roles

The platform hosts everything required to perform a student project allocation from scratch, not just the student-facing functionality. As such, you'll be evaluating the project as 3 separate users with 3 distinct roles:

- Admin
- Supervisor
- Student

You've been sent login credentials for the three different user accounts. The task sheet will clearly state when you need to switch from one account to another.

## Project specific language

#### Allocation Instances

The platform is built to be able to host student-project allocation spaces for the entire university, not just a single school. As a result allocation "spaces" are split into `Allocation Groups`, `Allocation Sub-Groups` and `Allocation Instances`, where you can think about `Allocation Groups` being the different schools in the university (School of Computing Science, School of Engineering, etc.), `Allocation Sub-Groups` being the different levels within a school (level 4, level 5, etc.), and `Instances` denoting a particular academic year (2023-2024, 2024-2025, etc.).

#### Matching

This is a specific set of pairings between projects and students that was obtained by running a particular matching algorithm. Different matching algorithms produce different matchings, which have different properties (size, weight, profile). For this evaluation it's not necessary that you understand what the size, weight or profile of a matching is.

An `Allocation Instance` admin might want to run one, or several, matching algorithms and compare the different results obtained to ensure projects are allocated to students and supervisors fairly.

## Evaluation Materials TL;DR

- The web app is hosted at this address: https://spa-app.optimalmatching.com/

- The task sheet can be found [here](https://github.com/pkitazos/allocation-app/blob/main/docs/evaluation-task-sheet.md)

- You should have your sign-in credentials in the email you received when you signed up for this evaluation.

- In that same email you will find two `*.csv` files that you will need while completing the tasks on the task sheet.

- The evaluation form can be found [here](https://uofg.qualtrics.com/jfe/form/SV_0ezNxahTBLeAfem)

- Due to some caching issues I wasn't able to fix everywhere, if it seems like sometimes the application is not updating correctly, try refreshing the page
