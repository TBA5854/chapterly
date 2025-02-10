import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const scannerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const eventId = req.params.eventId; 
    const regno = req.user as string;
    try {
        const scanner = await prisma.scanners.findUnique({
            where: {
                regno_eventId: {
                    regno: regno,
                    eventId: eventId,
                },
            },
        });

        if (scanner) {
            if (scanner.to < new Date()) {
                res.status(403).json({ message: 'Access denied. Scanner is expired.' });
                return;
            }
            if (scanner.from > new Date()) {
                res.status(403).json({ message: 'Access denied. Scanner is not active yet.' });
                return;
            }
            next();
        } else {
            res.status(403).json({ message: 'Access denied. User is not a scanner for this event.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
};

export default scannerMiddleware;