import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BanqueCommercialeComponent } from './banque-commerciale.component';

describe('BanqueCommercialeComponent', () => {
  let component: BanqueCommercialeComponent;
  let fixture: ComponentFixture<BanqueCommercialeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BanqueCommercialeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BanqueCommercialeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
