import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ObjectSelectionPaneComponent } from './object-selection-pane.component';

describe('ObjectSelectionPaneComponent', () => {
  let component: ObjectSelectionPaneComponent;
  let fixture: ComponentFixture<ObjectSelectionPaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjectSelectionPaneComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ObjectSelectionPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
