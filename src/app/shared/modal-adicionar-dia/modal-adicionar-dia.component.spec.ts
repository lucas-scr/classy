import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAdicionarDiaComponent } from './modal-adicionar-dia.component';

describe('ModalAdicionarDiaComponent', () => {
  let component: ModalAdicionarDiaComponent;
  let fixture: ComponentFixture<ModalAdicionarDiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAdicionarDiaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAdicionarDiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
