import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesConfigPageComponent } from './companies-config-page.component';

describe('CompaniesConfigPageComponent', () => {
  let component: CompaniesConfigPageComponent;
  let fixture: ComponentFixture<CompaniesConfigPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaniesConfigPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesConfigPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
