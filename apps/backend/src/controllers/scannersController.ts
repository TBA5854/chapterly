import { Request, Response } from 'express';
import { prisma } from '../../../../db/dbController';

export const getScanners = async (_req: Request, res: Response) => {
    try {
        const scanners = await prisma.scanners.findMany();
        res.status(200).json(scanners);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch scanners' });
    }
};

export const getScannersByEventId = async (req: Request, res: Response) => {
    const { eventId } = req.params;
    try {
        const scanner = await prisma.scanners.findMany({
            where: {
                eventId: eventId
            },
        });
        if (scanner) {
            res.status(200).json(scanner);
        } else {
            res.status(404).json({ error: 'Scanner not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch scanner' });
    }
};

export const createScanner = async (req: Request, res: Response) => {
    const { regno, eventId, from, to } = req.body;
    try {
        const newScanner = await prisma.scanners.create({
            data: {
                regno,
                eventId,
                from: new Date(from),
                to: new Date(to),
            },
        });
        res.status(201).json(newScanner);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create scanner' });
    }
};

export const updateScanner = async (req: Request, res: Response) => {
    const { regno, eventId } = req.params;
    const { from, to } = req.body;
    try {
        const updatedScanner = await prisma.scanners.update({
            where: {
                regno_eventId: {
                    regno,
                    eventId,
                },
            },
            data: {
                from: new Date(from),
                to: new Date(to),
            },
        });
        res.status(200).json(updatedScanner);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update scanner' });
    }
};

export const deleteScanner = async (req: Request, res: Response) => {
    const { regno, eventId } = req.params;
    try {
        await prisma.scanners.delete({
            where: {
                regno_eventId: {
                    regno,
                    eventId,
                },
            },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete scanner' });
    }
};

export const scanId = async (req: Request, res: Response) => { 
    const { regno, eventId } = req.body;
    console.log({regno, eventId});
    const scannedBy = req.user as string;
    try {
        const scan = await prisma.attendance.findUnique({
            where: {
                regno_eventId: {
                    regno,
                    eventId,
                },
            },
        });
        
        if (scan) {
            return res.status(409).json({ error: 'Attendance already recorded' });
        }

        const newScan = await prisma.attendance.create({
            data: {
                regno,
                eventId,
                attended: true,
                scannedBy,
            },
        });
        console.log({newScan});
        res.status(201).json(newScan);
        console.log("Scanned");
    } catch (error) {
        console.log({error});
        res.status(500).json({ error: 'Failed to scan' });
    }
}