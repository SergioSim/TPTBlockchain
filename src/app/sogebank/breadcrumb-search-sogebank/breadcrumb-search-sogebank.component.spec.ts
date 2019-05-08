import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadcrumbSearchSogebankComponent } from './breadcrumb-search-sogebank.component';

describe('BreadcrumbSearchSogebankComponent', () => {
  let component: BreadcrumbSearchSogebankComponent;
  let fixture: ComponentFixture<BreadcrumbSearchSogebankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BreadcrumbSearchSogebankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadcrumbSearchSogebankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
