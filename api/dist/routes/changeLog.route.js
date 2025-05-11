"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const changeLog_controller_1 = require("../controllers/changeLog.controller");
const changeLogRouter = (0, express_1.Router)();
changeLogRouter.get("/", changeLog_controller_1.getAllChangeLogs);
exports.default = changeLogRouter;
