import { Component, OnInit } from "@angular/core";
import { UsersService } from "../../shared/http/users.service";
import { NgForm } from "@angular/forms";
import { ApiResponseOptions } from "@scholarsome/shared";
import { getTimeZones } from "@vvo/tzdb";

@Component({
  selector: "scholarsome-timezone-settings",
  templateUrl: "./timezone-settings.component.html",
  styleUrls: ["./timezone-settings.component.scss"]
})
export class TimezoneSettingsComponent implements OnInit {
  constructor(private readonly usersService: UsersService) {}

  protected userTimezone: string;

  protected timezones = getTimeZones({ includeUtc: true });

  protected clicked = false;
  protected error = false;
  protected success = false;
  protected rateLimit = false;

  async ngOnInit() {
    const user = await this.usersService.myUser();

    if (user) {
      this.userTimezone = user.timezone;
    }
  }

  async submit(form: NgForm) {
    if (form.value["timezone"].length !== 0) {
      this.clicked = true;

      const response = await this.usersService.setMyTimezone(form.value["timezone"]);

      switch (response) {
        case ApiResponseOptions.Success:
          this.success = true;
          this.userTimezone = form.value["timezone"];
          form.resetForm();
          break;
        case ApiResponseOptions.Ratelimit:
          this.rateLimit = true;
          break;
        default:
          this.error = true;
          break;
      }

      this.clicked = false;
    }
  }
}
