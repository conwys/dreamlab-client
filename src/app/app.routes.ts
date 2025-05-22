import { Routes } from '@angular/router';
import { PlanComponent } from './features/plan/plan.component';
import { HomePageComponent } from './features/home-page/home-page.component';
import { EditRoomComponent } from './features/edit-room/edit-room.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'plan', component: PlanComponent },
  { path: 'edit', component: EditRoomComponent },
];
