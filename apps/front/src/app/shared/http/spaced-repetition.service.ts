import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ApiResponse, ApiResponseOptions, SpacedRepetitionCard, SpacedRepetitionSet } from "@scholarsome/shared";
import { lastValueFrom } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class SpacedRepetitionService {
  constructor(private readonly http: HttpClient) {}

  /* -------------------- Spaced Repetition Sets -------------------- */

  /**
   * Gets a spaced repetition set
   *
   * @param setId The ID of the set corresponding to the spaced repetition set
   *
   * @returns `SpacedRepetitionSet` object
   */
  async spacedRepetitionSet(setId: string): Promise<SpacedRepetitionSet | null> {
    let spacedRepetitionSet: ApiResponse<SpacedRepetitionSet> | undefined;

    try {
      spacedRepetitionSet = await lastValueFrom(this.http.get<ApiResponse<SpacedRepetitionSet>>("/api/spaced-repetition/sets/" + setId));
    } catch (e) {
      return null;
    }

    if (spacedRepetitionSet.status === ApiResponseOptions.Success) {
      return spacedRepetitionSet.data;
    } else return null;
  }

  /**
   * Creates a spaced repetition set
   *
   * @param setId The ID of the set corresponding to the spaced repetition set
   * @param cardsPerDay The number of cards that will be studied each day
   *
   * @returns Created `SpacedRepetitionSet` object
   */
  async createSpacedRepetitionSet(setId: string, cardsPerDay: number): Promise<SpacedRepetitionSet | null> {
    let spacedRepetitionSet: ApiResponse<SpacedRepetitionSet> | undefined;

    try {
      spacedRepetitionSet = await lastValueFrom(this.http.post<ApiResponse<SpacedRepetitionSet>>("/api/spaced-repetition/sets/" + setId, { cardsPerDay }));
    } catch (e) {
      return null;
    }

    if (spacedRepetitionSet.status === ApiResponseOptions.Success) {
      return spacedRepetitionSet.data;
    } else return null;
  }

  /**
   * Updates a spaced repetition set
   *
   * @param body.id ID of the folder to be updated
   * @param body.cardsPerDay The number of cards that will be studied each day
   * @param body.answerWith The side of the flashcard to answer with - either TERM or DEFINITION
   *
   * @returns Updated `SpacedRepetitionSet` object
   */
  async updateSpacedRepetitionSet(body: {
    id: string;
    cardsPerDay?: number;
    answerWith?: "TERM" | "DEFINITION"
  }): Promise<SpacedRepetitionSet | null> {
    let spacedRepetitionSet: ApiResponse<SpacedRepetitionSet> | undefined;

    try {
      spacedRepetitionSet = await lastValueFrom(this.http.patch<ApiResponse<SpacedRepetitionSet>>("/api/spaced-repetition/sets/" + body.id, {
        cardsPerDay: body.cardsPerDay,
        answerWith: body.answerWith
      }));
    } catch (e) {
      return null;
    }

    if (spacedRepetitionSet.status === ApiResponseOptions.Success) {
      return spacedRepetitionSet.data;
    } else return null;
  }

  /**
   * Deletes a spaced repetition set
   *
   * @param setId The ID of the set corresponding to the spaced repetition set
   *
   * @returns Deleted `SpacedRepetitionSet` object
   */
  async deleteSpacedRepetitionSet(setId: string): Promise<SpacedRepetitionSet | null> {
    let spacedRepetitionSet: ApiResponse<SpacedRepetitionSet> | undefined;

    try {
      spacedRepetitionSet = await lastValueFrom(this.http.delete<ApiResponse<SpacedRepetitionSet>>("/api/spaced-repetition/sets/" + setId));
    } catch (e) {
      return null;
    }

    if (spacedRepetitionSet.status === ApiResponseOptions.Success) {
      return spacedRepetitionSet.data;
    } else return null;
  }

  /* -------------------- Spaced Repetition Cards -------------------- */

  /**
   * Gets a spaced repetition set
   *
   * @param cardId The ID of the card corresponding to the spaced repetition card
   *
   * @returns `SpacedRepetitionCard` object
   */
  async spacedRepetitionCard(cardId: string): Promise<SpacedRepetitionCard | null> {
    let spacedRepetitionCard: ApiResponse<SpacedRepetitionCard> | undefined;

    try {
      spacedRepetitionCard = await lastValueFrom(this.http.get<ApiResponse<SpacedRepetitionCard>>("/api/spaced-repetition/sets/cards/" + cardId));
    } catch (e) {
      return null;
    }

    if (spacedRepetitionCard.status === ApiResponseOptions.Success) {
      return spacedRepetitionCard.data;
    } else return null;
  }

  /**
   * Submits a spaced repetition card review
   *
   * @param body.id ID of the card to be updated
   * @param body.quality An integer from 0-3 that indicates how easily the information was remembered, with 0 being most difficult
   * @Param body.recallTime The time it took to recall the card, measured in milliseconds
   *
   * @returns Updated `Card` object
   */
  async reviewSpacedRepetitionCard(body: {
    id: string;
    quality: number;
    recallTime: number
  }): Promise<SpacedRepetitionSet | null> {
    let spacedRepetitionSet: ApiResponse<SpacedRepetitionSet> | undefined;

    console.log(body);

    try {
      spacedRepetitionSet = await lastValueFrom(this.http.post<ApiResponse<SpacedRepetitionSet>>("/api/spaced-repetition/sets/cards/" + body.id + "/review", {
        quality: body.quality,
        recallTime: body.recallTime
      }));
    } catch (e) {
      return null;
    }

    if (spacedRepetitionSet.status === ApiResponseOptions.Success) {
      return spacedRepetitionSet.data;
    } else return null;
  }
}
