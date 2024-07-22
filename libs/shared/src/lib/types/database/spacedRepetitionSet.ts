import { Prisma } from "@prisma/client";

const spacedRepetitionSetWithRelations = Prisma.validator<Prisma.SpacedRepetitionSetArgs>()({
  include: {
    set: true,
    spacedRepetitionCards: {
      include: {
        card: true
      }
    },
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

export type SpacedRepetitionSet = Prisma.SpacedRepetitionSetGetPayload<typeof spacedRepetitionSetWithRelations>;
