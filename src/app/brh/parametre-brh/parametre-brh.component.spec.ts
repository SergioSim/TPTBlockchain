import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametreBrhComponent } from './parametre-brh.component';

describe('ParametreBrhComponent', () => {
  let component: ParametreBrhComponent;
  let fixture: ComponentFixture<ParametreBrhComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParametreBrhComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametreBrhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
