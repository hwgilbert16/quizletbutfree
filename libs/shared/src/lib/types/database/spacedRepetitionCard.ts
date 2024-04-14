import { Prisma } from "@prisma/client";

const spacedRepetitionCardWithRelations = Prisma.validator<Prisma.SpacedRepetitionCardArgs>()({
  include: {
    card: true,
    spacedRepetitionSet: true
  }
});

export type SpacedRepetitionCard = Prisma.SpacedRepetitionCardGetPayload<typeof spacedRepetitionCardWithRelations>;
