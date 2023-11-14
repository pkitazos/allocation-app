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
    title: "Chatbot Assistant",
    description:
      "An AI-powered chatbot to provide helpful information to users",
  },
  {
    title: "E-commerce Platform",
    description:
      "An online store with shopping cart, user accounts, and payment processing",
  },
  {
    title: "Mobile Calendar App",
    description:
      "A calendar app for managing events and reminders on mobile devices",
  },
  {
    title: "Social Media Dashboard",
    description:
      "An analytics dashboard to track key social media metrics and engagement",
  },
  {
    title: "Location-Based Travel App",
    description:
      "An app to recommend attractions, restaurants, and accommodations based on the user's location",
  },
  {
    title: "Customizable CMS",
    description:
      "A content management system that allows easy customization and extensibility",
  },
  {
    title: "Productivity Chrome Extension",
    description:
      "A browser extension to track time spent on websites and manage tabs",
  },
  {
    title: "Weather Forecast App",
    description:
      "Real-time weather forecasts and predictive weather alerts for any location",
  },
  {
    title: "Home Automation System",
    description:
      "Controls home appliances, lights, temperature through a central smart home platform",
  },
  {
    title: "Fitness Tracker",
    description: "Tracks daily steps, activity, sleep and other health metrics",
  },
  {
    title: "Task Management App",
    description:
      "Kanban boards, reminders and collaborative features to manage projects and tasks",
  },
  {
    title: "Video Streaming Service",
    description:
      "On-demand video streaming with recommendations and social features",
  },
  {
    title: "Travel Expense Tracker",
    description:
      "Tracks travel expenses, generates reports and reimbursable amounts",
  },
  {
    title: "Online Multiplayer Game",
    description:
      "Competitive or cooperative gameplay in an online persistent world",
  },
  {
    title: "Restaurant Booking Platform",
    description:
      "Table reservations, customer management and payment processing for restaurants",
  },
  {
    title: "Feedback Collection System",
    description:
      "Surveys, interviews and feedback analytics for product development",
  },
  {
    title: "Online Learning Platform",
    description: "Online courses, resources and tools for remote learning",
  },
  {
    title: "Email Marketing Campaigns",
    description:
      "Create, schedule and track email campaigns and analyze engagement",
  },
  {
    title: "Translation Service",
    description: "Translates text and documents between multiple languages",
  },
  {
    title: "Conference Management System",
    description:
      "Manage conference registrations, schedules, payments and attendees",
  },
  {
    title: "Sales Pipeline CRM",
    description:
      "Organize leads, deals and client interactions for sales teams",
  },
  {
    title: "Online Code Editor",
    description:
      "Browser-based code editor with instant previews, sharing and collaboration",
  },
  {
    title: "Data Visualization Platform",
    description: "Interactive data visualizations, dashboards and analytics",
  },
  {
    title: "2D Game Engine",
    description: "A framework for building 2D games across multiple platforms",
  },
  {
    title: "Automated Testing Framework",
    description: "Tools to automate testing of software systems and interfaces",
  },
  {
    title: "Invoice Management System",
    description: "Generate, send and track invoices and accept online payments",
  },
  {
    title: "Password Manager App",
    description: "Securely generate, store and fill passwords across devices",
  },
  {
    title: "Team Collaboration Platform",
    description:
      "Tools for communication, file sharing, task management and collaboration",
  },
  {
    title: "SEO Optimization Tools",
    description: "Tools to optimize websites for search engine discoverability",
  },
  {
    title: "Social Media Analytics",
    description:
      "Insights into social media campaigns, competitors and industry benchmarking",
  },
  {
    title: "Real Estate Listings Platform",
    description: "Search, showcase and manage real estate listings and sales",
  },
  {
    title: "Cryptocurrency Exchange",
    description: "Trade digital currencies and manage crypto wallets",
  },
  {
    title: "Bug and Issue Tracker",
    description:
      "Track software bugs, tasks and feature requests throughout development",
  },
];

export const invitationData = [
  { userEmail: "super.allocationapp@gmail.com", role: Role.SUPER_ADMIN },
  { userEmail: "group.allocationapp@gmail.com", role: Role.GROUP_ADMIN },
  { userEmail: "subgroup.allocationapp@gmail.com", role: Role.SUB_GROUP_ADMIN },
  { userEmail: "supervisor.allocationapp@gmail.com", role: Role.SUPERVISOR },
  { userEmail: "student.allocationapp@gmail.com", role: Role.STUDENT },
];
