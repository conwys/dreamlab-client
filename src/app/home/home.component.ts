import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="hero-section">
      <video #bgVideo autoplay muted loop playsinline preload="auto" crossorigin="anonymous" class="background-video">
        <source src="assets/room-3d.mp4" type="video/mp4">
      </video>
      <div class="video-overlay"></div>
      <div class="web-content">
        <h1>Build your <span class="gradient-text">dream</span>.</h1>
        <a class="btn" routerLink="/plan">Get started</a>
      </div>
    </div>
  `,
  styles: [`
    .hero-section {
      position: fixed;  // Changed from absolute to fixed
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      overflow: hidden;
      z-index: 1;  // Add z-index lower than navbar
    }

    .background-video {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: 1;
      filter: grayscale(100%);
    }

    .video-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.75);
      z-index: 2;
    }

    .web-content {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      font-family: 'Albert Sans', sans-serif;
      padding-top: 0;

      h1 {
        font-size: 10rem;
        color: #FFFFFF;
        margin-bottom: 2rem;
        text-align: center;

        .gradient-text {
          background: linear-gradient(45deg, #BE9DF4, #A0CAFB);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          display: inline-block;
        }
      }

      .btn {
        margin-top: 2rem;
        padding: 1rem 3rem;
        background-color: #BE9DF4;
        color: #fff;
        border: none;
        border-radius: 12px;
        font-size: 1.2rem;
        cursor: pointer;
        transition: background-color 0.3s ease;
        font-weight: 600;
        text-decoration: none;

        &:hover {
          background-color: #A0CAFB;
          transition: background-color 0.3s ease;
        }
      }
    }
  `]
})
export class HomeComponent {}
