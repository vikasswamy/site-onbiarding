import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnBoardLevelComponent } from './on-board-level/on-board-level.component';


const routes: Routes = [
  {
    path:'',
    component:OnBoardLevelComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule,]
})
export class AddLevelRoutingModule { }
