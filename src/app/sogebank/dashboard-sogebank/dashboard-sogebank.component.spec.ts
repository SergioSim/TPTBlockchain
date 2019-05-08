import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSogebankComponent } from './dashboard-sogebank.component';

describe('DashboardSogebankComponent', () => {
  let component: DashboardSogebankComponent;
  let fixture: ComponentFixture<DashboardSogebankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardSogebankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardSogebankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
