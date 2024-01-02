import { Role } from "@prisma/client";

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
  // {
  //   title: "Home Automation System",
  //   description:
  //     "Controls home appliances, lights, temperature through a central smart home platform",
  // },
  // {
  //   title: "Fitness Tracker",
  //   description: "Tracks daily steps, activity, sleep and other health metrics",
  // },
  // {
  //   title: "Task Management App",
  //   description:
  //     "Kanban boards, reminders and collaborative features to manage projects and tasks",
  // },
  // {
  //   title: "Video Streaming Service",
  //   description:
  //     "On-demand video streaming with recommendations and social features",
  // },
  // {
  //   title: "Travel Expense Tracker",
  //   description:
  //     "Tracks travel expenses, generates reports and reimbursable amounts",
  // },
  // {
  //   title: "Online Multiplayer Game",
  //   description:
  //     "Competitive or cooperative gameplay in an online persistent world",
  // },
  // {
  //   title: "Restaurant Booking Platform",
  //   description:
  //     "Table reservations, customer management and payment processing for restaurants",
  // },
  // {
  //   title: "Feedback Collection System",
  //   description:
  //     "Surveys, interviews and feedback analytics for product development",
  // },
  // {
  //   title: "Online Learning Platform",
  //   description: "Online courses, resources and tools for remote learning",
  // },
  // {
  //   title: "Email Marketing Campaigns",
  //   description:
  //     "Create, schedule and track email campaigns and analyze engagement",
  // },
  // {
  //   title: "Translation Service",
  //   description: "Translates text and documents between multiple languages",
  // },
  // {
  //   title: "Conference Management System",
  //   description:
  //     "Manage conference registrations, schedules, payments and attendees",
  // },
  // {
  //   title: "Sales Pipeline CRM",
  //   description:
  //     "Organize leads, deals and client interactions for sales teams",
  // },
  // {
  //   title: "Online Code Editor",
  //   description:
  //     "Browser-based code editor with instant previews, sharing and collaboration",
  // },
  // {
  //   title: "Data Visualization Platform",
  //   description: "Interactive data visualizations, dashboards and analytics",
  // },
  // {
  //   title: "2D Game Engine",
  //   description: "A framework for building 2D games across multiple platforms",
  // },
  // {
  //   title: "Automated Testing Framework",
  //   description: "Tools to automate testing of software systems and interfaces",
  // },
  // {
  //   title: "Invoice Management System",
  //   description: "Generate, send and track invoices and accept online payments",
  // },
  // {
  //   title: "Password Manager App",
  //   description: "Securely generate, store and fill passwords across devices",
  // },
  // {
  //   title: "Team Collaboration Platform",
  //   description:
  //     "Tools for communication, file sharing, task management and collaboration",
  // },
  // {
  //   title: "SEO Optimization Tools",
  //   description: "Tools to optimize websites for search engine discoverability",
  // },
  // {
  //   title: "Social Media Analytics",
  //   description:
  //     "Insights into social media campaigns, competitors and industry benchmarking",
  // },
  // {
  //   title: "Real Estate Listings Platform",
  //   description: "Search, showcase and manage real estate listings and sales",
  // },
  // {
  //   title: "Cryptocurrency Exchange",
  //   description: "Trade digital currencies and manage crypto wallets",
  // },
  // {
  //   title: "Bug and Issue Tracker",
  //   description:
  //     "Track software bugs, tasks and feature requests throughout development",
  // },
];

export const invitationData = [
  { userEmail: "super.allocationapp@gmail.com", role: Role.SUPER_ADMIN },
  { userEmail: "group.allocationapp@gmail.com", role: Role.GROUP_ADMIN },
  { userEmail: "subgroup.allocationapp@gmail.com", role: Role.SUB_GROUP_ADMIN },
  { userEmail: "supervisor.allocationapp@gmail.com", role: Role.SUPERVISOR },
  { userEmail: "student.allocationapp@gmail.com", role: Role.STUDENT },
];

export const studentData = [
  {
    id: "2345678e",
    name: "Eva",
    email: "student.allocationapp@gmail.com",
  },
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

export const supervisorData = [
  {
    id: "12345d",
    name: "Dan",
    email: "supervisor.allocationapp@gmail.com",
  },
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
  {
    id: "12345d",
    projectAllocationTarget: 2,
    projectAllocationUpperBound: 3,
  },
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
  { idx: 0, projectId: "0", rank: 1, type: "PREFERENCE" },
  { idx: 0, projectId: "6", rank: 2, type: "PREFERENCE" },
  { idx: 1, projectId: "0", rank: 1, type: "PREFERENCE" },
  { idx: 1, projectId: "1", rank: 2, type: "PREFERENCE" },
  { idx: 1, projectId: "2", rank: 3, type: "PREFERENCE" },
  { idx: 1, projectId: "3", rank: 4, type: "PREFERENCE" },
  { idx: 1, projectId: "4", rank: 5, type: "PREFERENCE" },
  { idx: 1, projectId: "5", rank: 6, type: "PREFERENCE" },
  { idx: 2, projectId: "1", rank: 1, type: "PREFERENCE" },
  { idx: 2, projectId: "0", rank: 2, type: "PREFERENCE" },
  { idx: 2, projectId: "3", rank: 3, type: "PREFERENCE" },
  { idx: 3, projectId: "1", rank: 1, type: "PREFERENCE" },
  { idx: 4, projectId: "0", rank: 1, type: "PREFERENCE" },
  { idx: 4, projectId: "1", rank: 2, type: "PREFERENCE" },
  { idx: 4, projectId: "2", rank: 3, type: "PREFERENCE" },
  { idx: 4, projectId: "3", rank: 4, type: "PREFERENCE" },
  { idx: 5, projectId: "1", rank: 1, type: "PREFERENCE" },
  { idx: 5, projectId: "2", rank: 2, type: "PREFERENCE" },
  { idx: 5, projectId: "3", rank: 3, type: "PREFERENCE" },
  { idx: 5, projectId: "4", rank: 4, type: "PREFERENCE" },
  { idx: 5, projectId: "5", rank: 5, type: "PREFERENCE" },
  { idx: 6, projectId: "4", rank: 1, type: "PREFERENCE" },
  { idx: 6, projectId: "2", rank: 2, type: "PREFERENCE" },
  { idx: 6, projectId: "7", rank: 3, type: "PREFERENCE" },
];
