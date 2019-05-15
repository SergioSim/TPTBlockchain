import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuBrhComponent } from './menu-brh.component';

describe('MenuBrhComponent', () => {
  let component: MenuBrhComponent;
  let fixture: ComponentFixture<MenuBrhComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuBrhComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuBrhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
