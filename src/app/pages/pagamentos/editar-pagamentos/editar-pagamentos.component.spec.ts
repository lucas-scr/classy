import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarPagamentosComponent } from './editar-pagamentos.component';

describe('EditarPagamentosComponent', () => {
  let component: EditarPagamentosComponent;
  let fixture: ComponentFixture<EditarPagamentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarPagamentosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarPagamentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
