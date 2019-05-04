import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SogebankComponent } from './sogebank.component';

describe('SogebankComponent', () => {
  let component: SogebankComponent;
  let fixture: ComponentFixture<SogebankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SogebankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SogebankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
