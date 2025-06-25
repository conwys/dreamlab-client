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

  readonly baseValue = 5;
  lengthValue = this.baseValue;
  widthValue = this.baseValue;
  heightValue = this.baseValue;
  scaleValue = 1;

  get lengthProgress() {
    return `${((this.lengthValue - this.baseValue) / (20 - this.baseValue)) * 100}%`;
  }
  get widthProgress() {
    return `${((this.widthValue - this.baseValue) / (20 - this.baseValue)) * 100}%`;
  }
  get scaleProgress() {
    // Scale ranges from 1 to 4 (1×5=5, 4×5=20)
    return `${((this.scaleValue - 1) / (4 - 1)) * 100}%`;
  }

  @Output() lengthChange = new EventEmitter<number>();
  @Output() widthChange = new EventEmitter<number>();
  @Output() heightChange = new EventEmitter<number>();
  @Output() scaleChange = new EventEmitter<number>();

  ngAfterViewInit() {
    // Initialize values if provided
    if (this.initialValue) {
      this.lengthValue = this.initialValue;
      this.widthValue = this.initialValue;
      this.heightValue = this.initialValue;
    }
    this.setUpEventListeners();
  }

  private setUpEventListeners(): void {
    document.querySelector('#length-control')?.addEventListener('input', (event) => {
      const value = parseInt((event.target as HTMLInputElement).value);
      this.lengthValue = value;
      this.lengthChange.emit(value);
    });

    document.querySelector('#width-control')?.addEventListener('input', (event) => {
      const value = parseInt((event.target as HTMLInputElement).value);
      this.widthValue = value;
      this.widthChange.emit(value);
    });

    document.querySelector('#scale-control')?.addEventListener('input', (event) => {
      const value = parseFloat((event.target as HTMLInputElement).value);
      this.scaleValue = value;
      this.lengthValue = this.baseValue * value;
      this.widthValue = this.baseValue * value;
      this.heightValue = this.baseValue * value;
      this.lengthChange.emit(this.lengthValue);
      this.widthChange.emit(this.widthValue);
      this.heightChange.emit(this.heightValue);
      this.scaleChange.emit(this.scaleValue);
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
  onScaleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.scaleValue = input.valueAsNumber;
    this.lengthValue = this.baseValue * this.scaleValue;
    this.widthValue = this.baseValue * this.scaleValue;
    this.heightValue = this.baseValue * this.scaleValue;
    this.lengthChange.emit(this.lengthValue);
    this.widthChange.emit(this.widthValue);
    this.heightChange.emit(this.heightValue);
    this.scaleChange.emit(this.scaleValue);
  }
}
