import { Injectable } from "@nestjs/common";
import { PrismaService } from "../providers/database/prisma/prisma.service";
import { Prisma } from "@prisma/client";
import { SpacedRepetitionCard } from "@scholarsome/shared";

@Injectable()
export class SpacedRepetitionCardsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Queries the database for a unique spaced repetition card
   *
   * @param spacedRepetitionCardWhereUniqueInput Prisma `SpacedRepetitionCardWhereUniqueInput` selector
   *
   * @returns Queried `SpacedRepetitionCard` object
   */
  async spacedRepetitionCard(
      spacedRepetitionCardWhereUniqueInput: Prisma.SpacedRepetitionCardWhereUniqueInput
  ): Promise<SpacedRepetitionCard | null> {
    return this.prisma.spacedRepetitionCard.findUnique({
      where: spacedRepetitionCardWhereUniqueInput,
      include: {
        card: true,
        spacedRepetitionSet: true
      }
    });
  }

  /**
   * Queries the database for multiple spaced repetition cards
   *
   * @param params.skip Optional, Prisma skip selector
   * @param params.take Optional, Prisma take selector
   * @param params.cursor Optional, Prisma cursor selector
   * @param params.where Optional, Prisma where selector
   * @param params.orderBy Optional, Prisma orderBy selector
   *
   * @returns Array of queried `SpacedRepetitionCard` objects
   */
  async spacedRepetitionCards(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.SpacedRepetitionCardWhereUniqueInput;
    where?: Prisma.SpacedRepetitionCardWhereInput;
    orderBy?: Prisma.SpacedRepetitionCardOrderByWithRelationInput;
  }): Promise<SpacedRepetitionCard[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.spacedRepetitionCard.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        card: true,
        spacedRepetitionSet: true
      }
    });
  }

  /**
   * Creates a spaced repetition card in the database
   *
   * @param data Prisma `SpacedRepetitionCardCreateInput` selector
   *
   * @returns Created `SpacedRepetitionCard` object
   */
  async createSpacedRepetitionCard(data: Prisma.SpacedRepetitionCardCreateInput): Promise<SpacedRepetitionCard> {
    return this.prisma.spacedRepetitionCard.create({
      data,
      include: {
        card: true,
        spacedRepetitionSet: true
      }
    });
  }

  /**
   * Updates a spaced repetition card in the database
   *
   * @param params.where Prisma where selector
   * @param params.data Prisma data selector
   *
   * @returns Updated `SpacedRepetitionCard` object
   */
  async updateSpacedRepetitionCard(params: {
    where: Prisma.SpacedRepetitionCardWhereUniqueInput;
    data: Prisma.SpacedRepetitionCardUpdateInput;
  }): Promise<SpacedRepetitionCard> {
    const { where, data } = params;
    return this.prisma.spacedRepetitionCard.update({
      data,
      where,
      include: {
        card: true,
        spacedRepetitionSet: true
      }
    });
  }

  /**
   * Deletes a spaced repetition card from the database
   *
   * @param where Prisma `SpacedRepetitionCardWhereUniqueInput` selector
   *
   * @returns `SpacedRepetitionCard` object that was deleted
   */
  async deleteSpacedRepetitionCard(where: Prisma.SpacedRepetitionCardWhereUniqueInput): Promise<SpacedRepetitionCard> {
    return this.prisma.spacedRepetitionCard.delete({
      where,
      include: {
        card: true,
        spacedRepetitionSet: true
      }
    });
  }
}
