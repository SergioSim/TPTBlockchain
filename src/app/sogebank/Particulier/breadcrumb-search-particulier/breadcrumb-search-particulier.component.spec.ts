import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadcrumbSearchParticulierComponent } from './breadcrumb-search-particulier.component';

describe('BreadcrumbSearchParticulierComponent', () => {
  let component: BreadcrumbSearchParticulierComponent;
  let fixture: ComponentFixture<BreadcrumbSearchParticulierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BreadcrumbSearchParticulierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadcrumbSearchParticulierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
