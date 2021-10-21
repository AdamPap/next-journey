import { Request, Response } from "express";

type MyContext = {
  req: Request;
  res: Response;
};
