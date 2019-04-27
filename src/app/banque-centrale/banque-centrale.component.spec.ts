import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BanqueCentraleComponent } from './banque-centrale.component';

describe('BanqueCentraleComponent', () => {
  let component: BanqueCentraleComponent;
  let fixture: ComponentFixture<BanqueCentraleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BanqueCentraleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BanqueCentraleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
