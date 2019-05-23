import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleveBrhComponent } from './releve-brh.component';

describe('ReleveBrhComponent', () => {
  let component: ReleveBrhComponent;
  let fixture: ComponentFixture<ReleveBrhComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReleveBrhComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleveBrhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
