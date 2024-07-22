import { Component, TemplateRef, ViewChild } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { faCancel, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { SpacedRepetitionService } from "../../shared/http/spaced-repetition.service";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";

@Component({
  selector: "scholarsome-spaced-repetition-settings-modal",
  templateUrl: "./spaced-repetition-settings-modal.component.html",
  styleUrls: ["./spaced-repetition-settings-modal.component.scss"]
})
export class SpacedRepetitionSettingsModalComponent {
  constructor(
    private readonly bsModalService: BsModalService,
    private readonly router: Router,
    private readonly spacedRepetitionService: SpacedRepetitionService
  ) {
    this.bsModalService.onHide.subscribe(() => {
      this.clicked = false;
      this.error = false;
    });
  }

  @ViewChild("modal") modal: TemplateRef<HTMLElement>;

  protected cardsInSet: number;
  protected cardsPerDay: number;
  protected answerWith: "TERM" | "DEFINITION" = "TERM";

  protected deleteClicked = false;
  protected clicked = false;
  protected error = false;

  protected setId: string;

  protected readonly faTrashCan = faTrashCan;

  protected modalRef?: BsModalRef;

  protected async deleteSpacedRepetitionSet() {
    await this.spacedRepetitionService.deleteSpacedRepetitionSet(this.setId);

    this.modalRef?.hide();

    this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
      this.router.navigate(["/study-set", this.setId]);
    });
  }

  protected async submit(form: NgForm) {
    this.clicked = true;
    this.error = false;

    const update = await this.spacedRepetitionService.updateSpacedRepetitionSet({
      id: this.setId,
      cardsPerDay: form.value["cardsPerDay"],
      answerWith: this.answerWith
    });

    if (update) {
      this.clicked = false;
      this.modalRef?.hide();

      this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
        this.router.navigate(["/study-set", this.setId]);
      });
    } else {
      this.error = true;
    }
  }

  public open(cardsInSet: number, setId: string, cardsPerDay: number, answerWith: "TERM" | "DEFINITION"): BsModalRef {
    this.modalRef = this.bsModalService.show(this.modal);
    this.cardsInSet = cardsInSet;
    this.setId = setId;
    this.cardsPerDay = cardsPerDay;
    this.answerWith = answerWith;

    return this.modalRef;
  }

  protected readonly faCancel = faCancel;
}
