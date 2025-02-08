import { Request, Response, NextFunction } from 'express';
declare const scannerMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export default scannerMiddleware;
