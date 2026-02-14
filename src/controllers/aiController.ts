import { Request, Response } from 'express';
import axios from 'axios';

const AI_SERVICE_URL = 'http://localhost:8000';

export const analyzeApplication = async (req: Request, res: Response) => {
    try {
        const { resumeText, jobDescription } = req.body;

        if (!resumeText || !jobDescription) {
            res.status(400).json({ error: 'Missing resumeText or jobDescription' });
            return;
        }

        const response = await axios.post(`${AI_SERVICE_URL}/analyze`, {
            resume_text: resumeText,
            job_description: jobDescription,
        });

        res.json(response.data);
    } catch (error) {
        console.error("AI Service Error:", error);
        res.status(500).json({ error: 'Failed to analyze application' });
    }
};
