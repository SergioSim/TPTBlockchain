import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrhComponent } from './brh.component';

describe('BrhComponent', () => {
  let component: BrhComponent;
  let fixture: ComponentFixture<BrhComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrhComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
