# lvl 4 Project

## Overview

As part of my fourth year individual project at UofG, I'm building a web app for preference based matching. The web app centralises all the administrative functionality in a single location as well as hosts a platform for supervisors to upload their projects and students to submit preference lists over those projects. It's currently under production.

## Tech Stack

The project is split into 2 repositories:

- `allocation-app`
- `allocation-server`

### allocation-app

The web app is built using:

- NextJS
- TailwindCSS
- NextAuth
- tRPC

### allocation-server

The matching server is built using:

- FastAPI
- Pydantic
- [matchingproblems](https://github.com/fmcooper/matchingproblems)
