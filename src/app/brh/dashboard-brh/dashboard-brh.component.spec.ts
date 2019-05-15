import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardBrhComponent } from './dashboard-brh.component';

describe('DashboardBrhComponent', () => {
  let component: DashboardBrhComponent;
  let fixture: ComponentFixture<DashboardBrhComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardBrhComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardBrhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
