import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquiditeBrhComponent } from './liquidite-brh.component';

describe('LiquiditeBrhComponent', () => {
  let component: LiquiditeBrhComponent;
  let fixture: ComponentFixture<LiquiditeBrhComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiquiditeBrhComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiquiditeBrhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
