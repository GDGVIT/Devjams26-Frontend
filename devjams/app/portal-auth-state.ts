export function portalAuthErrorMessage(code: string | null): string {
  switch (code) {
    case "participant_not_registered":
      return "This Google account is not registered for DevJams. Sign in with the account used for registration.";
    case "wrong_google_account":
      return "Internal participant access requires your VIT Google account.";
    case "oauth_state_invalid":
      return "Your Google sign-in session expired. Please start again.";
    case "oauth_not_configured":
      return "Google sign-in is not configured. Please contact the event team.";
    // The cases below are refusals from the self-registration path. Without
    // them every one reads as "could not be completed", which tells someone
    // nothing about what to change before trying again.
    case "participant_type_mismatch":
      return "That Google account does not match the participant type you chose. Use your VIT account for Internal, or a personal account for External.";
    case "registration_number_unavailable":
      return "We could not read your registration number from your VIT account. Its Google name should end with it, as in \"Aman Singh 23BCE0346\". Please contact the event team.";
    case "registration_number_claimed":
      return "Your registration number is already linked to a different Google account. Please contact the event team.";
    case "participant_session_failed":
      return "We could not finish setting up your account. Please try again, and contact the event team if it keeps happening.";
    default:
      return "Google sign-in could not be completed. Please try again.";
  }
}
