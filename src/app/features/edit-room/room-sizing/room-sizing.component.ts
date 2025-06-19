import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-room-sizing',
  imports: [],
  templateUrl: './room-sizing.component.html',
  styleUrl: './room-sizing.component.scss',
  standalone: true,
})
export class RoomSizingComponent implements AfterViewInit {
  @Output() lengthChange = new EventEmitter<number>();
  @Output() widthChange = new EventEmitter<number>();

  protected initialValue = 5;

  ngAfterViewInit() {
    this.setUpEventListeners();
  }

  private setUpEventListeners(): void {
    document
      .querySelector('#length-control')
      ?.addEventListener('input', (event) => {
        const value = parseInt((event.target as HTMLInputElement).value);
        this.lengthChange.emit(value);
      });

    document
      .querySelector('#width-control')
      ?.addEventListener('input', (event) => {
        const value = parseInt((event.target as HTMLInputElement).value);
        this.widthChange.emit(value);
      });
  }
}
