import * as UserUseCases from "./core/application/usesCases/index";
import { UserSqliteRepo } from "./outbound/persistence/user.sqlite";
import { BetterAuthAdapter } from "./outbound/services/betterAuthAdapter";

const userRepository = new UserSqliteRepo();
const authProvider = new BetterAuthAdapter();

export const getAllUsersUseCase = new UserUseCases.GetAllUsersUseCase(userRepository);
export const createUserUseCase = new UserUseCases.createUserUseCase(authProvider);
export const getUserByEmailUseCase = new UserUseCases.GetUserByEmailUseCase(userRepository);
export const getUserByIdUseCase = new UserUseCases.GetUserByIdUseCase(userRepository);
export const updateUserUseCase = new UserUseCases.UpdateUserUseCase(authProvider);
export const deleteUserUseCase = new UserUseCases.DeleteUserUseCase(authProvider);