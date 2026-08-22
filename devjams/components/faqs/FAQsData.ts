export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQCategory {
  id: string;
  name: string;
  items: FAQItem[];
}

export const FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: "general",
    name: "General",
    items: [
      {
        id: "g1",
        question: "Do I need to pay for this hack?",
        answer: "No, registration for this hack is completely free, we believe in making technology accessible to everyone.",
      },
      {
        id: "g2",
        question: "Who is eligible to participate in DevJams’26?",
        answer: "DevJams is open to all university students, developers, designers, and tech enthusiasts regardless of prior experience.",
      },
      {
        id: "g3",
        question: "What is the mode of the event?",
        answer: "The Idea Submission Round is online. Shortlisted teams will then be invited to the offline hackathon at the venue.",
      },
    ],
  },
  {
    id: "registration",
    name: "Registration",
    items: [
      {
        id: "r1",
        question: "What is the maximum team size?",
        answer: "Teams can consist of 2 to 4 members. You can form teams across different courses and academic years.",
      },
      {
        id: "r2",
        question: "How do I register my team?",
        answer: "Click the 'Idea Submission' CTA button at the top of the page to register your team details and initial proposal.",
      },
      {
        id: "r3",
        question: "What if I don’t have a team?",
        answer: "No worries! Head over to our Discord community to connect with potential teammates. Internal and external participants can also team up and participate together.",
      },
    ],
  },
];
