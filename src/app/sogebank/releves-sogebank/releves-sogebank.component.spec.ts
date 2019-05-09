import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelevesSogebankComponent } from './releves-sogebank.component';

describe('RelevesSogebankComponent', () => {
  let component: RelevesSogebankComponent;
  let fixture: ComponentFixture<RelevesSogebankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelevesSogebankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelevesSogebankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
