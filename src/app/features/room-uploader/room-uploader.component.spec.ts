import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoomUploaderComponent } from './room-uploader.component';

describe('RoomUploaderComponent', () => {
  let component: RoomUploaderComponent;
  let fixture: ComponentFixture<RoomUploaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomUploaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RoomUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
