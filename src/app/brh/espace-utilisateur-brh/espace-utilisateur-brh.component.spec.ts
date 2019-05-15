import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EspaceUtilisateurBrhComponent } from './espace-utilisateur-brh.component';

describe('EspaceUtilisateurBrhComponent', () => {
  let component: EspaceUtilisateurBrhComponent;
  let fixture: ComponentFixture<EspaceUtilisateurBrhComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EspaceUtilisateurBrhComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EspaceUtilisateurBrhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
