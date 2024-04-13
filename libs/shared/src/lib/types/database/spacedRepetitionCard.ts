import { Prisma } from "@prisma/client";

const spacedRepetitionCardWithRelations = Prisma.validator<Prisma.SpacedRepetitionCardArgs>()({
  include: {
    card: true
  }
});

export type SpacedRepetitionCard = Prisma.SpacedRepetitionCardGetPayload<typeof spacedRepetitionCardWithRelations>;
