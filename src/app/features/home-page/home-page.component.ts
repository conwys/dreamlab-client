import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: './home-page.component.ts',
  styles: ['./home-page.component.scss'],
})
export class HomePageComponent {}
