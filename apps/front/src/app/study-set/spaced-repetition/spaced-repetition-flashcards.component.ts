import { Component, HostListener, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DomSanitizer, Title } from "@angular/platform-browser";
import { Side, Card } from "@prisma/client";
import { BsModalRef } from "ngx-bootstrap/modal";
import { faThumbsUp, faCake } from "@fortawesome/free-solid-svg-icons";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { SpacedRepetitionService } from "../../shared/http/spaced-repetition.service";
import { UsersService } from "../../shared/http/users.service";
import { DateTime } from "luxon";
import { SharedService } from "../../shared/shared.service";
import { SpacedRepetitionCard } from "@scholarsome/shared";

@Component({
  selector: "scholarsome-spaced-repetition-flashcards",
  templateUrl: "./spaced-repetition-flashcards.component.html",
  styleUrls: ["./spaced-repetition-flashcards.component.scss"]
})
export class SpacedRepetitionFlashcardsComponent implements OnInit {
  constructor(
    private readonly route: ActivatedRoute,
    private readonly usersService: UsersService,
    private readonly router: Router,
    private readonly titleService: Title,
    private readonly spacedRepetitionService: SpacedRepetitionService,
    private readonly sharedService: SharedService,
    public readonly sanitizer: DomSanitizer
  ) {}

  @ViewChild("flashcardsConfig") configModal: TemplateRef<HTMLElement>;
  @ViewChild("completedRound") roundCompletedModal: TemplateRef<HTMLElement>;

  protected cards: (Omit<SpacedRepetitionCard, "due" | "lastStudiedAt" | "spacedRepetitionSet"> & { due: DateTime, lastStudiedAt: DateTime })[];
  protected setId: string | null;

  // What the user answers with
  protected answer: Side;
  // The current index
  protected index = 0;
  // The current card
  protected currentCard: Omit<SpacedRepetitionCard, "due" | "lastStudiedAt" | "spacedRepetitionSet"> & { due: DateTime, lastStudiedAt: DateTime };

  // The current side being shown
  protected side: string;
  // The text being shown to the user
  protected sideText = "";
  // Displayed in bottom right showing the progress
  protected remainingCards = "";

  // Whether the card has been flipped or not
  protected flipped = false;
  // Whether the first flip interaction has been made
  // needed to prevent animation classes from being applied until first click
  protected flipInteraction = false;

  protected modalRef?: BsModalRef;
  protected readonly faThumbsUp = faThumbsUp;
  protected readonly faCake = faCake;
  protected readonly faQuestionCircle = faQuestionCircle;

  @HostListener("document:keypress", ["$event"])
  keyboardSpaceEvent(event: KeyboardEvent) {
    if (
      this.index !== this.cards.length - 1 &&
      event.key === " "
    ) {
      this.flipCard();
    }
  }

  updateIndex() {
    this.remainingCards = `${this.index + 1}/${this.cards.length}`;
  }

  flipCard(type?: string) {
    if (!type) {
      this.flipInteraction = true;
      this.flipped = !this.flipped;
    }

    // delayed to occur when text is the least visible during animation
    setTimeout(() => {
      if (this.side === "term") {
        this.sideText = this.cards[this.index].card.definition;
        this.side = "definition";
      } else {
        this.sideText = this.cards[this.index].card.term;
        this.side = "term";
      }
    }, 150);
  }

  changeCard(direction: number) {
    if (
      this.index === 0 &&
      direction === -1
    ) return;

    if (
      this.index === this.cards.length - 1 &&
      direction === 1
    ) return;

    // increment the currentCard object to the next card in the array
    if (this.index !== this.cards.length - 1) {
      this.currentCard = this.cards[this.index + 1];
    }

    this.index += direction;
    this.updateIndex();

    this.flipInteraction = false;
    this.flipped = false;

    if (this.answer === Side.DEFINITION) {
      this.side = "term";
    } else {
      this.side = "definition";
    }

    this.sideText =
      this.answer === Side.DEFINITION ? this.cards[this.index].card.term : this.cards[this.index].card.definition;
  }

  reloadPage() {
    this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
      this.router.navigate(["/study-set/" + this.setId + "/flashcards"]);
    });
  }

  async ngOnInit(): Promise<void> {
    this.setId = this.route.snapshot.paramMap.get("setId");
    if (!this.setId) {
      await this.router.navigate(["404"]);
      return;
    }

    const user = await this.usersService.myUser();
    if (!user) {
      await this.router.navigate(["404"]);
      return;
    }

    const spacedRepetitionSet = await this.spacedRepetitionService.spacedRepetitionSet(this.setId);
    if (!spacedRepetitionSet) {
      await this.router.navigate(["404"]);
      return;
    }

    this.titleService.setTitle(spacedRepetitionSet.set.title + " Spaced Repetition — Scholarsome");

    const cards = [];

    // convert times to Luxon DateTimes
    // and sort in increasing order
    const spacedRepetitionCards: (Omit<SpacedRepetitionCard, "due" | "lastStudiedAt" | "spacedRepetitionSet"> & { due: DateTime, lastStudiedAt: DateTime })[] =
      spacedRepetitionSet.spacedRepetitionCards
          .map((card): Omit<SpacedRepetitionCard, "due" | "lastStudiedAt" | "spacedRepetitionSet"> & { due: DateTime, lastStudiedAt: DateTime } => ({
            ...card,
            due: this.sharedService.convertUtcStringToTimeZone(card.due.toString(), user.timezone) ?? DateTime.now(),
            lastStudiedAt: this.sharedService.convertUtcStringToTimeZone(card.lastStudiedAt.toString(), user.timezone) ?? DateTime.now()
          }))
          .sort((a, b) => a.due.toMillis() - b.due.toMillis());

    // array is sorted in increasing order
    // so find the first card that has a due date >1970
    const firstStudiedCard = spacedRepetitionCards.findIndex((c) => c.due.toMillis() !== DateTime.fromISO("1970-01-01T00:00:01.000Z").toMillis());

    // get the cards from the original array that haven't been studied before
    // and put them in a separate array
    const newCards = spacedRepetitionCards.splice(0, firstStudiedCard);

    // get cards that are due today, up to the daily limit
    cards.push(...spacedRepetitionCards.slice(0, spacedRepetitionSet.cardsPerDay));

    // if the array isn't full, fill it with new cards
    // ones that are due take priority over old ones
    if (cards.length < spacedRepetitionSet.cardsPerDay) {
      cards.push(...newCards.splice(0, spacedRepetitionSet.cardsPerDay - cards.length + 1));
    }

    this.cards = cards.sort(() => 0.5 - Math.random());
    this.answer = spacedRepetitionSet.answerWith;
    this.side = this.answer === Side.DEFINITION ? Side.TERM : Side.DEFINITION;

    this.updateIndex();

    this.sideText = this.cards[0]["card"][this.side.toLowerCase() as keyof Card] as string;
    this.currentCard = this.cards[0];
  }
}
