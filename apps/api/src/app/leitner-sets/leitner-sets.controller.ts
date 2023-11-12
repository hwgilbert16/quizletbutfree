import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Request,
  UnauthorizedException
} from "@nestjs/common";
import { LeitnerSetsService } from "./leitner-sets.service";
import { Request as ExpressRequest } from "express";
import { UsersService } from "../users/users.service";
import { SetIdParam } from "./param/setIdParam.param";
import { SetsService } from "../sets/sets.service";
import { ApiResponse, ApiResponseOptions } from "@scholarsome/shared";
import { LeitnerSet as PrismaLeitnerSet } from "@prisma/client";
import { UpdateLeitnerSetDto } from "./dto/updateLeitnerSet.dto";
import * as crypto from "crypto";
import { LeitnerCardsService } from "../leitner-cards/leitner-cards.service";

@Controller("leitner-sets")
export class LeitnerSetsController {
  /**
   * @ignore
   */
  constructor(
    private readonly leitnerSetsService: LeitnerSetsService,
    private readonly leitnerCardsService: LeitnerCardsService,
    private readonly usersService: UsersService,
    private readonly setsService: SetsService
  ) {}

  @Get(":setId")
  async getLeitnerSet(@Param() params: SetIdParam, @Request() req: ExpressRequest): Promise<ApiResponse<PrismaLeitnerSet | []>> {
    const user = this.usersService.getUserInfo(req);
    if (!user) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });

    const set = await this.setsService.set({ id: params.setId });
    if (!set) throw new NotFoundException({ status: "fail", message: "Set not found" });

    return {
      status: ApiResponseOptions.Success,
      data: await this.leitnerSetsService.leitnerSet({
        setId_userId: {
          userId: user.id,
          setId: set.id
        }
      })
    };
  }

  @Post(":setId")
  async createLeitnerSet(@Param() params: SetIdParam, @Request() req: ExpressRequest): Promise<ApiResponse<PrismaLeitnerSet>> {
    const user = this.usersService.getUserInfo(req);
    if (!user) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });

    const set = await this.setsService.set({ id: params.setId });
    if (!set) throw new NotFoundException({ status: "fail", message: "Set not found" });

    if (set.private && user.id !== set.authorId) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });
    const id = crypto.randomUUID();

    return {
      status: ApiResponseOptions.Success,
      data: await this.leitnerSetsService.createLeitnerSet({
        id,
        set: {
          connect: {
            id: set.id
          }
        },
        user: {
          connect: {
            id: user.id
          }
        },
        studySession: {
          create: {
            leitnerSetId: id
          }
        },
        leitnerCards: {
          createMany: {
            data: set.cards.map((c) => {
              return {
                cardId: c.id
              };
            })
          }
        }
      })
    };
  }

  @Put(":setId")
  async updateLeitnerSet(@Param() params: SetIdParam, @Body() body: UpdateLeitnerSetDto, @Request() req: ExpressRequest): Promise<ApiResponse<PrismaLeitnerSet>> {
    const user = this.usersService.getUserInfo(req);
    if (!user) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });

    const leitnerSet = await this.leitnerSetsService.leitnerSet({
      setId_userId: {
        setId: params.setId,
        userId: user.id
      }
    });
    if (!leitnerSet) throw new NotFoundException({ status: "fail", message: "Leitner Set not found" });

    if (leitnerSet.userId !== user.id) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });

    // resets the study session
    // if we are updating the unlearnedCards field -> it is a new study session
    // removes all learned cards too
    if (body.unlearnedCards) {
      await this.leitnerSetsService.updateLeitnerSet({
        where: {
          setId_userId: {
            setId: params.setId,
            userId: user.id
          }
        },
        data: {
          studySession: {
            update: {
              unlearnedCards: {
                deleteMany: {
                  studySessionUnlearnedId: leitnerSet.studySession.id
                }
              },
              learnedCards: {
                deleteMany: {
                  studySessionLearnedId: leitnerSet.studySession.id
                }
              }
            }
          }
        }
      });
    }

    return {
      status: ApiResponseOptions.Success,
      data: await this.leitnerSetsService.updateLeitnerSet({
        where: {
          setId_userId: {
            setId: params.setId,
            userId: user.id
          }
        },
        data: {
          cardsPerSession: body.cardsPerSession,
          studySession: body.unlearnedCards ? {
            update: {
              startedAt: body.studySessionStartedAt,
              unlearnedCards: {
                createMany: {
                  data: body.unlearnedCards.map((id) => {
                    return {
                      leitnerCardId: leitnerSet.leitnerCards.filter((lc) => lc.cardId === id)[0].id
                    };
                  })
                }
              }
            }
          } : undefined
        }
      })
    };
  }
}
