import { Request, Response, NextFunction } from 'express';
export interface AuthRequest extends Request {
    userId?: number;
}
export declare function generateToken(userId: number): string;
export declare function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
