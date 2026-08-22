// The Gravitas portal that external participants are sent to.
//
// Kept in a plain .ts module rather than beside the modal component: the test
// only needs this constant, and Node can strip types from .ts but cannot parse
// the JSX in a .tsx file, so importing it from the component made
// gravitas-notice.test.mjs fail to load outright. Matches how portal-auth-state
// and team-member-actions are already split from their components.
export const GRAVITAS_PORTAL_URL = "https://gravitas.vit.ac.in";
