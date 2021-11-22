import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesConfigMainPageComponent } from './companies-config-main-page.component';

describe('CompaniesConfigMainPageComponent', () => {
  let component: CompaniesConfigMainPageComponent;
  let fixture: ComponentFixture<CompaniesConfigMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaniesConfigMainPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesConfigMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
