import { getConnection, Repository } from "typeorm";
import { User } from "../entities/User";

const getUserRoom = async (sender: number, receiver: number): Promise<User> => {
  try {
    const userRepository: Repository<User> =
      getConnection().getRepository(User);
    const findUser = await userRepository.findOne({
      where: { id: sender },
    });
    return findUser;
  } catch (error) {}
};

export { getUserRoom };
