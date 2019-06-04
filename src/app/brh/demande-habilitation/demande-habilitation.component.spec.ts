import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeHabilitationComponent } from './demande-habilitation.component';

describe('DemandeHabilitationComponent', () => {
  let component: DemandeHabilitationComponent;
  let fixture: ComponentFixture<DemandeHabilitationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandeHabilitationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandeHabilitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
