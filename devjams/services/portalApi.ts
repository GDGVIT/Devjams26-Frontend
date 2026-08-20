// DevJams '26 Idea Submission Portal API Service
// Integrated with Hackathon Management API

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
  isCheckedIn?: boolean;
  token?: string;
  createdAt: string;
}

export interface InternalOnboardingData {
  name: string;
  registrationNumber: string;
  contactNumber: string;
  email: string;
  gender: string;
  hostelBlock: string;
  roomNumber: string;
}

export interface TeamMember {
  name: string;
  email: string;
  phone?: string;
  registrationNumber?: string;
  role: string;
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
  members: TeamMember[];
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
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const ACCESS_KEY = process.env.NEXT_PUBLIC_ACCESS_KEY || "test-access";
const STORAGE_KEY_SESSION = "devjams26_portal_session";
const STORAGE_KEY_SUBMISSION = "devjams26_portal_submission";

export const portalApi = {
  // Authentication via POST /auth/participant
  async loginParticipant(email: string, accessKey = ACCESS_KEY): Promise<UserSession> {
    const cleanedEmail = email.trim().toLowerCase();
    const isInternal = cleanedEmail.endsWith("@vitstudent.ac.in") || cleanedEmail.endsWith("@vit.ac.in");

    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/participant`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: cleanedEmail,
            access_key: accessKey,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ message: "Authentication failed" }));
          throw new Error(errorData.message || `Login failed with status ${res.status}`);
        }

        const data = await res.json();
        const token = data.token;

        // Fetch participant profile via GET /participant/me
        let profile: any = null;
        if (token) {
          try {
            profile = await portalApi.getParticipantProfile(token);
          } catch (e) {
            console.warn("Could not fetch participant profile:", e);
          }
        }

        const session: UserSession = {
          id: profile?.id || `user_${Date.now()}`,
          name: profile?.name || cleanedEmail.split("@")[0].replace(".", " ").toUpperCase(),
          email: cleanedEmail,
          participantType: isInternal ? "internal" : "external",
          registrationNumber: profile?.registration_number || profile?.reg_no || (isInternal ? "23BCE" + Math.floor(1000 + Math.random() * 9000) : undefined),
          college: profile?.college || (isInternal ? "Vellore Institute of Technology, Vellore" : "External Institution"),
          phone: profile?.phone || profile?.contact_number,
          isCheckedIn: profile?.is_checked_in ?? false,
          token: token,
          createdAt: new Date().toISOString(),
        };

        portalApi.saveSession(session);
        return session;
      } catch (err: any) {
        console.error("API error during login, falling back to local session:", err);
        // If API fails or is unreachable, throw or fallback gracefully
        if (err.message && !err.message.includes("Failed to fetch")) {
          throw err;
        }
      }
    }

    // Client-side session fallback
    const session: UserSession = {
      id: `${isInternal ? "int" : "ext"}_${Date.now()}`,
      name: cleanedEmail.split("@")[0].replace(".", " ").toUpperCase(),
      email: cleanedEmail,
      participantType: isInternal ? "internal" : "external",
      registrationNumber: isInternal ? "23BCE" + Math.floor(1000 + Math.random() * 9000) : undefined,
      college: isInternal ? "Vellore Institute of Technology, Vellore" : "External Institution",
      token: "mock_jwt_" + Date.now(),
      createdAt: new Date().toISOString(),
    };
    portalApi.saveSession(session);
    return session;
  },

  // Profile lookup via GET /participant/me
  async getParticipantProfile(token?: string): Promise<any> {
    const currentToken = token || portalApi.getSession()?.token;
    if (!API_BASE_URL || !currentToken) return null;

    const res = await fetch(`${API_BASE_URL}/participant/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch profile (Status: ${res.status})`);
    }

    return await res.json();
  },

  // Internal Login alias
  async loginInternal(data: { email: string; registrationNumber?: string; password?: string }): Promise<UserSession> {
    const session = await portalApi.loginParticipant(data.email);
    if (data.registrationNumber) {
      session.registrationNumber = data.registrationNumber;
      portalApi.saveSession(session);
    }
    return session;
  },

  // External Login alias
  async loginExternal(data: { name: string; email: string; college?: string; phone?: string }): Promise<UserSession> {
    const session = await portalApi.loginParticipant(data.email);
    if (data.name) session.name = data.name;
    if (data.college) session.college = data.college;
    if (data.phone) session.phone = data.phone;
    portalApi.saveSession(session);
    return session;
  },

  // Save Onboarding details
  async saveInternalOnboarding(data: InternalOnboardingData): Promise<UserSession> {
    const existing = portalApi.getSession();
    const session: UserSession = {
      id: existing?.id || `int_${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      participantType: "internal",
      registrationNumber: data.registrationNumber.trim().toUpperCase(),
      college: "Vellore Institute of Technology, Vellore",
      phone: data.contactNumber.trim(),
      gender: data.gender.trim(),
      hostelBlock: data.hostelBlock.trim(),
      roomNumber: data.roomNumber.trim(),
      token: existing?.token || "mock_jwt_internal_" + Date.now(),
      createdAt: existing?.createdAt || new Date().toISOString(),
    };

    portalApi.saveSession(session);
    return session;
  },

  getInternalOnboarding(): InternalOnboardingData | null {
    const session = portalApi.getSession();
    if (!session) return null;
    return {
      name: session.name || "",
      registrationNumber: session.registrationNumber || "",
      contactNumber: session.phone || "",
      email: session.email || "",
      gender: session.gender || "",
      hostelBlock: session.hostelBlock || "",
      roomNumber: session.roomNumber || "",
    };
  },

  saveSession(session: UserSession): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
    }
  },

  getSession(): UserSession | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY_SESSION);
    }
  },

  // Idea Submissions state helpers
  async getSubmission(userId?: string): Promise<IdeaSubmission | null> {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(STORAGE_KEY_SUBMISSION);
      if (raw) {
        try {
          return JSON.parse(raw);
        } catch {
          return null;
        }
      }
    }
    return null;
  },

  async saveSubmission(submission: Partial<IdeaSubmission>, isDraft = true): Promise<IdeaSubmission> {
    const session = portalApi.getSession();
    const existing = await portalApi.getSubmission(session?.id);

    const updatedSubmission: IdeaSubmission = {
      id: existing?.id || `sub_${Date.now()}`,
      userId: session?.id || "guest",
      teamName: submission.teamName || existing?.teamName || "",
      leaderName: submission.leaderName || session?.name || existing?.leaderName || "",
      leaderEmail: submission.leaderEmail || session?.email || existing?.leaderEmail || "",
      leaderPhone: submission.leaderPhone || session?.phone || existing?.leaderPhone || "",
      leaderRegNo: submission.leaderRegNo || session?.registrationNumber || existing?.leaderRegNo || "",
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
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_SUBMISSION, JSON.stringify(updatedSubmission));
    }
    return updatedSubmission;
  },

  getTrackDetails(track: TrackType) {
    const tracks: Record<TrackType, { name: string; icon: string; description: string; color: string }> = {
      android: {
        name: "Android Development",
        icon: "/assets/android.svg",
        description: "Mobile applications, Kotlin/Compose, native devices, and on-device intelligent experiences.",
        color: "from-green-500/20 to-emerald-500/10 border-green-500/30 text-green-400",
      },
      web: {
        name: "Web Development",
        icon: "/assets/web.svg",
        description: "Modern, responsive, high-performance web applications, progressive web apps, and web tooling.",
        color: "from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-400",
      },
      gemini: {
        name: "AI / ML & Gemini",
        icon: "/assets/gemini.svg",
        description: "Generative AI, multimodal applications, agents, intelligent workflows, and machine learning models.",
        color: "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400",
      },
      cloud: {
        name: "Cloud & DevOps",
        icon: "/assets/cloud.svg",
        description: "Scalable cloud architectures, serverless, microservices, containerization, and distributed systems.",
        color: "from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-400",
      },
      "open-innovation": {
        name: "Open Innovation",
        icon: "/assets/logo/openinnovation.svg",
        description: "Disruptive multidisciplinary solutions, hardware/IoT, fintech, healthtech, and creative hacks.",
        color: "from-rose-500/20 to-pink-500/10 border-rose-500/30 text-rose-400",
      },
    };
    return tracks[track] || tracks.web;
  },
};
