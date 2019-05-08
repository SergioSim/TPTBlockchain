import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EspaceUtilisateurSogebankComponent } from './espace-utilisateur-sogebank.component';

describe('EspaceUtilisateurSogebankComponent', () => {
  let component: EspaceUtilisateurSogebankComponent;
  let fixture: ComponentFixture<EspaceUtilisateurSogebankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EspaceUtilisateurSogebankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EspaceUtilisateurSogebankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
