import { DefaultEventsMap, Server } from "socket.io";
import { Request, Response } from "express";
declare const _default: (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => void;
export default _default;
export declare function createChatGroup(req: Request, res: Response): Promise<void>;
export declare function updateChatGroup(req: Request, res: Response): Promise<void>;
export declare function deleteChatGroup(req: Request, res: Response): Promise<void>;
export declare function addMemberToGroup(req: Request, res: Response): Promise<void>;
export declare function removeMemberFromGroup(req: Request, res: Response): Promise<void>;
