import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomUploaderComponent } from '../room-uploader/room-uploader.component';

@Component({
  selector: 'app-plan',
  standalone: true,
  imports: [CommonModule, RoomUploaderComponent],
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})
export class PlanComponent {}