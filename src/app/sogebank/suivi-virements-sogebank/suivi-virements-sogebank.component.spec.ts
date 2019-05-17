import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviVirementsSogebankComponent } from './suivi-virements-sogebank.component';

describe('RelevesSogebankComponent', () => {
  let component: SuiviVirementsSogebankComponent;
  let fixture: ComponentFixture<SuiviVirementsSogebankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuiviVirementsSogebankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuiviVirementsSogebankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
