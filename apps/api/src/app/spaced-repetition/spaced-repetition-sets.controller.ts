import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Request,
  UnauthorizedException,
  UseGuards
} from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { SpacedRepetitionSetsService } from "./spaced-repetition-sets.service";
import { Request as ExpressRequest } from "express";
import { ApiResponse, ApiResponseOptions, SpacedRepetitionSet } from "@scholarsome/shared";
import { AuthenticatedGuard } from "../auth/guards/authenticated.guard";
import { SetIdParam } from "../sets/param/setIdParam.param";
import { SetsService } from "../sets/sets.service";
import { UpdateSpacedRepetitionSetDto } from "./dto/updateSpacedRepetitionSet.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateSpacedRepetitionSetDto } from "./dto/createSpacedRepetitionSet.dto";

@ApiTags("Spaced Repetition")
@UseGuards(AuthenticatedGuard)
@Controller("spaced-repetition/sets")
export class SpacedRepetitionSetsController {
  constructor(
    private readonly authService: AuthService,
    private readonly spacedRepetitionSetsService: SpacedRepetitionSetsService,
    private readonly setsService: SetsService
  ) {}

  /**
   * Gets a spaced repetition set
   *
   * @returns `SpacedRepetitionSet` object
   */
  @ApiOperation( {
    summary: "Get a spaced repetition set"
  })
  @Get(":setId")
  async spacedRepetitionSet(@Param() params: SetIdParam, @Request() req: ExpressRequest): Promise<ApiResponse<SpacedRepetitionSet>> {
    const user = await this.authService.getUserInfo(req);
    if (!user) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });

    const spacedRepetitionSet = await this.spacedRepetitionSetsService.spacedRepetitionSet({
      // eslint-disable-next-line camelcase
      setId_userId: {
        setId: params.setId,
        userId: user.id
      }
    });
    if (!spacedRepetitionSet) throw new NotFoundException({ status: "fail", message: "Spaced repetition set not found" });

    if (spacedRepetitionSet.userId !== user.id) {
      throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });
    }

    return {
      status: ApiResponseOptions.Success,
      data: spacedRepetitionSet
    };
  }

  /**
   * Creates a spaced repetition set
   *
   * @returns `SpacedRepetitionSet` object
   */
  @ApiOperation( {
    summary: "Create a spaced repetition set"
  })
  @Post(":setId")
  async createSpacedRepetitionSet(@Param() params: SetIdParam, @Body() body: CreateSpacedRepetitionSetDto, @Request() req: ExpressRequest): Promise<ApiResponse<SpacedRepetitionSet>> {
    const user = await this.authService.getUserInfo(req);
    if (!user) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });

    const set = await this.setsService.set({
      id: params.setId
    });
    if (!set) throw new NotFoundException({ status: "fail", message: "Set not found" });
    if (set.private && set.authorId !== user.id) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });

    const existingSpacedRepetitionSet = await this.spacedRepetitionSetsService.spacedRepetitionSet({
      // eslint-disable-next-line camelcase
      setId_userId: {
        setId: params.setId,
        userId: user.id
      }
    });
    if (existingSpacedRepetitionSet) throw new ConflictException({ status: "fail", message: "Spaced repetition set already exists" });

    if (body.cardsPerDay > set.cards.length) {
      throw new BadRequestException({ status: "fail", message: "The cards per day cannot exceed the number of cards in a set." });
    }

    const spacedRepetitionSet = await this.spacedRepetitionSetsService.createSpacedRepetitionSet({
      cardsPerDay: body.cardsPerDay,
      answerWith: body.answerWith,
      set: {
        connect: {
          id: params.setId
        }
      },
      user: {
        connect: {
          id: user.id
        }
      },
      spacedRepetitionCards: {
        createMany: {
          data: set.cards.map((c) => {
            return {
              cardId: c.id
            };
          })
        }
      }
    });

    return {
      status: ApiResponseOptions.Success,
      data: spacedRepetitionSet
    };
  }

  /**
   * Updates a spaced repetition set
   *
   * @returns Updated `SpacedRepetitionSet` object
   */
  @ApiOperation( {
    summary: "Update a spaced repetition set"
  })
  @Patch(":setId")
  async updateSpacedRepetitionSet(@Param() params: SetIdParam, @Body() body: UpdateSpacedRepetitionSetDto, @Request() req: ExpressRequest): Promise<ApiResponse<SpacedRepetitionSet>> {
    const user = await this.authService.getUserInfo(req);
    if (!user) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });

    const spacedRepetitionSet = await this.spacedRepetitionSetsService.spacedRepetitionSet({
      // eslint-disable-next-line camelcase
      setId_userId: {
        setId: params.setId,
        userId: user.id
      }
    });
    if (!spacedRepetitionSet) throw new NotFoundException({ status: "fail", message: "Spaced repetition set not found" });

    if (spacedRepetitionSet.userId !== user.id) {
      throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });
    }

    return {
      status: ApiResponseOptions.Success,
      data: await this.spacedRepetitionSetsService.updateSpacedRepetitionSet({
        where: {
          // eslint-disable-next-line camelcase
          setId_userId: {
            setId: params.setId,
            userId: user.id
          }
        },
        data: {
          cardsPerDay: body.cardsPerDay,
          answerWith: body.answerWith
        }
      })
    };
  }

  /**
   * Deletes a spaced repetition set
   *
   * @returns Deleted `SpacedRepetitionSet` object
   */
  @ApiOperation( {
    summary: "Delete a spaced repetition set"
  })
  @Delete(":setId")
  async deleteSpacedRepetitionSet(@Param() params: SetIdParam, @Request() req: ExpressRequest): Promise<ApiResponse<SpacedRepetitionSet>> {
    const user = await this.authService.getUserInfo(req);
    if (!user) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });

    const spacedRepetitionSet = await this.spacedRepetitionSetsService.spacedRepetitionSet({
      // eslint-disable-next-line camelcase
      setId_userId: {
        setId: params.setId,
        userId: user.id
      }
    });
    if (!spacedRepetitionSet) throw new NotFoundException({ status: "fail", message: "Spaced repetition set not found" });

    if (spacedRepetitionSet.userId !== user.id) {
      throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });
    }

    return {
      status: ApiResponseOptions.Success,
      data: await this.spacedRepetitionSetsService.deleteSpacedRepetitionSet({
        // eslint-disable-next-line camelcase
        setId_userId: {
          setId: params.setId,
          userId: user.id
        }
      })
    };
  }
}
