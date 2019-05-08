
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuSogebankComponent } from './menu-sogebank.component';

describe('MenuSogebankComponent', () => {
  let component: MenuSogebankComponent;
  let fixture: ComponentFixture<MenuSogebankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuSogebankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuSogebankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
