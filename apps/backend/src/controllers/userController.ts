import { Request, Response } from 'express';
import { prisma } from '../../../../db/dbController';

export const getUsers = async (_req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: { regno: id },
        });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// export const createUser = async (req: Request, res: Response) => {
//     const { regno, name, isExc, role, phno, authId } = req.body;
//     try {
//         const newUser = await prisma.user.update({
//             data: {
//                 regno,
//                 name,
//                 isExc,
//                 role,
//                 phno,
//                 email,
//                 authId,
//             },
//         });
//         res.status(201).json(newUser);
//     } catch (error) {
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, isExc, role, phno, email, authId } = req.body;
    try {
        const updatedUser = await prisma.user.update({
            where: { regno: id },
            data: {
                name,
                isExc,
                role,
                phno,
                email,
                authId,
            },
        });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.user.delete({
            where: { regno: id },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};