import { Request, Response } from 'express';
import prisma from '../prisma';

export const getApplications = async (req: Request, res: Response) => {
  try {
    const applications = await prisma.application.findMany({
      orderBy: { dateApplied: 'desc' },
      include: {
        resume: true
      }
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};

export const createApplication = async (req: Request, res: Response) => {
  try {
    const { company, position, status, dateApplied, jobDescription, notes, resumeId } = req.body;
    const application = await prisma.application.create({
      data: {
        company,
        position,
        status: status || 'Applied',
        dateApplied: dateApplied ? new Date(dateApplied) : new Date(),
        jobDescription,
        notes,
        resumeId: resumeId ? Number(resumeId) : undefined,
      },
    });
    res.json(application);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create application' });
  }
};

export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const application = await prisma.application.update({
      where: { id: Number(id) },
      data: { status },
    });
    res.json(application);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update application status' });
  }
};

export const deleteApplication = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.application.delete({
      where: { id: Number(id) },
    });
    res.json({ message: 'Application deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete application' });
  }
};
