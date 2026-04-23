export type SessionPayload = {
  userId: number;
  email: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type AuthResponse = {
  user: {
    id: number;
    name: string | null;
    email: string;
    avatar: string | null;
    bio: string | null;
    role: "user" | "admin";
  };
};
