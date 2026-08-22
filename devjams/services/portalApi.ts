// DevJams '26 Idea Submission Portal API Service
// Integrated with Go/PostgreSQL Hackathon Management API

export type ParticipantType = "internal" | "external";

export type TrackType = "android" | "web" | "gemini" | "cloud" | "open-innovation";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  participantType: ParticipantType;
  registrationNumber?: string;
  college?: string;
  phone?: string;
  gender?: string;
  hostelBlock?: string;
  roomNumber?: string;
  collegeName?: string;
  collegeAddress?: string;
  collegeRollNumber?: string;
  isTeamLeader?: boolean;
  teamId?: string | null;
  teamName?: string | null;
  isCheckedIn?: boolean;
  checkedInAt?: string | null;
  token?: string;
  createdAt?: string;
}

export interface BackendParticipantMe {
  id: string;
  name: string;
  email: string;
  participant_type: ParticipantType;
  gender?: string;
  registration_number?: string;
  phone?: string;
  hostel_block?: string;
  room_number?: string;
  college_name?: string;
  college_address?: string;
  college_roll_number?: string;
  is_team_leader?: boolean;
  team_id?: string | null;
  team_name?: string | null;
  checked_in?: boolean;
  checked_in_at?: string | null;
}

export interface BackendTeamMember {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  registration_number?: string;
  registrationNumber?: string;
  role?: string;
  checked_in?: boolean;
  ChikedIn?: boolean;
  is_team_leader?: boolean;
}

export interface BackendTeamIdea {
  short_description: string;
  long_description: string;
  links: string;
  tracks: string;
}

export interface BackendTeam {
  team_id: string;
  team_name: string;
  invite_code?: string;
  idea?: BackendTeamIdea;
  idea_submitted?: boolean;
  round?: number;
  color_mark?: string;
  total_points?: number;
  checked_in?: boolean;
  members: BackendTeamMember[];
}

export interface InternalOnboardingData {
  participantType: "internal";
  name: string;
  registrationNumber: string;
  contactNumber: string;
  email: string;
  gender: string;
  hostelBlock: string;
  roomNumber: string;
}

export interface ExternalOnboardingData {
  participantType: "external";
  name: string;
  contactNumber: string;
  email: string;
  gender: string;
  collegeName: string;
  collegeAddress: string;
  collegeRollNumber: string;
}

export type OnboardingData = InternalOnboardingData | ExternalOnboardingData;

type OnboardingStatus = Pick<
  UserSession,
  | "participantType"
  | "phone"
  | "gender"
  | "hostelBlock"
  | "collegeName"
  | "collegeAddress"
  | "collegeRollNumber"
>;

const hasValue = (value?: string): boolean => Boolean(value?.trim());

export function isOnboardingComplete(session: OnboardingStatus): boolean {
  if (session.participantType === "external") {
    return (
      hasValue(session.phone) &&
      hasValue(session.gender) &&
      hasValue(session.collegeName) &&
      hasValue(session.collegeAddress) &&
      hasValue(session.collegeRollNumber)
    );
  }

  return hasValue(session.phone) && hasValue(session.gender) && hasValue(session.hostelBlock);
}

export function nextPortalRoute(
  session: OnboardingStatus & Pick<UserSession, "teamId">
): string {
  if (session.teamId) return "/team";
  return isOnboardingComplete(session) ? "/portal/join-create" : "/portal/onboarding";
}

export interface TeamMember {
  name: string;
  email: string;
  phone?: string;
  registrationNumber?: string;
  role?: string;
  checked_in?: boolean;
  ChikedIn?: boolean;
}

export interface Team {
  id: string;
  name: string;
  code: string;
  track?: TrackType;
  problem_statement?: string;
  github_link?: string;
  figma_link?: string;
  members: BackendTeamMember[];
  createdAt: string;
}

export type SubmissionStatus = "draft" | "submitted" | "under_review" | "shortlisted" | "rejected";

export interface IdeaSubmission {
  id: string;
  userId: string;
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  leaderRegNo?: string;
  members: BackendTeamMember[];
  track: TrackType;
  title: string;
  shortSummary: string;
  problemStatement: string;
  proposedSolution: string;
  techStack: string[];
  githubUrl?: string;
  figmaUrl?: string;
  demoUrl?: string;
  presentationUrl?: string;
  status: SubmissionStatus;
  isLocked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiHttpError extends Error {
  status?: number;
  data?: unknown;
}

const STORAGE_KEY_TOKEN = "devjams26_jwt_token";
const STORAGE_KEY_SESSION = "devjams26_portal_session";
const STORAGE_KEY_ONBOARDING = "devjams26_portal_onboarding";
const STORAGE_KEY_SUBMISSION = "devjams26_portal_submission";
const STORAGE_KEY_TEAM = "devjams26_portal_team";

export const portalApi = {
  getBaseUrl(): string {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
    if (!baseUrl) {
      throw new Error("NEXT_PUBLIC_BACKEND_URL must be set");
    }
    return baseUrl.replace(/\/+$/, "");
  },

  getEventAccessKey(): string {
    return process.env.NEXT_PUBLIC_EVENT_ACCESS_KEY || "";
  },

  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return (
      localStorage.getItem(STORAGE_KEY_TOKEN) ||
      portalApi.getSession()?.token ||
      null
    );
  },

  setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_TOKEN, token);
    }
  },

  clearToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY_TOKEN);
    }
  },

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const baseUrl = portalApi.getBaseUrl();
    const token = portalApi.getToken();

    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    const url = endpoint.startsWith("http") ? endpoint : `${baseUrl}${endpoint}`;

    const res = await fetch(url, {
      ...options,
      headers,
    });
    let data: unknown = null;
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      try {
        data = await res.json();
      } catch {
        data = null;
      }
    } else {
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }
    }

    if (!res.ok) {
      let errorMsg = `Request failed with status ${res.status}: ${res.statusText}`;
      if (data && typeof data === "object") {
        if ("error" in data && typeof data.error === "string") {
          errorMsg = data.error;
        } else if ("message" in data && typeof data.message === "string") {
          errorMsg = data.message;
        }
      }
      const err: ApiHttpError = new Error(errorMsg);
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data as T;
  },

  googleOAuthStartUrl(type: ParticipantType): string {
    const url = new URL(`${portalApi.getBaseUrl()}/auth/participant/google`);
    url.searchParams.set("participant_type", type);
    return url.toString();
  },

  async completeGoogleLogin(code: string): Promise<UserSession> {
    portalApi.logout();
    const response = await portalApi.request<{
      token: string;
      user: {
        id: string;
        name: string;
        email: string;
        role: string;
        participant_type: ParticipantType;
        registration_number?: string;
      };
    }>("/auth/participant/google/exchange", {
      method: "POST",
      body: JSON.stringify({ code }),
    });

    if (!response.token) {
      throw new Error("Google sign-in did not return an access token.");
    }
    portalApi.setToken(response.token);

    const profile = await portalApi.fetchMe();
    if (!profile || profile.email.toLowerCase() !== response.user.email.toLowerCase()) {
      portalApi.logout();
      throw new Error("Could not load the authenticated participant profile.");
    }
    profile.token = response.token;
    portalApi.saveSession(profile);
    return profile;
  },

  // Client-side authentication with Go backend POST /auth/participant
  async loginParticipant(email: string, accessKey?: string): Promise<UserSession> {
    const cleanedEmail = email.trim().toLowerCase();
    const key = accessKey || portalApi.getEventAccessKey();

    try {
      const resp = await portalApi.request<{
        token: string;
        user: {
          id: string;
          name: string;
          email: string;
          role: string;
          participant_type: ParticipantType;
          registration_number?: string;
        };
      }>("/auth/participant", {
        method: "POST",
        body: JSON.stringify({
          email: cleanedEmail,
          access_key: key,
        }),
      });

      if (!resp.token) {
        throw new Error("Authentication did not return an access token.");
      }
      portalApi.setToken(resp.token);

      // Fetch fresh participant profile from GET /participant/me
      const profile = await portalApi.fetchMe();
      if (profile) {
        if (resp.token) profile.token = resp.token;
        portalApi.saveSession(profile);
        return profile;
      }

      // The authentication response remains usable when a profile refresh is unavailable.
      const session: UserSession = {
        id: resp.user.id,
        name: resp.user.name,
        email: resp.user.email,
        participantType: resp.user.participant_type,
        ...(resp.user.participant_type === "internal"
          ? { registrationNumber: resp.user.registration_number }
          : {}),
        token: resp.token,
        createdAt: new Date().toISOString(),
      };
      portalApi.saveSession(session);
      return session;
    } catch (err: unknown) {
      throw err instanceof Error ? err : new Error("Participant authentication failed.");
    }
  },

  // Internal Login alias
  async loginInternal(data: {
    email: string;
    registrationNumber?: string;
    password?: string;
    accessKey?: string;
  }): Promise<UserSession> {
    const session = await portalApi.loginParticipant(data.email, data.accessKey);
    if (data.registrationNumber) {
      session.registrationNumber = data.registrationNumber.trim().toUpperCase();
      portalApi.saveSession(session);
    }
    return session;
  },

  // External Login alias
  async loginExternal(data: {
    name: string;
    email: string;
    college?: string;
    phone?: string;
    accessKey?: string;
  }): Promise<UserSession> {
    const session = await portalApi.loginParticipant(data.email, data.accessKey);
    if (data.name) session.name = data.name.trim();
    if (data.college) session.college = data.college.trim();
    if (data.phone) session.phone = data.phone.trim();
    portalApi.saveSession(session);
    return session;
  },

  // Fetch participant profile from GET /participant/me
  async fetchMe(): Promise<UserSession | null> {
    try {
      const data = await portalApi.request<BackendParticipantMe>("/participant/me", {
        method: "GET",
      });

      const session: UserSession = {
        id: data.id,
        name: data.name,
        email: data.email,
        participantType: data.participant_type,
        ...(data.participant_type === "internal"
          ? {
              registrationNumber: data.registration_number,
              hostelBlock: data.hostel_block,
              roomNumber: data.room_number,
            }
          : {
              collegeName: data.college_name,
              collegeAddress: data.college_address,
              collegeRollNumber: data.college_roll_number,
            }),
        gender: data.gender,
        phone: data.phone,
        isTeamLeader: data.is_team_leader,
        teamId: data.team_id,
        teamName: data.team_name,
        isCheckedIn: data.checked_in,
        checkedInAt: data.checked_in_at,
        token: portalApi.getToken() || undefined,
        createdAt: new Date().toISOString(),
      };

      portalApi.saveSession(session);
      return session;
    } catch (err: unknown) {
      console.warn("fetchMe error:", err);
      return portalApi.getSession();
    }
  },

  // Fetch team from GET /participant/team
  async fetchTeam(): Promise<BackendTeam | null> {
    try {
      const data = await portalApi.request<BackendTeam>("/participant/team", {
        method: "GET",
      });

      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY_TEAM, JSON.stringify(data));
      }
      return data;
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.warn("fetchTeam error:", errMsg);
      // Fallback to local storage if offline
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem(STORAGE_KEY_TEAM);
        if (raw) {
          try {
            return JSON.parse(raw) as BackendTeam;
          } catch {}
        }
      }
      return null;
    }
  },

  async getParticipantTeam(): Promise<BackendTeam | null> {
    return portalApi.fetchTeam();
  },
  // Join a team with its six-character case-insensitive invite code.
  async joinTeam(inviteCode: string): Promise<{ team_id: string; team_name: string; team_size: number }> {
    const normalizedInviteCode = inviteCode.trim().toUpperCase();
    if (!/^[A-Z0-9]{6}$/.test(normalizedInviteCode)) {
      throw new Error("Enter the six-character alphanumeric invite code.");
    }

    const response = await portalApi.request<{
      message: string;
      team_id: string;
      team_name: string;
      team_size: number;
    }>("/participant/team/join", {
      method: "POST",
      body: JSON.stringify({ invite_code: normalizedInviteCode }),
    });

    const session = portalApi.getSession();
    if (session) {
      session.teamId = response.team_id;
      session.teamName = response.team_name;
      session.isTeamLeader = false;
      portalApi.saveSession(session);
    }
    await portalApi.fetchTeam();
    return response;
  },

  async transferTeamLeadership(memberId: string): Promise<void> {
    await portalApi.request<unknown>("/participant/team/leader", {
      method: "PATCH",
      body: JSON.stringify({ member_id: memberId }),
    });
    const session = portalApi.getSession();
    if (session) {
      session.isTeamLeader = false;
      portalApi.saveSession(session);
    }
  },

  async removeTeamMember(memberId: string): Promise<void> {
    await portalApi.request<unknown>("/participant/team/members", {
      method: "DELETE",
      body: JSON.stringify({ member_id: memberId }),
    });
  },

  async leaveTeam(): Promise<void> {
    await portalApi.request<unknown>("/participant/team/membership", {
      method: "DELETE",
    });
    const session = portalApi.getSession();
    if (session) {
      session.teamId = null;
      session.teamName = null;
      session.isTeamLeader = false;
      portalApi.saveSession(session);
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY_TEAM);
    }
  },


  // Create team via POST /participant/team
  async createTeam(
    name: string,
    members: Array<{ registration_number?: string; email?: string }> = []
  ): Promise<{ team_id: string; team_name: string; invite_code: string; team_size: number }> {
    try {
      const resp = await portalApi.request<{
        message: string;
        team_id: string;
        team_name: string;
        invite_code: string;
        team_size: number;
      }>("/participant/team", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          members,
        }),
      });

      // Update local session
      const session = portalApi.getSession();
      if (session) {
        session.teamId = resp.team_id;
        session.teamName = resp.team_name;
        session.isTeamLeader = true;
        portalApi.saveSession(session);
      }

      // Refresh team data
      await portalApi.fetchTeam().catch(() => null);

      return resp;
    } catch (err: unknown) {
      const httpErr = err as ApiHttpError;
      if (httpErr?.status === 409) {
        throw new Error("You already belong to a team or this team name is taken");
      }
      if (httpErr?.status === 400 || httpErr?.status === 404 || httpErr?.status === 401) {
        throw err;
      }

      const errMsg = err instanceof Error ? err.message : String(err);
      console.warn("createTeam backend unavailable, using local mock:", errMsg);
      const teamId = `team_${Date.now()}`;
      const session = portalApi.getSession();
      if (session) {
        session.teamId = teamId;
        session.teamName = name.trim();
        session.isTeamLeader = true;
        portalApi.saveSession(session);
      }

      const mockInviteCode = Date.now().toString(36).slice(-6).toUpperCase().padStart(6, "0");
      const mockTeam: BackendTeam = {
        team_id: teamId,
        team_name: name.trim(),
        invite_code: mockInviteCode,
        round: 1,
        checked_in: false,
        members: [
          {
            name: session?.name || "Team Leader",
            email: session?.email || "leader@vitstudent.ac.in",
            registration_number: session?.registrationNumber,
            checked_in: false,
          },
        ],
      };

      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY_TEAM, JSON.stringify(mockTeam));
      }

      return {
        team_id: teamId,
        team_name: name.trim(),
        invite_code: mockInviteCode,
        team_size: 1,
      };
    }
  },

  // Save Team (legacy helper)
  async saveTeam(teamData: {
    name: string;
    code?: string;
    track?: TrackType;
    members?: BackendTeamMember[];
  }): Promise<Team> {
    const team: Team = {
      id: `team_${Date.now()}`,
      name: teamData.name,
      code: teamData.code || "DJ26-" + Math.floor(1000 + Math.random() * 9000),
      track: teamData.track || "web",
      members: teamData.members || [],
      createdAt: new Date().toISOString(),
    };
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_TEAM, JSON.stringify(team));
    }
    return team;
  },

  // Submit all idea fields atomically through the upstream team-idea contract.
  async submitIdea(idea: BackendTeamIdea): Promise<{ message: string }> {
    try {
      const resp = await portalApi.request<{ message: string }>("/participant/team/idea", {
        method: "PATCH",
        body: JSON.stringify(idea),
      });
      await portalApi.fetchTeam().catch(() => null);
      return resp;
    } catch (err: unknown) {
      const httpErr = err as ApiHttpError;
      if ([400, 401, 403, 404, 409].includes(httpErr?.status ?? 0)) {
        throw err;
      }

      const errMsg = err instanceof Error ? err.message : String(err);
      console.warn("submitIdea backend unavailable, using local mock:", errMsg);
      const team = await portalApi.fetchTeam();
      if (team) {
        team.idea = idea;
        team.idea_submitted = true;
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY_TEAM, JSON.stringify(team));
        }
      }
      return { message: "idea submitted" };
    }
  },

  // Save only mutable onboarding fields. Name, registration number, and email
  // are always the authenticated participant identity returned by the backend.
  async saveOnboarding(data: OnboardingData): Promise<UserSession> {
    const profileUpdate = data.participantType === "external"
      ? {
          phone: data.contactNumber.trim(),
          gender: data.gender.trim(),
          college_name: data.collegeName.trim(),
          college_address: data.collegeAddress.trim(),
          college_roll_number: data.collegeRollNumber.trim(),
        }
      : {
          phone: data.contactNumber.trim(),
          gender: data.gender.trim(),
          hostel_block: data.hostelBlock.trim(),
          room_number: data.roomNumber.trim(),
        };

    await portalApi.request<void>("/participant/me", {
      method: "PATCH",
      body: JSON.stringify(profileUpdate),
    });
    const session = await portalApi.fetchMe();
    if (!session) {
      throw new Error("Could not refresh the authenticated participant profile.");
    }
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_ONBOARDING, JSON.stringify({
        ...data,
        name: session.name,
        registrationNumber: session.registrationNumber || "",
        email: session.email,
      }));
    }
    return session;
  },

  getOnboarding(): OnboardingData | null {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(STORAGE_KEY_ONBOARDING);
      if (raw) {
        try {
          const data = JSON.parse(raw) as Partial<OnboardingData>;
          if (data.participantType === "internal" || data.participantType === "external") {
            return data as OnboardingData;
          }
        } catch {}
      }
    }
    const session = portalApi.getSession();
    if (!session) return null;

    const identity = {
      name: session.name || "",
      registrationNumber: session.registrationNumber || "",
      contactNumber: session.phone || "",
      email: session.email || "",
      gender: session.gender || "",
    };
    return session.participantType === "external"
      ? {
          ...identity,
          participantType: "external",
          collegeName: session.collegeName || "",
          collegeAddress: session.collegeAddress || "",
          collegeRollNumber: session.collegeRollNumber || "",
        }
      : {
          ...identity,
          participantType: "internal",
          hostelBlock: session.hostelBlock || "",
          roomNumber: session.roomNumber || "",
        };
  },

  saveSession(session: UserSession): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
      if (session.token) {
        localStorage.setItem(STORAGE_KEY_TOKEN, session.token);
      }
    }
  },

  getSession(): UserSession | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UserSession;
    } catch {
      return null;
    }
  },

  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY_SESSION);
      localStorage.removeItem(STORAGE_KEY_TOKEN);
      localStorage.removeItem(STORAGE_KEY_TEAM);
      localStorage.removeItem(STORAGE_KEY_SUBMISSION);
      localStorage.removeItem(STORAGE_KEY_ONBOARDING);
    }
  },

  // Idea Submissions state helpers
  async getSubmission(userId?: string): Promise<IdeaSubmission | null> {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(STORAGE_KEY_SUBMISSION);
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as IdeaSubmission;
          if (userId && parsed.userId && parsed.userId !== userId) {
            return null;
          }
          return parsed;
        } catch {
          return null;
        }
      }
    }
    return null;
  },

  async saveSubmission(
    submission: Partial<IdeaSubmission>,
    isDraft = true
  ): Promise<IdeaSubmission> {
    const session = portalApi.getSession();
    const existing = await portalApi.getSubmission(session?.id);

    const updatedSubmission: IdeaSubmission = {
      id: existing?.id || `sub_${Date.now()}`,
      userId: session?.id || "guest",
      teamName: submission.teamName || existing?.teamName || "",
      leaderName: submission.leaderName || session?.name || existing?.leaderName || "",
      leaderEmail: submission.leaderEmail || session?.email || existing?.leaderEmail || "",
      leaderPhone: submission.leaderPhone || session?.phone || existing?.leaderPhone || "",
      leaderRegNo:
        submission.leaderRegNo ||
        session?.registrationNumber ||
        existing?.leaderRegNo ||
        "",
      members: submission.members || existing?.members || [],
      track: submission.track || existing?.track || "web",
      title: submission.title || existing?.title || "",
      shortSummary: submission.shortSummary || existing?.shortSummary || "",
      problemStatement: submission.problemStatement || existing?.problemStatement || "",
      proposedSolution: submission.proposedSolution || existing?.proposedSolution || "",
      techStack: submission.techStack || existing?.techStack || [],
      githubUrl: submission.githubUrl ?? existing?.githubUrl,
      figmaUrl: submission.figmaUrl ?? existing?.figmaUrl,
      demoUrl: submission.demoUrl ?? existing?.demoUrl,
      presentationUrl: submission.presentationUrl ?? existing?.presentationUrl,
      status: isDraft ? "draft" : "submitted",
      isLocked: submission.isLocked ?? existing?.isLocked ?? false,
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_SUBMISSION, JSON.stringify(updatedSubmission));
    }
    return updatedSubmission;
  },

  getTrackDetails(track: TrackType) {
    const tracks: Record<
      TrackType,
      { name: string; icon: string; description: string; color: string }
    > = {
      android: {
        name: "Android Development",
        icon: "/assets/android.svg",
        description:
          "Mobile applications, Kotlin/Compose, native devices, and on-device intelligent experiences.",
        color: "from-green-500/20 to-emerald-500/10 border-green-500/30 text-green-400",
      },
      web: {
        name: "Web Development",
        icon: "/assets/web.svg",
        description:
          "Modern, responsive, high-performance web applications, progressive web apps, and web tooling.",
        color: "from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-400",
      },
      gemini: {
        name: "AI / ML & Gemini",
        icon: "/assets/gemini.svg",
        description:
          "Generative AI, multimodal applications, agents, intelligent workflows, and machine learning models.",
        color: "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400",
      },
      cloud: {
        name: "Cloud & DevOps",
        icon: "/assets/cloud.svg",
        description:
          "Scalable cloud architectures, serverless, microservices, containerization, and distributed systems.",
        color: "from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-400",
      },
      "open-innovation": {
        name: "Open Innovation",
        icon: "/assets/logo/openinnovation.svg",
        description:
          "Disruptive multidisciplinary solutions, hardware/IoT, fintech, healthtech, and creative hacks.",
        color: "from-rose-500/20 to-pink-500/10 border-rose-500/30 text-rose-400",
      },
    };
    return tracks[track] || tracks.web;
  },
};
