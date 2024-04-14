import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Request,
  UnauthorizedException,
  UseGuards
} from "@nestjs/common";
import { SpacedRepetitionCardIdParam } from "./param/spacedRepetitionCardId.param";
import { Request as ExpressRequest } from "express";
import { ApiResponse, ApiResponseOptions, SpacedRepetitionCard } from "@scholarsome/shared";
import { AuthService } from "../auth/auth.service";
import { SpacedRepetitionCardsService } from "./spaced-repetition-cards.service";
import { ApiTags } from "@nestjs/swagger";
import { UpdateSpacedRepetitionCardDto } from "./dto/updateSpacedRepetitionCard.dto";
import { AuthenticatedGuard } from "../auth/guards/authenticated.guard";

@ApiTags("Spaced Repetition")
@UseGuards(AuthenticatedGuard)
@Controller("spaced-repetition/cards")
export class SpacedRepetitionCardsController {
  constructor(
    private readonly authService: AuthService,
    private readonly spacedRepetitionCardsService: SpacedRepetitionCardsService
  ) {}

  /**
   * Gets a spaced repetition card
   *
   * @returns `SpacedRepetitionCard` object
   */
  @Get(":spacedRepetitionCardId")
  async spacedRepetitionCard(@Param() params: SpacedRepetitionCardIdParam, @Request() req: ExpressRequest): Promise<ApiResponse<SpacedRepetitionCard>> {
    const user = await this.authService.getUserInfo(req);
    if (!user) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });

    const spacedRepetitionCard = await this.spacedRepetitionCardsService.spacedRepetitionCard({
      id: params.spacedRepetitionCardId
    });
    if (!spacedRepetitionCard) throw new NotFoundException({ status: "fail", message: "Spaced repetition card not found" });

    if (spacedRepetitionCard.spacedRepetitionSet.userId !== user.id) {
      throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });
    }

    return {
      status: ApiResponseOptions.Success,
      data: spacedRepetitionCard
    };
  }

  /**
   * Updates a spaced repetition card
   *
   * @returns Updated `SpacedRepetitionCard` object
   */
  @Patch(":spacedRepetitionCardId")
  async updateSpacedRepetitionCard(@Param() params: SpacedRepetitionCardIdParam, @Body() body: UpdateSpacedRepetitionCardDto, @Request() req: ExpressRequest): Promise<ApiResponse<SpacedRepetitionCard>> {
    const user = await this.authService.getUserInfo(req);
    if (!user) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });

    const spacedRepetitionCard = await this.spacedRepetitionCardsService.spacedRepetitionCard({
      id: params.spacedRepetitionCardId
    });
    if (!spacedRepetitionCard) throw new NotFoundException({ status: "fail", message: "Spaced repetition card not found" });

    if (spacedRepetitionCard.spacedRepetitionSet.userId !== user.id) {
      throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });
    }

    return {
      status: ApiResponseOptions.Success,
      data: await this.spacedRepetitionCardsService.updateSpacedRepetitionCard({
        where: {
          id: params.spacedRepetitionCardId
        },
        data: {
          repetitions: body.repetitions,
          easeFactor: body.easeFactor,
          due: body.due
        }
      })
    };
  }
}
