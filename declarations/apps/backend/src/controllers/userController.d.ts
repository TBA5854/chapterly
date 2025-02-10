import { Request, Response } from 'express';
export declare const getUsers: (_req: Request, res: Response) => Promise<void>;
export declare const getUserById: (req: Request, res: Response) => Promise<void>;
export declare const updateUser: (req: Request, res: Response) => Promise<void>;
export declare const deleteUser: (req: Request, res: Response) => Promise<void>;
