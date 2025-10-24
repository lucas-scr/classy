import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LancarAtividadeComponent } from './lancar-atividade.component';

describe('LancarAtividadeComponent', () => {
  let component: LancarAtividadeComponent;
  let fixture: ComponentFixture<LancarAtividadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LancarAtividadeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LancarAtividadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
