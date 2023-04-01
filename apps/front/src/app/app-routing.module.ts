import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { NotfoundComponent } from "./shared/notfound/notfound.component";

const routes: Routes = [
  {
    path: "",
    loadChildren: () => import("./landing/landing.module").then((m) => m.LandingModule)
  },
  {
    path: "create",
    loadChildren: () => import("./create/create.module").then((m) => m.CreateModule)
  },
  {
    path: "view",
    loadChildren: () => import("./view/view.module").then((m) => m.ViewModule)
  },
  {
    path: "404",
    component: NotfoundComponent
  },
  {
    path: "**",
    pathMatch: "full",
    redirectTo: "404"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules,
    relativeLinkResolution: "legacy"
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
