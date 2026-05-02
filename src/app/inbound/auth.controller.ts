import { Router, type Request, type Response, type NextFunction } from "express";

import type {
  SignInUseCase,
  SignOutUseCase,
  GetSessionUseCase,
  ForgetPasswordUseCase,
  ResetPasswordUseCase,
} from "@application/usesCases";
import type { User } from "@domain/entities/user.entity";
import { Email } from "@domain/value-objects/email.value-object";
import { Password } from "@domain/value-objects/password.value-object";

export interface AuthControllerDeps {
  signIn: SignInUseCase;
  signOut: SignOutUseCase;
  getSession: GetSessionUseCase;
  forgetPassword: ForgetPasswordUseCase;
  resetPassword: ResetPasswordUseCase;
}

export function AuthController(deps: AuthControllerDeps) {
  const router = Router();

  router.post("/auth/sign-in", async (req, res) => {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      res.status(400).json({ message: "email and password are required" });
      return;
    }
    const result = await deps.signIn.execute({
      email: new Email(email),
      password: new Password(password),
    });
    res.json({
      user: toUserDTO(result.user),
      sessionToken: result.sessionToken,
    });
  });

  router.post("/auth/sign-out", async (req, res) => {
    const sessionToken = extractSessionToken(req);
    if (!sessionToken) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    await deps.signOut.execute(sessionToken);
    res.status(204).send();
  });

  router.post("/auth/forget-password", async (req, res) => {
    const { email, redirectTo } = req.body ?? {};
    if (!email) {
      res.status(400).json({ message: "email is required" });
      return;
    }
    await deps.forgetPassword.execute(new Email(email), redirectTo);
    res.status(204).send();
  });

  router.post("/auth/reset-password", async (req, res) => {
    const { token, newPassword } = req.body ?? {};
    if (!token || !newPassword) {
      res.status(400).json({ message: "token and newPassword are required" });
      return;
    }
    await deps.resetPassword.execute(token, new Password(newPassword));
    res.status(204).send();
  });

  router.get("/auth/session", async (req, res) => {
    const sessionToken = extractSessionToken(req);
    if (!sessionToken) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const session = await deps.getSession.execute(sessionToken);
    if (!session) {
      res.status(401).json({ message: "Invalid or expired session" });
      return;
    }
    res.json({ user: toUserDTO(session.user) });
  });

  router.use(authErrorHandler);
  return router;
}

function extractSessionToken(req: Request): string | null {
  const auth = req.header("authorization");
  if (auth && auth.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

function toUserDTO(user: User) {
  return {
    id: user.getId(),
    name: user.getName(),
    email: user.getEmail(),
    image: user.getImage(),
    emailVerified: user.getEmailVerified(),
    createdAt: user.getCreatedAt(),
    updatedAt: user.getUpdatedAt(),
  };
}

function authErrorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof Error) {
    res.status(400).json({ message: err.message });
    return;
  }
  res.status(500).json({ message: "Internal server error" });
}
