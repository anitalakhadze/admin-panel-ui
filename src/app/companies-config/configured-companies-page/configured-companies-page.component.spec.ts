import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguredCompaniesPageComponent } from './configured-companies-page.component';

describe('ConfiguredCompaniesPageComponent', () => {
  let component: ConfiguredCompaniesPageComponent;
  let fixture: ComponentFixture<ConfiguredCompaniesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfiguredCompaniesPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfiguredCompaniesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
