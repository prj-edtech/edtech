import prisma from "../config/db";

export const createNotification = async (data: {
  userId: string;
  eventType: string;
  entityType: string;
  entityId: string;
  title: string;
  message: string;
}) => {
  const notificationData = {
    notificationId: `notif_${Math.random().toString(36).substring(2, 15)}`,
    userId: data.userId,
    eventType: data.eventType,
    entityType: data.entityType,
    entityId: data.entityId,
    title: data.title,
    message: data.message,
  };

  return await prisma.notification.create({
    data: {
      ...notificationData,
      notificationJson: notificationData,
    },
  });
};

export const getAllNotifications = async () => {
  return await prisma.notification.findMany({
    orderBy: {
      createdAt: "asc",
    },
    where: {
      isRead: false,
    },
    include: {
      User: true,
    },
  });
};

export const markAllAsRead = async () => {
  return await prisma.notification.updateMany({
    data: {
      isRead: true,
    },
  });
};
