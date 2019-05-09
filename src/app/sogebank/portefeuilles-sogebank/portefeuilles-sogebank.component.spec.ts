import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortefeuillesSogebankComponent } from './portefeuilles-sogebank.component';

describe('PortefeuillesSogebankComponent', () => {
  let component: PortefeuillesSogebankComponent;
  let fixture: ComponentFixture<PortefeuillesSogebankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortefeuillesSogebankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortefeuillesSogebankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
