import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginBanquePriveComponent } from "./login-banque-prive.component";

describe('LoginBanquePriveComponent', () => {
  let component: LoginBanquePriveComponent;
  let fixture: ComponentFixture<LoginBanquePriveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginBanquePriveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginBanquePriveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
