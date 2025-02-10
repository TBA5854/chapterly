import { Request, Response } from 'express';
import { prisma } from '../../../../db/dbController';
import jwt from 'jsonwebtoken';

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

export const myProfile = async (req: Request, res: Response) => {
    const id = req.user as string;
    console.log({id});
    try {
        const user = await prisma.user.findUnique({
            where: { regno: id },
        });
        if (user) {
            console.log(user);
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createUser = async (req: Request, res: Response) => {
    const { regno, name, isExc, phno, email } = req.body;
    const missingFields: string[] = [];
    if (!regno) missingFields.push('regno');
    if (!name) missingFields.push('name');
    if (isExc === undefined) missingFields.push('isExc');
    if (!phno) missingFields.push('phno');
    if (!email) missingFields.push('email');

    if (missingFields.length > 0) {
        res.status(400).json({ error: 'Missing fields', fields: missingFields });
        return;
    }
    
    const gid = req.user as string;
    const guser = await prisma.google.findUnique({
        where: { gid },
    });
    if (!guser) {
        res.status(400).json({
            error: 'Google user not found',
        });
        return;
    }
    if (guser.email !== email) {
        res.status(400).json({
            error: 'Email does not match',
        });
        return;
    }
    try {
        const newUser = await prisma.user.create({
            data: {
                regno,
                name,
                isExc,
                phno,
                email,
            },
        });
        const token = jwt.sign({ regno }, process.env.JWT_SECRET!);
        res.status(201).json({profile: newUser, token});
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.user as any;
    const { name, isExc, role, phno, email } = req.body;
    try {
        const updatedUser = await prisma.user.update({
            where: { regno: id },
            data: {
                name,
                isExc,
                role,
                phno,
                email,
            },
        });
        res.status(200).json({updatedUser});
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.user as any;
    try {
        await prisma.user.delete({
            where: { regno: id },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const isBoard = async (req: Request, res: Response) => {
    console.log(req.user);
    const id = req.user as string;
    console.log({id});
    try {
        const user = await prisma.user.findUnique({
            where: { regno: id },
        });
        if (user && user.role === 'Board') {
            res.status(200).json({ isBoard: true });
        } else {
            res.status(401).json({ isBoard: false });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};