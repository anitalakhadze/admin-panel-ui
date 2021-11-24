import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsMainPageComponent } from './transactions-main-page.component';

describe('TransactionsMainPageComponent', () => {
  let component: TransactionsMainPageComponent;
  let fixture: ComponentFixture<TransactionsMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionsMainPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
