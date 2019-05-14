import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartesParticulierComponent } from './cartes-particulier.component';

describe('CartesParticulierComponent', () => {
  let component: CartesParticulierComponent;
  let fixture: ComponentFixture<CartesParticulierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartesParticulierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartesParticulierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
