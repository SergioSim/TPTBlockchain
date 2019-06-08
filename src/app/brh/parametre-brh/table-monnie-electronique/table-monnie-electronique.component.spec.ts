import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableMonnieElectroniqueComponent } from './table-monnie-electronique.component';

describe('TableMonnieElectroniqueComponent', () => {
  let component: TableMonnieElectroniqueComponent;
  let fixture: ComponentFixture<TableMonnieElectroniqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableMonnieElectroniqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableMonnieElectroniqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
