import prisma from "../config/db";
import { createAuditLog } from "./auditTrail.service";

// Get all users
export const getAllUsers = async () => {
  return await prisma.user.findMany();
};

// Get user by id
export const getUserById = async (auth0Id: string) => {
  return await prisma.user.findUnique({
    where: { auth0Id },
  });
};

// Create a new user (from Auth0 webhook)
export const createUser = async (data: {
  auth0Id: string;
  email: string;
  name: string;
  role: string;
  picture?: string;
}) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      auth0Id: data.auth0Id,
    },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const user = await prisma.user.create({
    data,
  });

  // Log creation event
  await createAuditLog({
    entityType: "USER",
    entityId: user.auth0Id,
    action: "CREATED",
    performedBy: user.auth0Id, // since it's their own creation, could be system user if via webhook
    details: {
      newState: user,
      notes: "New user created via Auth0 webhook.",
    },
  });

  return user;
};

// Delete user by id
export const deleteUserById = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("User not found");

  await prisma.user.delete({
    where: { id },
  });

  // Log deletion event
  await createAuditLog({
    entityType: "USER",
    entityId: user.auth0Id,
    action: "DELETED",
    performedBy: user.auth0Id,
    details: {
      previousState: user,
      notes: `User ${user.name} deleted.`,
    },
  });

  return user;
};
