import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginBrhComponent } from './login-brh.component';

describe('LoginBrhComponent', () => {
  let component: LoginBrhComponent;
  let fixture: ComponentFixture<LoginBrhComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginBrhComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginBrhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
