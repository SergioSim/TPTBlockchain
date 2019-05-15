import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HabilitationBrhComponent } from './habilitation-brh.component';

describe('HabilitationBrhComponent', () => {
  let component: HabilitationBrhComponent;
  let fixture: ComponentFixture<HabilitationBrhComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HabilitationBrhComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HabilitationBrhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
