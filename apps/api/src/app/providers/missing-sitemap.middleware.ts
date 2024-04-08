import { NextFunction, Request, Response } from "express";
import * as fs from "fs";
import { join } from "path";
import { HttpStatus } from "@nestjs/common";

export function missingSitemapMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.url.startsWith("/sitemaps")) {
    const urlParams = req.url.split("/");

    // if the last param is an empty string, then we know the file doesn't exist
    const exists =
      urlParams[urlParams.length - 1] !== "" ? fs.existsSync(join("./dist/sitemaps", urlParams[urlParams.length - 1])) : false;

    if (!exists) {
      res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: "Not Found"
      });

      res.end();
    }
  }

  next();
}
