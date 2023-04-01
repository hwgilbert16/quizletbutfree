import { Component, ComponentRef, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Set } from "@scholarsome/shared";
import { SetsService } from "../../shared/http/sets.service";
import { CardComponent } from "../../shared/card/card.component";
import { UsersService } from "../../shared/http/users.service";

@Component({
  selector: 'scholarsome-view-study-sets',
  templateUrl: './view-study-sets.component.html',
  styleUrls: ['./view-study-sets.component.scss']
})
export class ViewStudySetsComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private sets: SetsService,
    private users: UsersService,
    private router: Router
  ) {}

  @ViewChild('spinner', { static: true }) spinner: ElementRef;
  @ViewChild('container', { static: true }) container: ElementRef;

  @ViewChild('editButton', { static: true }) editButton: ElementRef;

  @ViewChild('cardsContainer', { static: true, read: ViewContainerRef }) cardsContainer: ViewContainerRef;

  userIsAuthor = false;
  editing = false;

  setId: string | null;
  author: string;

  cards: ComponentRef<CardComponent>[] = [];

  set: Set | null;

  cookieExists(name: string): boolean {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      if (cookie.includes(name)) {
        return true;
      }
    }

    return false;
  }

  updateCardIndices() {
    for (let i = 0; i < this.cards.length; i++) {
      this.cards[i].instance.cardIndex = i;

      this.cards[i].instance.upArrow = i !== 0;
      this.cards[i].instance.downArrow = this.cards.length - 1 !== i;
    }
  }

  addCard(opts: {
    id?: string;
    index?: number;
    editingEnabled: boolean;
    upArrow?: boolean;
    downArrow?: boolean;
    term?: string;
    definition?: string;
  }) {
    const card = this.cardsContainer.createComponent<CardComponent>(CardComponent);

    card.instance.cardId = opts.id ? opts.id : '';
    card.instance.cardIndex = opts.index ? opts.index : this.cards.length;
    card.instance.editingEnabled = opts.editingEnabled;
    card.instance.upArrow = opts.upArrow ? opts.upArrow : false;
    card.instance.downArrow = opts.downArrow ? opts.downArrow : false;
    card.instance.termValue = opts.term ? opts.term : '';
    card.instance.definitionValue = opts.definition ? opts.definition : '';

    card.instance.deleteCardEvent.subscribe(e => {
      if (this.cardsContainer.length > 1) {
        this.cardsContainer.get(e)?.destroy();

        this.cards.splice(this.cards.map(c => c.instance.cardIndex).indexOf(e), 1);

        this.updateCardIndices();
      }
    });

    card.instance.moveCardEvent.subscribe(e => {
      if (this.cardsContainer.length > 1) {
        this.cards.splice(card.instance.cardIndex + e.direction, 0, this.cards.splice(card.instance.cardIndex, 1)[0]);

        this.cardsContainer.move(card.hostView, e.index + e.direction);
        card.instance.cardIndex = e.index + e.direction;

        this.updateCardIndices();
      }
    });

    this.cards.push(card);
    this.updateCardIndices();
  }

  editCards() {
    this.editing = true;

    for (const [i, card] of this.cards.entries()) {
      card.instance.editingEnabled = true;
      card.instance.cardIndex = i;

      card.instance.upArrow = i !== 0;
      card.instance.downArrow = this.cards.length - 1 !== i;
    }
  }

  async saveCards() {
    if (this.set) {
      for (const card of this.cards) {
        if (card.instance.term.length < 1 || card.instance.definition.length < 1) {
          return card.instance.notifyEmptyInput();
        }
      }

      for (const card of this.cards) {
        card.instance.editingEnabled = false;
        card.instance.termValue = card.instance.term;
        card.instance.definitionValue = card.instance.definition;
      }

      await this.sets.updateSet({
        id: this.set.id,
        cards: this.cards.map(c => {
          return {
            id: c.instance.cardId,
            index: c.instance.cardIndex,
            term: c.instance.term,
            definition: c.instance.definition
          };
        })
      });

      this.editing = false;
    }
  }

  viewCards() {
    this.editing = false;

    this.cards = [];
    this.cardsContainer.clear();

    if (this.set) {
      // sort the cards by index
      for (const card of this.set.cards.sort((a, b) => {
        return a.index - b.index;
      })) {
        this.addCard({
          id: card.id,
          index: card.index,
          editingEnabled: false,
          term: card.term,
          definition: card.definition
        });
      }
    }
  }

  async ngOnInit(): Promise<void> {
    this.setId = this.route.snapshot.paramMap.get('setId');
    if (!this.setId) {
      await this.router.navigate(['404']);
      return;
    }

    this.set = await this.sets.set(this.setId);
    if (!this.set) {
      await this.router.navigate(['404']);
      return;
    }

    if (this.cookieExists('authenticated')) {
      const user = await this.users.user('self');

      if (user && user.id === this.set.author.id) {
        this.userIsAuthor = true;
      }
    }

    this.spinner.nativeElement.remove();

    this.author = this.set.author.username;
    this.container.nativeElement.removeAttribute('hidden');

    this.viewCards();
  }
}
