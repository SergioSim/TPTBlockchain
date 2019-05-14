import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InscriptionParticulierComponent } from './inscription-particulier.component';

describe('InscriptionParticulierComponent', () => {
  let component: InscriptionParticulierComponent;
  let fixture: ComponentFixture<InscriptionParticulierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InscriptionParticulierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InscriptionParticulierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
