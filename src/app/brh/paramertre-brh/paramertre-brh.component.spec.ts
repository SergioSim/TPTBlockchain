import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamertreBrhComponent } from './paramertre-brh.component';

describe('ParamertreBrhComponent', () => {
  let component: ParamertreBrhComponent;
  let fixture: ComponentFixture<ParamertreBrhComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParamertreBrhComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamertreBrhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
