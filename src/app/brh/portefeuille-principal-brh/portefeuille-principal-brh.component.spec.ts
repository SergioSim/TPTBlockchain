import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortefeuillePrincipalBrhComponent } from './portefeuille-principal-brh.component';

describe('PortefeuillePrincipalBrhComponent', () => {
  let component: PortefeuillePrincipalBrhComponent;
  let fixture: ComponentFixture<PortefeuillePrincipalBrhComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortefeuillePrincipalBrhComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortefeuillePrincipalBrhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
