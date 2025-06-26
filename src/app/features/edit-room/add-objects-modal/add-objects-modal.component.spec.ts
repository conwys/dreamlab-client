import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddObjectsModalComponent } from './add-objects-modal.component';

describe('AddObjectsModalComponent', () => {
  let component: AddObjectsModalComponent;
  let fixture: ComponentFixture<AddObjectsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddObjectsModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddObjectsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
