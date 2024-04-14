import {
  Body, ConflictException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Request,
  UnauthorizedException,
  UseGuards
} from "@nestjs/common";
import { Request as ExpressRequest } from "express";
import { ApiResponse, ApiResponseOptions, SpacedRepetitionCard } from "@scholarsome/shared";
import { AuthService } from "../auth/auth.service";
import { SpacedRepetitionCardsService } from "./spaced-repetition-cards.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { UpdateSpacedRepetitionCardDto } from "./dto/updateSpacedRepetitionCard.dto";
import { AuthenticatedGuard } from "../auth/guards/authenticated.guard";
import { SpacedRepetitionSetsService } from "./spaced-repetition-sets.service";
import { CardIdParam } from "../cards/param/cardId.param";
import { CardsService } from "../cards/cards.service";
import { SpacedRepetitionService } from "./spaced-repetition.service";

/*
this file has a lot of potentially large queries for what should be simple tasks

need to find a way to optimize this
 */

@ApiTags("Spaced Repetition")
@UseGuards(AuthenticatedGuard)
@Controller("spaced-repetition/sets/cards")
export class SpacedRepetitionCardsController {
  constructor(
    private readonly authService: AuthService,
    private readonly spacedRepetitionCardsService: SpacedRepetitionCardsService,
    private readonly spacedRepetitionSetsService: SpacedRepetitionSetsService,
    private readonly spacedRepetitionService: SpacedRepetitionService,
    private readonly cardsService: CardsService
  ) {}

  /**
   * Gets a spaced repetition card
   *
   * @returns `SpacedRepetitionCard` object
   */
  @ApiOperation( {
    summary: "Get a spaced repetition card"
  })
  @Get(":cardId")
  async spacedRepetitionCard(@Param() params: CardIdParam, @Request() req: ExpressRequest): Promise<ApiResponse<SpacedRepetitionCard>> {
    const user = await this.authService.getUserInfo(req);
    if (!user) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });

    const card = await this.cardsService.card({
      id: params.cardId
    });
    if (!card) throw new NotFoundException({ status: "fail", message: "Card not found" });

    const spacedRepetitionSet = await this.spacedRepetitionSetsService.spacedRepetitionSet({
      // eslint-disable-next-line camelcase
      setId_userId: {
        setId: card.setId,
        userId: user.id
      }
    });
    if (!spacedRepetitionSet) throw new NotFoundException({ status: "fail", message: "Spaced repetition set not found" });

    const spacedRepetitionCard = await this.spacedRepetitionCardsService.spacedRepetitionCard({
      // eslint-disable-next-line camelcase
      spacedRepetitionSetId_cardId: {
        spacedRepetitionSetId: spacedRepetitionSet.id,
        cardId: params.cardId
      }
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
  @ApiOperation( {
    summary: "Run the SM2 algorithm for a spaced repetition card",
    description: "Runs the SM2 algorithm and automatically updates the database with the outputs. Returns the updated spaced repetition card after running SM2."
  })
  @Patch(":cardId")
  async updateSpacedRepetitionCard(@Param() params: CardIdParam, @Body() body: UpdateSpacedRepetitionCardDto, @Request() req: ExpressRequest): Promise<ApiResponse<SpacedRepetitionCard>> {
    const user = await this.authService.getUserInfo(req);
    if (!user) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });

    const card = await this.cardsService.card({
      id: params.cardId
    });
    if (!card) throw new NotFoundException({ status: "fail", message: "Card not found" });

    const spacedRepetitionSet = await this.spacedRepetitionSetsService.spacedRepetitionSet({
      // eslint-disable-next-line camelcase
      setId_userId: {
        setId: card.setId,
        userId: user.id
      }
    });
    if (!spacedRepetitionSet) throw new NotFoundException({ status: "fail", message: "Spaced repetition set not found" });

    const spacedRepetitionCard = await this.spacedRepetitionCardsService.spacedRepetitionCard({
      // eslint-disable-next-line camelcase
      spacedRepetitionSetId_cardId: {
        spacedRepetitionSetId: spacedRepetitionSet.id,
        cardId: params.cardId
      }
    });
    if (!spacedRepetitionCard) throw new NotFoundException({ status: "fail", message: "Spaced repetition card not found" });

    if (spacedRepetitionCard.spacedRepetitionSet.userId !== user.id) {
      throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });
    }

    if (spacedRepetitionCard.due > new Date()) {
      throw new ConflictException({ status: "fail", message: "This spaced repetition card is not yet due" });
    }

    const sm2 = this.spacedRepetitionService.sm2(
        body.quality,
        body.repetitions,
        body.easeFactor,
        (body.due.getTime() - spacedRepetitionCard.updatedAt.getTime()) / 8.64e7
    );

    return {
      status: ApiResponseOptions.Success,
      data: await this.spacedRepetitionCardsService.updateSpacedRepetitionCard({
        where: {
          // eslint-disable-next-line camelcase
          spacedRepetitionSetId_cardId: {
            spacedRepetitionSetId: spacedRepetitionSet.id,
            cardId: params.cardId
          }
        },
        data: {
          repetitions: sm2.repetitions,
          easeFactor: sm2.easeFactor,
          due: new Date(new Date().setDate(new Date().getDate() + sm2.interval))
        }
      })
    };
  }
}
