import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="about-container">
      <h1>About DreamLab</h1>
      <p>We help you visualize and create your perfect living space through innovative 3D room planning.</p>
    </div>
  `,
  styles: [`
    .about-container {
      padding: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
      background-color: #202324;
      color: white;
      font-family: 'Albert Sans', sans-serif;

      h1 {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      p {
        font-size: 1.2rem;
        color: #888;
        max-width: 600px;
        text-align: center;
      }
    }
  `]
})
export class AboutComponent {}