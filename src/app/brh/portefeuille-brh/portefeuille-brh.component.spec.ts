import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortefeuilleBrhComponent } from './portefeuille-brh.component';

describe('PortefeuilleBrhComponent', () => {
  let component: PortefeuilleBrhComponent;
  let fixture: ComponentFixture<PortefeuilleBrhComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortefeuilleBrhComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortefeuilleBrhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
