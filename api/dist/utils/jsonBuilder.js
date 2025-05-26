"use strict";
// src/utils/jsonBuilders.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSubjectJson = exports.buildBoardJson = void 0;
exports.buildSectionJson = buildSectionJson;
const buildBoardJson = (params) => {
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
exports.buildBoardJson = buildBoardJson;
const generateSubjectJson = (partitionKey, sortKey, createdBy, updatedBy) => {
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
exports.generateSubjectJson = generateSubjectJson;
function buildSectionJson(params) {
    const { boardSortKey, standardSortKey, subjectSortKey, sectionId, priority, displayName, isActive, createdAt, updatedAt, createdBy, updatedBy, } = params;
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
