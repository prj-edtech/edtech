// src/utils/jsonBuilders.ts

import { base62Encode } from "./base62";

export interface BuildSectionJsonParams {
  boardSortKey: string; // e.g. "CBSE"
  standardSortKey: string; // e.g. "XII"
  subjectSortKey: string; // e.g. "Mathematics"
  sectionId: string; // Base62 UUID
  priority: number;
  displayName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

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

export function buildSectionJson(params: BuildSectionJsonParams) {
  const {
    boardSortKey,
    standardSortKey,
    subjectSortKey,
    sectionId,
    priority,
    displayName,
    isActive,
    createdAt,
    updatedAt,
    createdBy,
    updatedBy,
  } = params;

  return {
    partitionKey: `Section#${boardSortKey}#${standardSortKey}`,
    sortKey: `${subjectSortKey}#${sectionId}`,
    sectionId,
    priority,
    attributes: {
      displayName,
    },
    isActive,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
    createdBy,
    updatedBy,
  };
}
