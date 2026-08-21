export type TeamMemberAction = "leave" | "manage" | null;

export function memberActionFor(
  member: { email: string },
  currentEmail: string,
  isLeader: boolean
): TeamMemberAction {
  if (member.email.toLowerCase() === currentEmail.toLowerCase()) {
    return "leave";
  }
  return isLeader ? "manage" : null;
}
