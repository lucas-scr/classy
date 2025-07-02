import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarContratosComponent } from './editar-contratos.component';

describe('EditarContratosComponent', () => {
  let component: EditarContratosComponent;
  let fixture: ComponentFixture<EditarContratosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarContratosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarContratosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
