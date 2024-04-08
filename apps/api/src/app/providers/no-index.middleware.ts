import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class NoIndexMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.path.startsWith("/api")) {
      res.setHeader("X-Robots-Tag", "noindex");
    }

    next();
  }
}
