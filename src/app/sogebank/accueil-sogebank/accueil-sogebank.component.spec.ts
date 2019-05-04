import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccueilSogebankComponent } from './accueil-sogebank.component';

describe('AccueilSogebankComponent', () => {
  let component: AccueilSogebankComponent;
  let fixture: ComponentFixture<AccueilSogebankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccueilSogebankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccueilSogebankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
