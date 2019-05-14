import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableReleveSogebankComponent } from './table-releve-sogebank.component';

describe('TableReleveSogebankComponent', () => {
  let component: TableReleveSogebankComponent;
  let fixture: ComponentFixture<TableReleveSogebankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableReleveSogebankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableReleveSogebankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
