import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GamepageComponent } from './gamepage/gamepage.component';

const routes: Routes = [{
    path: "game",
    component: GamepageComponent
}, {
    pathMatch: "prefix",
    path: "",
    redirectTo: "/game"
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
