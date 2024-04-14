import { Injectable } from "@nestjs/common";
import { PrismaService } from "../providers/database/prisma/prisma.service";
import { Prisma } from "@prisma/client";
import { SpacedRepetitionSet } from "@scholarsome/shared";

@Injectable()
export class SpacedRepetitionSetsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Queries the database for a unique spaced repetition set
   *
   * @param spacedRepetitionSetWhereUniqueInput Prisma `SpacedRepetitionSetWhereUniqueInput` selector
   *
   * @returns Queried `SpacedRepetitionSet` object
   */
  async spacedRepetitionSet(
      spacedRepetitionSetWhereUniqueInput: Prisma.SpacedRepetitionSetWhereUniqueInput
  ): Promise<SpacedRepetitionSet | null> {
    return this.prisma.spacedRepetitionSet.findUnique({
      where: spacedRepetitionSetWhereUniqueInput,
      include: {
        set: true,
        spacedRepetitionCards: true,
        user: {
          select: {
            id: true,
            username: true,
            timezone: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    });
  }

  /**
   * Queries the database for multiple spaced repetition sets
   *
   * @param params.skip Optional, Prisma skip selector
   * @param params.take Optional, Prisma take selector
   * @param params.cursor Optional, Prisma cursor selector
   * @param params.where Optional, Prisma where selector
   * @param params.orderBy Optional, Prisma orderBy selector
   *
   * @returns Array of queried `SpacedRepetitionSet` objects
   */
  async spacedRepetitionSets(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.SpacedRepetitionSetWhereUniqueInput;
    where?: Prisma.SpacedRepetitionSetWhereInput;
    orderBy?: Prisma.SpacedRepetitionSetOrderByWithRelationInput;
  }): Promise<SpacedRepetitionSet[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.spacedRepetitionSet.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        set: true,
        spacedRepetitionCards: true,
        user: {
          select: {
            id: true,
            username: true,
            timezone: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    });
  }

  /**
   * Creates a spaced repetition set in the database
   *
   * @param data Prisma `SpacedRepetitionSetCreateInput` selector
   *
   * @returns Created `SpacedRepetitionSet` object
   */
  async createSpacedRepetitionSet(data: Prisma.SpacedRepetitionSetCreateInput): Promise<SpacedRepetitionSet> {
    return this.prisma.spacedRepetitionSet.create({
      data,
      include: {
        set: true,
        spacedRepetitionCards: true,
        user: {
          select: {
            id: true,
            username: true,
            timezone: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    });
  }

  /**
   * Updates a spaced repetition set in the database
   *
   * @param params.where Prisma where selector
   * @param params.data Prisma data selector
   *
   * @returns Updated `SpacedRepetitionSet` object
   */
  async updateSpacedRepetitionSet(params: {
    where: Prisma.SpacedRepetitionSetWhereUniqueInput;
    data: Prisma.SpacedRepetitionSetUpdateInput;
  }): Promise<SpacedRepetitionSet> {
    const { where, data } = params;
    return this.prisma.spacedRepetitionSet.update({
      data,
      where,
      include: {
        set: true,
        spacedRepetitionCards: true,
        user: {
          select: {
            id: true,
            username: true,
            timezone: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    });
  }

  /**
   * Deletes a spaced repetition set from the database
   *
   * @param where Prisma `SpacedRepetitionSetWhereUniqueInput` selector
   *
   * @returns `SpacedRepetitionSet` object that was deleted
   */
  async deleteSpacedRepetitionSet(where: Prisma.SpacedRepetitionSetWhereUniqueInput): Promise<SpacedRepetitionSet> {
    return this.prisma.spacedRepetitionSet.delete({
      where,
      include: {
        set: true,
        spacedRepetitionCards: true,
        user: {
          select: {
            id: true,
            username: true,
            timezone: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    });
  }
}
