import * as UserUseCases from "./core/application/usesCases/index";
import { UserSqliteRepo } from "./outbound/persistence/user.sqlite";
import { BetterAuthAdapter } from "./outbound/services/betterAuthAdapter";
import { UserController } from "./inbound/user.controller";
import { AuthController } from "./inbound/auth.controller";
import { DocsController } from "./inbound/docs.controller";

const userRepository = new UserSqliteRepo();
const authProvider = new BetterAuthAdapter();

const getAllUsersUseCase = new UserUseCases.GetAllUsersUseCase(userRepository);
const createUserUseCase = new UserUseCases.CreateUserUseCase(authProvider);
const getUserByEmailUseCase = new UserUseCases.GetUserByEmailUseCase(userRepository);
const getUserByIdUseCase = new UserUseCases.GetUserByIdUseCase(userRepository);
const updateUserUseCase = new UserUseCases.UpdateUserUseCase(authProvider);
const deleteUserUseCase = new UserUseCases.DeleteUserUseCase(authProvider);
const signInUseCase = new UserUseCases.SignInUseCase(authProvider);
const signOutUseCase = new UserUseCases.SignOutUseCase(authProvider);
const getSessionUseCase = new UserUseCases.GetSessionUseCase(authProvider);
const changeEmailUseCase = new UserUseCases.ChangeEmailUseCase(authProvider);
const changePasswordUseCase = new UserUseCases.ChangePasswordUseCase(authProvider);
const forgetPasswordUseCase = new UserUseCases.ForgetPasswordUseCase(authProvider);
const resetPasswordUseCase = new UserUseCases.ResetPasswordUseCase(authProvider);

export const userRouter = UserController({
  getAllUsers: getAllUsersUseCase,
  createUser: createUserUseCase,
  getUserByEmail: getUserByEmailUseCase,
  getUserById: getUserByIdUseCase,
  updateUser: updateUserUseCase,
  deleteUser: deleteUserUseCase,
  changeEmail: changeEmailUseCase,
  changePassword: changePasswordUseCase,
});

export const authRouter = AuthController({
  signIn: signInUseCase,
  signOut: signOutUseCase,
  getSession: getSessionUseCase,
  forgetPassword: forgetPasswordUseCase,
  resetPassword: resetPasswordUseCase,
});

export const docsRouter = DocsController();
