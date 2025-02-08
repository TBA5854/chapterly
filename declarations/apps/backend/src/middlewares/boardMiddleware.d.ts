import { Request, Response, NextFunction } from 'express';
declare const boardMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export default boardMiddleware;
