import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarAlunosComponent } from './editar-alunos.component';

describe('EditarAlunosComponent', () => {
  let component: EditarAlunosComponent;
  let fixture: ComponentFixture<EditarAlunosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarAlunosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarAlunosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
