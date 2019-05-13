import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EspaceUtilisateurParticulierComponent } from './espace-utilisateur-particulier.component';

describe('EspaceUtilisateurParticulierComponent', () => {
  let component: EspaceUtilisateurParticulierComponent;
  let fixture: ComponentFixture<EspaceUtilisateurParticulierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EspaceUtilisateurParticulierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EspaceUtilisateurParticulierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
