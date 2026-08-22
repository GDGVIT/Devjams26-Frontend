import { Metadata } from "next";
import { TeamChoiceView } from "@/components/portal/TeamChoiceView";

export const metadata: Metadata = {
  title: "Dashboard - Join or Create Team | DevJams’26",
  description: "Join an existing team or create a new team for DevJams’26 hackathon.",
};

export default function JoinCreatePage() {
  return <TeamChoiceView />;
}
