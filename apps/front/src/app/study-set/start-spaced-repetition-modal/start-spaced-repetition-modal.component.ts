import { Component, TemplateRef, ViewChild } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Set } from "@scholarsome/shared";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { NgForm } from "@angular/forms";
import { SpacedRepetitionService } from "../../shared/http/spaced-repetition.service";
import { getTimeZones } from "@vvo/tzdb";
import { Router } from "@angular/router";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "scholarsome-start-spaced-repetition-modal",
  templateUrl: "./start-spaced-repetition-modal.component.html",
  styleUrls: ["./start-spaced-repetition-modal.component.scss"]
})
export class StartSpacedRepetitionModalComponent {
  constructor(
    private readonly bsModalService: BsModalService,
    private readonly spacedRepetitionService: SpacedRepetitionService,
    private readonly router: Router
  ) {
    this.bsModalService.onHide.subscribe(() => {
      this.clicked = false;
      this.error = false;
    });
  }

  @ViewChild("modal") modal: TemplateRef<HTMLElement>;

  protected clicked = false;
  protected error = false;

  protected set: Set;
  protected userTimezone: string | undefined;

  protected modalRef?: BsModalRef;

  protected readonly faCalendarDays = faCalendarDays;
  protected readonly faQuestionCircle = faQuestionCircle;

  public open(set: Set, userTimezone: string): BsModalRef {
    this.modalRef = this.bsModalService.show(this.modal);
    this.set = set;

    const timezones = getTimeZones({ includeUtc: true });

    this.userTimezone = timezones.find((t) => t.name === userTimezone)?.alternativeName;

    return this.modalRef;
  }

  public async submit(form: NgForm) {
    this.clicked = true;

    const spacedRepetitionSet = await this.spacedRepetitionService.createSpacedRepetitionSet(this.set.id, Number(form.controls["cardsPerDay"].value));

    if (spacedRepetitionSet) {
      this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
        this.router.navigate(["/study-set", this.set.id]);
      });

      this.modalRef?.hide();
    } else {
      this.error = true;
      this.clicked = false;
      return;
    }
  }
}
