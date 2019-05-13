import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccueilFooterComponent } from './accueil-footer.component';

describe('AccueilFooterComponent', () => {
  let component: AccueilFooterComponent;
  let fixture: ComponentFixture<AccueilFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccueilFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccueilFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
