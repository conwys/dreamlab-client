import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideRouter } from '@angular/router';
import { ThemeService } from './services/theme.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  const mockThemeService = jasmine.createSpyObj(['toggleTheme']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        {
          provide: ThemeService,
          useValue: mockThemeService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle theme on button click', () => {
    mockThemeService.toggleTheme.calls.reset();
    const themeButton = fixture.nativeElement.querySelector('.theme-toggle');

    themeButton.click();
    fixture.detectChanges();

    expect(mockThemeService.toggleTheme).toHaveBeenCalled();
  });
});
