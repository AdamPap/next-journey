import { Request, Response } from "express";
import { Session } from "express-session";

// NOTE: Declaration merging to type Session correctly
// with userId addition
declare module "express-session" {
  interface Session {
    userId: number;
  }
}

type MyContext = {
  req: Request & { session: Session };
  res: Response;
};
