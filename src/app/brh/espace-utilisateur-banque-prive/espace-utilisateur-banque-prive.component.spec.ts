import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EspaceUtilisateurBanquePriveComponent } from './espace-utilisateur-banque-prive.component';

describe('EspaceUtilisateurBanquePriveComponent', () => {
  let component: EspaceUtilisateurBanquePriveComponent;
  let fixture: ComponentFixture<EspaceUtilisateurBanquePriveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EspaceUtilisateurBanquePriveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EspaceUtilisateurBanquePriveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
