import prisma from "../config/db";

// Get all users
export const getAllUsers = async () => {
  return await prisma.user.findMany();
};

// Get user by id
export const getUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

// Create a new user (from Auth0 webhook)
export const createUser = async (data: {
  auth0Id: string;
  email: string;
  name: string;
  picture?: string;
}) => {
  return await prisma.user.create({
    data,
  });
};

// Delete user by id
export const deleteUserById = async (id: string) => {
  return await prisma.user.delete({
    where: { id },
  });
};
