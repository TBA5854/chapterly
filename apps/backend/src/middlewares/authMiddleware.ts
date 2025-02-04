import { Request, Response, NextFunction } from 'express';

const isLoggedin = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.redirect('/signup');
    }

    next();
};

export default isLoggedin;