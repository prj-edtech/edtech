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
