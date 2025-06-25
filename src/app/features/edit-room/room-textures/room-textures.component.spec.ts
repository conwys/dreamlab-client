import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomTexturesComponent } from './room-textures.component';

describe('RoomSizingComponent', () => {
  let component: RoomTexturesComponent;
  let fixture: ComponentFixture<RoomTexturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomTexturesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RoomTexturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
