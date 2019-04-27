import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticulierComponent } from './particulier.component';

describe('ParticulierComponent', () => {
  let component: ParticulierComponent;
  let fixture: ComponentFixture<ParticulierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticulierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticulierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
