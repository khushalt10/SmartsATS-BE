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
exports.deleteApplication = exports.updateApplicationStatus = exports.createApplication = exports.getApplications = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getApplications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const applications = yield prisma.application.findMany({
            orderBy: { dateApplied: 'desc' },
        });
        res.json(applications);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch applications' });
    }
});
exports.getApplications = getApplications;
const createApplication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { company, position, status, dateApplied, jobDescription, notes } = req.body;
        const application = yield prisma.application.create({
            data: {
                company,
                position,
                status: status || 'Applied',
                dateApplied: dateApplied ? new Date(dateApplied) : new Date(),
                jobDescription,
                notes,
            },
        });
        res.json(application);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create application' });
    }
});
exports.createApplication = createApplication;
const updateApplicationStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const application = yield prisma.application.update({
            where: { id: Number(id) },
            data: { status },
        });
        res.json(application);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update application status' });
    }
});
exports.updateApplicationStatus = updateApplicationStatus;
const deleteApplication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.application.delete({
            where: { id: Number(id) },
        });
        res.json({ message: 'Application deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete application' });
    }
});
exports.deleteApplication = deleteApplication;
