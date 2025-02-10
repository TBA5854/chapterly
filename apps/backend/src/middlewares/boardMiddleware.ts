import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const boardMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const regno = req.user as string;
        const user = await prisma.user.findUnique({
            where: { regno },
        });

        if (user && user.role === 'Board') {
            next();
        } else {
            res.status(403).json({ message: 'Access denied. User is not a board member.' });
            return;
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
        return;
    }
};

export default boardMiddleware;