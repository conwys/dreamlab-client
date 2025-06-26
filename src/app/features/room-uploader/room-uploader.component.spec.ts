import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoomUploaderComponent } from './room-uploader.component';
import { ObjectUpload } from '../../models/object-upload';

describe('RoomUploaderComponent', () => {
  let component: RoomUploaderComponent;
  let fixture: ComponentFixture<RoomUploaderComponent>;

  let nextPageButton: HTMLButtonElement;
  let previousPageButton: HTMLButtonElement;

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

  describe('pagination', () => {
    function findButtonUiElements(): void {
      nextPageButton = fixture.nativeElement.querySelector('#next-page-btn');
      previousPageButton = fixture.nativeElement.querySelector('#previous-page-btn');
    }

    beforeEach(() => {
      component.itemsPerPage = 2;
      component.objects = [
        {} as ObjectUpload,
        {} as ObjectUpload,
        {} as ObjectUpload,
        {} as ObjectUpload,
        {} as ObjectUpload,
      ];
    });

    it('should create multiple pages', () => {
      expect(component.totalPages).toEqual(3);
    });

    it('should start on page 1', () => {
      expect(component.currentPage).toEqual(1);
    });

    it('should disable the next page button on last page', () => {
      component.currentPage = 3;
      fixture.detectChanges();

      findButtonUiElements();

      expect(nextPageButton.disabled).toBeTrue();
    });

    it('should disable the previous page button on first page', () => {
      component.currentPage = 1;
      fixture.detectChanges();

      findButtonUiElements();

      expect(previousPageButton.disabled).toBeTrue();
    });

    it('should move forward one page', () => {
      component.currentPage = 1;
      fixture.detectChanges();

      findButtonUiElements();

      nextPageButton.click();
      fixture.detectChanges();

      expect(component.currentPage).toEqual(2);
    });

    it('should move backward one page', () => {
      component.currentPage = 3;
      fixture.detectChanges();

      findButtonUiElements();

      previousPageButton.click();
      fixture.detectChanges();

      expect(component.currentPage).toEqual(2);
    });
  });
});
