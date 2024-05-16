import { Component, TemplateRef, ViewChild } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { faNoteSticky, faCalendar, faSquareCheck, faClock } from "@fortawesome/free-regular-svg-icons";

@Component({
  selector: "scholarsome-spaced-repetition-introduction-modal",
  templateUrl: "./spaced-repetition-introduction-modal.component.html",
  styleUrls: ["./spaced-repetition-introduction-modal.component.scss"]
})
export class SpacedRepetitionIntroductionModalComponent {
  constructor(
    private readonly bsModalService: BsModalService
  ) {}

  @ViewChild("modal") modal: TemplateRef<HTMLElement>;

  protected modalRef?: BsModalRef;

  protected readonly faNoteSticky = faNoteSticky;
  protected readonly faCalendar = faCalendar;
  protected readonly faSquareCheck = faSquareCheck;
  protected readonly faClock = faClock;

  public open(): BsModalRef {
    this.modalRef = this.bsModalService.show(this.modal, { ignoreBackdropClick: true, keyboard: false });

    return this.modalRef;
  }
}
