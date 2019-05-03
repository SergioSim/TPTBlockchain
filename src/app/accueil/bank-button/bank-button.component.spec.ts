import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankButtonComponent } from './bank-button.component';

describe('BankButtonComponent', () => {
  let component: BankButtonComponent;
  let fixture: ComponentFixture<BankButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
