import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VirementsSogebankComponent } from './virements-sogebank.component';

describe('VirementsSogebankComponent', () => {
  let component: VirementsSogebankComponent;
  let fixture: ComponentFixture<VirementsSogebankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VirementsSogebankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VirementsSogebankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
