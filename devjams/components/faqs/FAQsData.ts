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
        question: "Do i need to pay for this hack?",
        answer: "No, registration for this hack is completely free, we believe in making technology accessible to everyone.",
      },
      {
        id: "g2",
        question: "Who is eligible to participate in DevJams '26?",
        answer: "DevJams is open to all university students, developers, designers, and tech enthusiasts regardless of prior experience.",
      },
      {
        id: "g3",
        question: "What is the mode of the event?",
        answer: "DevJams '26 is hosted in a hybrid format, allowing participants to attend in-person at the venue or contribute remotely.",
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
        answer: "Teams can consist of 1 to 4 members. You can form teams across different courses and academic years.",
      },
      {
        id: "r2",
        question: "How do I register my team?",
        answer: "Click the 'Idea Submission' CTA button at the top of the page to register your team details and initial proposal.",
      },
      {
        id: "r3",
        question: "Can I participate individually without a team?",
        answer: "Yes, solo hackers are welcome! You can also join our Discord community to connect with potential teammates.",
      },
    ],
  },
];
