import { Request, Response, NextFunction } from 'express';
declare const isLoggedin: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export default isLoggedin;
