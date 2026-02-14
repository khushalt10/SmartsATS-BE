import { Request, Response } from 'express';
import prisma from '../prisma';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
const pdfParse = require('pdf-parse');
import mammoth from 'mammoth';

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Ensure uploads directory exists
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads');
        }
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

export const upload = multer({ storage });

export const uploadResume = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        const filePath = req.file.path;
        const originalName = req.file.originalname;
        let textContent = '';

        // Extract text based on file type
        if (req.file.mimetype === 'application/pdf') {
            const dataBuffer = fs.readFileSync(filePath);
            // @ts-ignore
            const data = await pdfParse(dataBuffer);
            textContent = data.text;
        } else if (
            req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
            const result = await mammoth.extractRawText({ path: filePath });
            textContent = result.value;
        } else {
            // Fallback/Default
            try {
                textContent = fs.readFileSync(filePath, 'utf-8');
            } catch (e) {
                textContent = "Could not extract text.";
            }
        }

        // specific cleanup for PDF/Doc text
        textContent = textContent.replace(/\s+/g, ' ').trim();

        const resume = await prisma.resume.create({
            data: {
                name: originalName,
                filePath: filePath,
                content: textContent,
            },
        });

        res.status(201).json(resume);
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ error: 'Failed to upload resume' });
    }
};

export const getResumes = async (req: Request, res: Response) => {
    try {
        const resumes = await prisma.resume.findMany({
            orderBy: { updatedAt: 'desc' },
        });
        res.json(resumes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch resumes' });
    }
};

export const createResume = async (req: Request, res: Response) => {
    try {
        const { name, content } = req.body;
        const resume = await prisma.resume.create({
            data: {
                name,
                content,
            },
        });
        res.json(resume);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create resume' });
    }
};

export const updateResume = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, content } = req.body;
        const resume = await prisma.resume.update({
            where: { id: Number(id) },
            data: {
                name,
                content,
            },
        });
        res.json(resume);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update resume' });
    }
};

export const deleteResume = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.resume.delete({
            where: { id: Number(id) },
        });
        res.json({ message: 'Resume deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete resume' });
    }
};
