import { Routes } from '@angular/router';
import { PlanComponent } from './plan/plan.component';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'plan', component: PlanComponent },
    { path: 'about', component: AboutComponent }
];
