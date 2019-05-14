import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuParticulierComponent } from './menu-particulier.component';

describe('MenuParticulierComponent', () => {
  let component: MenuParticulierComponent;
  let fixture: ComponentFixture<MenuParticulierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuParticulierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuParticulierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
