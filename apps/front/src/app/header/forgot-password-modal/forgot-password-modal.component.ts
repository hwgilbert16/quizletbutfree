import { Component, TemplateRef, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../../auth/auth.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ApiResponseOptions } from "@scholarsome/shared";
import { Router } from "@angular/router";
import { ModalService } from "../../shared/modal.service";

@Component({
  selector: "scholarsome-forgot-password-modal",
  templateUrl: "./forgot-password-modal.component.html",
  styleUrls: ["./forgot-password-modal.component.scss"]
})
export class ForgotPasswordModalComponent {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly bsModalService: BsModalService,
    public readonly modalService: ModalService
  ) {
    this.bsModalService.onHide.subscribe(() => {
      this.response = null;
      this.clicked = false;
    });
  }

  @ViewChild("modal") modal: TemplateRef<HTMLElement>;

  protected clicked = false;
  protected response: ApiResponseOptions | null;

  protected publicAppEnv = false;
  protected onLandingPage = false;

  protected readonly ApiResponseOptions = ApiResponseOptions;
  protected modalRef?: BsModalRef;

  public open(): BsModalRef {
    this.publicAppEnv = process.env["NG_APP_ENV"] === "public";
    this.onLandingPage = this.router.url === "/";

    this.modalRef = this.bsModalService.show(this.modal, { ignoreBackdropClick: !this.publicAppEnv });
    return this.modalRef;
  }

  protected async submit(form: NgForm) {
    this.clicked = true;
    this.response = await this.authService.sendPasswordReset(form.value);
    this.clicked = false;
  }
}
