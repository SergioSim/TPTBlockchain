import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartesSogebankComponent } from './cartes-sogebank.component';

describe('CartesSogebankComponent', () => {
  let component: CartesSogebankComponent;
  let fixture: ComponentFixture<CartesSogebankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartesSogebankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartesSogebankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
