import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ApiResponse, ApiResponseOptions, SpacedRepetitionSet } from "@scholarsome/shared";
import { lastValueFrom } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class SpacedRepetitionService {
  constructor(private readonly http: HttpClient) {}

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
   *
   * @returns Created `Folder` object
   */
  async createSpacedRepetitionSets(setId: string): Promise<SpacedRepetitionSet | null> {
    let spacedRepetitionSet: ApiResponse<SpacedRepetitionSet> | undefined;

    try {
      spacedRepetitionSet = await lastValueFrom(this.http.post<ApiResponse<SpacedRepetitionSet>>("/api/spaced-repetition/sets/" + setId, {}));
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
   * @param body.title Optional, title of the folder
   * @param body.description Optional, description of the folder
   * @param body.private Optional, whether the folder should be publicly visible
   * @param body.sets Optional, array of the sets that should be within the folder
   *
   * @returns Updated `Folder` object
   */
  async updateFolder(body: {
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
}
