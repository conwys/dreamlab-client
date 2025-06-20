import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-room-sizing',
  imports: [],
  templateUrl: './room-sizing.component.html',
  styleUrl: './room-sizing.component.scss',
  standalone: true,
})
export class RoomSizingComponent implements AfterViewInit {
  @Input() initialValue?: number;

  lengthValue = 5;
  widthValue = 5;
  heightValue = 5;

  get lengthProgress() {
    return `${((this.lengthValue - 5) / (20 - 5)) * 100}%`;
  }
  get widthProgress() {
    return `${((this.widthValue - 5) / (20 - 5)) * 100}%`;
  }
  get heightProgress() {
    return `${((this.heightValue - 5) / (20 - 5)) * 100}%`;
  }

  @Output() lengthChange = new EventEmitter<number>();
  @Output() widthChange = new EventEmitter<number>();
  @Output() heightChange = new EventEmitter<number>();

  ngAfterViewInit() {
    this.setUpEventListeners();
  }

  private setUpEventListeners(): void {
    document
      .querySelector('#length-control')
      ?.addEventListener('input', (event) => {
        const value = parseInt((event.target as HTMLInputElement).value);
        this.lengthValue = value;
        this.lengthChange.emit(value);
      });

    document
      .querySelector('#width-control')
      ?.addEventListener('input', (event) => {
        const value = parseInt((event.target as HTMLInputElement).value);
        this.widthValue = value;
        this.widthChange.emit(value);
      });

    document
      .querySelector('#height-control')
      ?.addEventListener('input', (event) => {
        const value = parseInt((event.target as HTMLInputElement).value);
        this.heightValue = value;
        this.heightChange.emit(value);
      });
  }

  onLengthInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.lengthValue = input.valueAsNumber;
    this.lengthChange.emit(this.lengthValue);
  }
  onWidthInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.widthValue = input.valueAsNumber;
    this.widthChange.emit(this.widthValue);
  }
  onHeightInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.heightValue = input.valueAsNumber;
    this.heightChange.emit(this.heightValue);
  }
}
