"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllChangeLogs = void 0;
const changeLog_service_1 = require("../services/changeLog.service");
const getAllChangeLogs = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const changeLogs = yield (0, changeLog_service_1.fetchAllChangeLog)();
        res.status(200).json({ data: changeLogs });
    }
    catch (error) {
        res.status(400).json({ message: error });
    }
});
exports.getAllChangeLogs = getAllChangeLogs;
