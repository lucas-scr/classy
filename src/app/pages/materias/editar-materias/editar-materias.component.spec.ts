import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarMateriasComponent } from './editar-materias.component';

describe('EditarMateriasComponent', () => {
  let component: EditarMateriasComponent;
  let fixture: ComponentFixture<EditarMateriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarMateriasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarMateriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
