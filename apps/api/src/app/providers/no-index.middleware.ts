import { Request, Response, NextFunction } from "express";

export function noIndexMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.path.startsWith("/api") || process.env.NODE_ENV !== "public") {
    res.setHeader("X-Robots-Tag", "noindex");
  }

  next();
}
