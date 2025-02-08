import { Request, Response } from 'express';
export declare const getScanners: (_req: Request, res: Response) => Promise<void>;
export declare const getScannersByEventId: (req: Request, res: Response) => Promise<void>;
export declare const createScanner: (req: Request, res: Response) => Promise<void>;
export declare const updateScanner: (req: Request, res: Response) => Promise<void>;
export declare const deleteScanner: (req: Request, res: Response) => Promise<void>;
export declare const scanId: (req: Request, res: Response) => Promise<void>;
