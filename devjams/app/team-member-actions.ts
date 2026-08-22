export type TeamMemberAction = "leave" | "manage" | null;

export function memberActionFor(
  member: { id?: string },
  currentParticipantId: string,
  isLeader: boolean,
  isTeamLocked = false
): TeamMemberAction {
  if (isTeamLocked) return null;
  if (member.id && member.id === currentParticipantId) {
    return "leave";
  }
  return isLeader && member.id ? "manage" : null;
}
