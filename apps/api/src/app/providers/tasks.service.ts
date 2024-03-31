import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { SetsService } from "../sets/sets.service";
import { create } from "xmlbuilder2";
import { ConfigService } from "@nestjs/config";
import * as fs from "fs";
import { UsersService } from "../users/users.service";
import { FoldersService } from "../folders/folders.service";
import { CronExpression } from "@nestjs/schedule";

@Injectable()
export class TasksService {
  constructor(
    private readonly setsService: SetsService,
    private readonly usersService: UsersService,
    private readonly foldersService: FoldersService,
    private readonly configService: ConfigService
  ) {}

  /**
   * Generates a sitemap to save to the filesystem
   * and to submit to Google's search API (if configured)
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async generateSitemap() {
    let htmlPrefix = "";

    const date = new Date().toISOString();

    if (
      process.env.SSL_KEY_BASE64 &&
      process.env.SSL_KEY_BASE64.length > 0 &&
      process.env.SSL_CERT_BASE64 &&
      process.env.SSL_CERT_BASE64.length > 0
    ) {
      htmlPrefix = "https";
    } else htmlPrefix = "http";

    /*
    Generate the root sitemap.xml, that links to the others
     */

    const sitemapIndex =
      create({ version: "1.0", encoding: "UTF-8" });

    const sitemapIndexRoot = sitemapIndex
        .ele("sitemapindex")
        .att("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9");

    sitemapIndexRoot
        .ele("sitemap")
        .ele("loc")
        .txt(`${htmlPrefix}://${this.configService.get("HOST")}/sitemaps/sets.xml`)
        .up()
        .ele("lastmod")
        .txt(date);

    sitemapIndexRoot
        .ele("sitemap")
        .ele("loc")
        .txt(`${htmlPrefix}://${this.configService.get("HOST")}/sitemaps/folders.xml`)
        .up()
        .ele("lastmod")
        .txt(date);

    sitemapIndexRoot
        .ele("sitemap")
        .ele("loc")
        .txt(`${htmlPrefix}://${this.configService.get("HOST")}/sitemaps/users.xml`)
        .up()
        .ele("lastmod")
        .txt(date);

    if (!fs.existsSync("./dist/sitemaps")) {
      fs.mkdirSync("./dist/sitemaps");
    }

    fs.writeFileSync("./dist/sitemaps/sitemap.xml", sitemapIndex.end({ prettyPrint: true }));

    /*
    Generate the sets sitemap
     */

    const sets = await this.setsService.getSitemapSetInfo();

    const setsSitemap = create({ version: "1.0", encoding: "UTF-8" })
        .ele("urlset")
        .att("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9");

    for (const set of sets) {
      setsSitemap
          .ele("url")
          .ele("loc")
          .txt(`${htmlPrefix}://${this.configService.get("HOST")}/sets/${set.id}`)
          .up()
          .ele("lastmod")
          .txt(set.updatedAt.toISOString())
          .up()
          .ele("changefreq")
          .txt("Daily")
          .up()
          .ele("priority")
          .txt("1");
    }

    fs.writeFileSync("./dist/sitemaps/sets.xml", setsSitemap.end({ prettyPrint: true }));

    /*
    Generate the users sitemap
     */

    const users = await this.usersService.getSitemapUserInfo();

    const usersSitemap = create({ version: "1.0", encoding: "UTF-8" })
        .ele("urlset")
        .att("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9");

    for (const user of users) {
      usersSitemap
          .ele("url")
          .ele("loc")
          .txt(`${htmlPrefix}://${this.configService.get("HOST")}/profile/${user.id}`)
          .up()
          .ele("lastmod")
          .txt(user.updatedAt.toISOString())
          .up()
          .ele("changefreq")
          .txt("Daily")
          .up()
          .ele("priority")
          .txt("1");
    }

    fs.writeFileSync("./dist/sitemaps/users.xml", usersSitemap.end({ prettyPrint: true }));

    /*
    Generate the users sitemap
     */

    const folders = await this.foldersService.getSitemapFolderInfo();

    const foldersSitemap = create({ version: "1.0", encoding: "UTF-8" })
        .ele("urlset")
        .att("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9");

    for (const folder of folders) {
      foldersSitemap
          .ele("url")
          .ele("loc")
          .txt(`${htmlPrefix}://${this.configService.get("HOST")}/folder/${folder.id}`)
          .up()
          .ele("lastmod")
          .txt(folder.updatedAt.toISOString())
          .up()
          .ele("changefreq")
          .txt("Daily")
          .up()
          .ele("priority")
          .txt("1");
    }

    fs.writeFileSync("./dist/sitemaps/folders.xml", foldersSitemap.end({ prettyPrint: true }));
  }
}
