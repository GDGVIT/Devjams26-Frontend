export type TeamMemberAction = "leave" | "request-leave" | "manage" | null;

export function memberActionFor(
  member: { id?: string },
  currentParticipantId: string,
  isLeader: boolean,
  allowMembersToLeave = true,
): TeamMemberAction {
  if (member.id && member.id === currentParticipantId) {
    return isLeader || allowMembersToLeave ? "leave" : "request-leave";
  }
  return isLeader && member.id ? "manage" : null;
}

export function shouldWarnSubmittedIdeaRemoval(
  isSubmitted: boolean,
  memberCount: number,
): boolean {
  return isSubmitted && memberCount === 2;
}
