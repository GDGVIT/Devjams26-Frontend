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
    default:
      return "Google sign-in could not be completed. Please try again.";
  }
}
