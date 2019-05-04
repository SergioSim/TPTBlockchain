import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginSogebankComponent } from './login-sogebank.component';

describe('LoginSogebankComponent', () => {
  let component: LoginSogebankComponent;
  let fixture: ComponentFixture<LoginSogebankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginSogebankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginSogebankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
