import prisma from "../config/db";

export const getAllUsers = async () => {
  return await prisma.user.findMany();
};
