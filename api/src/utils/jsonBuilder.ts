// src/utils/jsonBuilders.ts

export const buildBoardJson = (params: {
  sortKey: string;
  displayName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}) => {
  return [
    {
      partitionKey: "Board",
      sortKey: params.sortKey,
      attributes: {
        displayName: params.displayName,
      },
      isActive: params.isActive,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
      createdBy: params.createdBy,
      updatedBy: params.updatedBy,
    },
  ];
};

export const generateSubjectJson = (
  partitionKey: string,
  sortKey: string,
  createdBy: string,
  updatedBy: string
) => {
  const now = new Date().toISOString();

  return [
    {
      partitionKey,
      sortKey,
      attributes: {
        displayName: sortKey,
      },
      isActive: true,
      createdAt: now,
      updatedAt: now,
      createdBy,
      updatedBy,
    },
  ];
};
