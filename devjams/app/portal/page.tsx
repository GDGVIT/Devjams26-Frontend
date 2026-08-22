import { Metadata } from "next";
import { PortalLogin } from "@/components/portal/PortalLogin";

export const metadata: Metadata = {
  title: "Idea Submission Portal | DevJams’26",
  description: "Login to DevJams’26 Idea Submission Portal for internal VIT students and external participants.",
};

export default function PortalPage() {
  return <PortalLogin />;
}
