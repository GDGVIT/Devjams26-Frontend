export interface EventItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

export const EVENTS: EventItem[] = [
  {
    id: 1,
    title: "<> Women Techies’26",
    description: "A 36-hour women-centric hackathon fostering inclusivity, collaboration, and innovation while empowering women to build impactful tech solutions.",
    imageUrl: "https://i.postimg.cc/wMCtzWNn/image-300.png",
  },
  {
    id: 2,
    title: "<> Hexathon’26",
    description: "A beginner-friendly designathon where creativity meets problem-solving, giving participants the space to experiment, create, and turn ideas into impactful designs over 24 hours.",
    imageUrl: "https://i.postimg.cc/Gt8BZ0BR/image-299.png",
  },
  {
    id: 3,
    title: "<> DevJams’25",
    description: "The 8th edition of our flagship hackathon, bringing together 3,500+ registrations and 750+ shortlisted participants to build unconventional ideas and imaginative solutions. The event also featured an insightful guest talk by Mr. John Tony, Software Engineer at Google.",
    imageUrl: "https://i.postimg.cc/gjCwpMhQ/image-301.png",
  }
];
