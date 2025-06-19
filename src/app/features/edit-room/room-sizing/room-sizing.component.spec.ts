import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomSizingComponent } from './room-sizing.component';

describe('RoomSizingComponent', () => {
  let component: RoomSizingComponent;
  let fixture: ComponentFixture<RoomSizingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomSizingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomSizingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});