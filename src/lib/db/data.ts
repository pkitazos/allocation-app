import { PreferenceType, Role } from "@prisma/client";
import {
  GenerousAlgorithm,
  GreedyAlgorithm,
  GreedyGenAlgorithm,
  MinCostAlgorithm,
} from "../algorithms";
import { Algorithm } from "../validations/algorithm";

export const flagData = [
  { title: "BSc Computer Science" },
  { title: "BSc Software Engineering" },
  { title: "MSci Computer Science" },
  { title: "MSci Software Engineering" },
  { title: "CS Joint Honours" },
];

export const tagData = [
  { title: "Python" },
  { title: "Java" },
  { title: "C++" },
  { title: "JavaScript" },
  { title: "Ruby" },
  { title: "PHP" },
  { title: "HTML/CSS" },
  { title: "Artificial Intelligence" },
  { title: "Machine Learning" },
  { title: "Data Science" },
  { title: "Web Development" },
  { title: "Mobile App Development" },
  { title: "Cybersecurity" },
  { title: "Databases" },
  { title: "Cloud Computing" },
  { title: "DevOps" },
  { title: "Natural Language Processing" },
  { title: "Computer Vision" },
  { title: "Game Development" },
  { title: "Software Engineering" },
];

export const projectData = [
  {
    id: "0",
    title: "Chatbot Assistant",
    description:
      "An AI-powered chatbot to provide helpful information to users",
  },
  {
    id: "1",
    title: "E-commerce Platform",
    description:
      "An online store with shopping cart, user accounts, and payment processing",
  },
  {
    id: "2",
    title: "Mobile Calendar App",
    description:
      "A calendar app for managing events and reminders on mobile devices",
  },
  {
    id: "3",
    title: "Social Media Dashboard",
    description:
      "An analytics dashboard to track key social media metrics and engagement",
  },
  {
    id: "4",
    title: "Location-Based Travel App",
    description:
      "An app to recommend attractions, restaurants, and accommodations based on the user's location",
  },
  {
    id: "5",
    title: "Customizable CMS",
    description:
      "A content management system that allows easy customization and extensibility",
  },
  {
    id: "6",
    title: "Productivity Chrome Extension",
    description:
      "A browser extension to track time spent on websites and manage tabs",
  },
  {
    id: "7",
    title: "Weather Forecast App",
    description:
      "Real-time weather forecasts and predictive weather alerts for any location",
  },
];

export const invitationData = [
  { userEmail: "super.allocationapp@gmail.com", role: Role.ADMIN },
  { userEmail: "group.allocationapp@gmail.com", role: Role.ADMIN },
  { userEmail: "subgroup.allocationapp@gmail.com", role: Role.ADMIN },
  { userEmail: "supervisor.allocationapp@gmail.com", role: Role.SUPERVISOR },
  { userEmail: "student.allocationapp@gmail.com", role: Role.STUDENT },
];

export const testSuperAdmin = {
  email: "super.allocationapp@gmail.com",
};

export const testGroup = {
  id: "school-of-computing-science",
  displayName: "School of Computing Science",
};

export const testGroupAdmin = {
  email: "group.allocationapp@gmail.com",
};

export const testSubGroup = {
  id: "level-4-individual-project",
  displayName: "Level 4 Individual Project",
};

export const testSubGroupAdmin = {
  email: "subgroup.allocationapp@gmail.com",
};

export const testInstance = {
  id: "2023",
  displayName: "2023",
};

export const testStudent = {
  name: "Eva",
  email: "student.allocationapp@gmail.com",
};

export const studentData = [
  {
    id: "2345678f",
    name: "Frank",
    email: "frank@email.com",
  },
  {
    id: "2345678g",
    name: "Geoff",
    email: "geoff@email.com",
  },
  {
    id: "2345678h",
    name: "Hannah",
    email: "hannha@gmail.com",
  },
  {
    id: "2345678i",
    name: "Isaac",
    email: "isaac@email.com",
  },
  {
    id: "2345678j",
    name: "Jake",
    email: "jake@email.com",
  },
  {
    id: "2345678k",
    name: "Ken",
    email: "ken@email.com",
  },
];

export const testSupervisor = {
  name: "Dan",
  email: "supervisor.allocationapp@gmail.com",
  projectAllocationTarget: 2,
  projectAllocationUpperBound: 3,
};

export const supervisorData = [
  {
    id: "12345e",
    name: "Ellen",
    email: "ellen@email.com",
  },
  {
    id: "12345f",
    name: "Flo",
    email: "flo@email.com",
  },
];

export const supervisorInInstanceData = [
  // {
  //   id: "clrpi3ly90009wuaz4tw9wq0m", // TODO: grab from prisma
  //   projectAllocationTarget: 2,
  //   projectAllocationUpperBound: 3,
  // },
  {
    id: "12345e",
    projectAllocationTarget: 2,
    projectAllocationUpperBound: 2,
  },
  {
    id: "12345f",
    projectAllocationTarget: 2,
    projectAllocationUpperBound: 2,
  },
];

export const preferenceData = [
  { idx: 0, projectId: "0", rank: 1, type: PreferenceType.PREFERENCE },
  { idx: 0, projectId: "6", rank: 2, type: PreferenceType.PREFERENCE },
  { idx: 1, projectId: "0", rank: 1, type: PreferenceType.PREFERENCE },
  { idx: 1, projectId: "1", rank: 2, type: PreferenceType.PREFERENCE },
  { idx: 1, projectId: "2", rank: 3, type: PreferenceType.PREFERENCE },
  { idx: 1, projectId: "3", rank: 4, type: PreferenceType.PREFERENCE },
  { idx: 1, projectId: "4", rank: 5, type: PreferenceType.PREFERENCE },
  { idx: 1, projectId: "5", rank: 6, type: PreferenceType.PREFERENCE },
  { idx: 2, projectId: "1", rank: 1, type: PreferenceType.PREFERENCE },
  { idx: 2, projectId: "0", rank: 2, type: PreferenceType.PREFERENCE },
  { idx: 2, projectId: "3", rank: 3, type: PreferenceType.PREFERENCE },
  { idx: 3, projectId: "1", rank: 1, type: PreferenceType.PREFERENCE },
  { idx: 4, projectId: "0", rank: 1, type: PreferenceType.PREFERENCE },
  { idx: 4, projectId: "1", rank: 2, type: PreferenceType.PREFERENCE },
  { idx: 4, projectId: "2", rank: 3, type: PreferenceType.PREFERENCE },
  { idx: 4, projectId: "3", rank: 4, type: PreferenceType.PREFERENCE },
  { idx: 5, projectId: "1", rank: 1, type: PreferenceType.PREFERENCE },
  { idx: 5, projectId: "2", rank: 2, type: PreferenceType.PREFERENCE },
  { idx: 5, projectId: "3", rank: 3, type: PreferenceType.PREFERENCE },
  { idx: 5, projectId: "4", rank: 4, type: PreferenceType.PREFERENCE },
  { idx: 5, projectId: "5", rank: 5, type: PreferenceType.PREFERENCE },
  { idx: 6, projectId: "4", rank: 1, type: PreferenceType.PREFERENCE },
  { idx: 6, projectId: "2", rank: 2, type: PreferenceType.PREFERENCE },
  { idx: 6, projectId: "7", rank: 3, type: PreferenceType.PREFERENCE },
];

export const allAlgorithms: Algorithm[] = [
  GenerousAlgorithm,
  GreedyAlgorithm,
  MinCostAlgorithm,
  GreedyGenAlgorithm,
];
