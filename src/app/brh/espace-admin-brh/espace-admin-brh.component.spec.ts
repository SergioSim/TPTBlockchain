import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EspaceAdminBrhComponent } from './espace-admin-brh.component';

describe('EspaceAdminBrhComponent', () => {
  let component: EspaceAdminBrhComponent;
  let fixture: ComponentFixture<EspaceAdminBrhComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EspaceAdminBrhComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EspaceAdminBrhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
