import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccueilBrhComponent } from './accueil-brh.component';

describe('BrhComponent', () => {
  let component: AccueilBrhComponent;
  let fixture: ComponentFixture<AccueilBrhComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccueilBrhComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccueilBrhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
