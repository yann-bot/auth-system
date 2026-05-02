import { Router, type Request, type Response } from "express";

import type {
  GetAllUsersUseCase,
  CreateUserUseCase,
  GetUserByEmailUseCase,
  GetUserByIdUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
  ChangeEmailUseCase,
  ChangePasswordUseCase,
} from "@application/usesCases";
import type { UpdateUserData } from "@application/ports/user.ports";
import type { User } from "@domain/entities/user.entity";
import { Email } from "@domain/value-objects/email.value-object";
import { Password } from "@domain/value-objects/password.value-object";
import { UserNotFoundError } from "@errors/user.error";

export interface UserControllerDeps {
  getAllUsers: GetAllUsersUseCase;
  createUser: CreateUserUseCase;
  getUserByEmail: GetUserByEmailUseCase;
  getUserById: GetUserByIdUseCase;
  updateUser: UpdateUserUseCase;
  deleteUser: DeleteUserUseCase;
  changeEmail: ChangeEmailUseCase;
  changePassword: ChangePasswordUseCase;
}

export function UserController(deps: UserControllerDeps) {
  const router = Router();

  router.get("/users", async (_req, res) => {
    const users = await deps.getAllUsers.execute();
    res.json(users.map(toUserDTO));
  });

  router.get("/users/by-email/:email", async (req, res) => {
    const email = new Email(decodeURIComponent(req.params.email));
    const user = await deps.getUserByEmail.execute(email);
    res.json(toUserDTO(user!));
  });

  router.get("/users/:id", async (req, res) => {
    const user = await deps.getUserById.execute(req.params.id);
    res.json(toUserDTO(user!));
  });

  router.post("/users", async (req, res) => {
    const { name, email, password } = req.body ?? {};
    if (!name || !email || !password) {
      res.status(400).json({ message: "name, email and password are required" });
      return;
    }
    const result = await deps.createUser.execute(
      name,
      new Email(email),
      new Password(password),
    );
    res.status(201).json({
      user: toUserDTO(result.user),
      sessionToken: result.sessionToken,
    });
  });

  router.patch("/users/me", async (req, res) => {
    const sessionToken = extractSessionToken(req);
    if (!sessionToken) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { name, image } = req.body ?? {};
    const data: UpdateUserData = {};
    if (name !== undefined) data.name = name;
    if (image !== undefined) data.image = image;

    const user = await deps.updateUser.execute(sessionToken, data);
    res.json(toUserDTO(user));
  });

  router.patch("/users/me/email", async (req, res) => {
    const sessionToken = extractSessionToken(req);
    if (!sessionToken) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { newEmail } = req.body ?? {};
    if (!newEmail) {
      res.status(400).json({ message: "newEmail is required" });
      return;
    }
    await deps.changeEmail.execute(sessionToken, new Email(newEmail));
    res.status(204).send();
  });

  router.patch("/users/me/password", async (req, res) => {
    const sessionToken = extractSessionToken(req);
    if (!sessionToken) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { currentPassword, newPassword } = req.body ?? {};
    if (!currentPassword || !newPassword) {
      res.status(400).json({ message: "currentPassword and newPassword are required" });
      return;
    }
    await deps.changePassword.execute(
      sessionToken,
      new Password(currentPassword),
      new Password(newPassword),
    );
    res.status(204).send();
  });

  router.delete("/users/me", async (req, res) => {
    const sessionToken = extractSessionToken(req);
    if (!sessionToken) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    await deps.deleteUser.execute(sessionToken);
    res.status(204).send();
  });

  router.use(userErrorHandler);
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

function userErrorHandler(
  err: unknown,
  _req: Request,
  res: Response,
) {
  if (err instanceof UserNotFoundError) {
    res.status(404).json({ message: err.message });
    return;
  }
  if (err instanceof Error) {
    res.status(400).json({ message: err.message });
    return;
  }
  res.status(500).json({ message: "Internal server error" });
}
