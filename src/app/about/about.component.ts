import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: './about.component.html',
  styles: ['./about.component.scss'],
})
export class AboutComponent {}
