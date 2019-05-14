import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VirementsParticulierComponent } from './virements-particulier.component';

describe('VirementsParticulierComponent', () => {
  let component: VirementsParticulierComponent;
  let fixture: ComponentFixture<VirementsParticulierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VirementsParticulierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VirementsParticulierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
