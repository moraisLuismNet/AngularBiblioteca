import { Component, OnInit, ViewChild } from '@angular/core';
import { BibliotecaService } from '../biblioteca.service';
import { NgForm } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { IEditorial } from '../biblioteca.interface';


@Component({
  selector: 'app-editoriales',
  templateUrl: './editoriales.component.html',
  styleUrls: ['./editoriales.component.css'],
  providers: [ConfirmationService],
})
export class EditorialesComponent implements OnInit {
  constructor(
    private bibliotecaService: BibliotecaService,
    private confirmationService: ConfirmationService
  ) {}
  @ViewChild('formulario') formulario!: NgForm;
  visibleError = false;
  mensajeError = '';
  editoriales: IEditorial[] = [];
  visibleConfirm = false;

  editorial: IEditorial = {
    idEditorial: 0,
    nombreEditorial: '',
  };

  ngOnInit(): void {
    this.getEditoriales();
  }

  getEditoriales() {
    this.bibliotecaService.getEditoriales().subscribe({
      next: (data) => {
        console.log(data);
        this.visibleError = false;
        this.editoriales = data;
      },
      error: (err) => {
        this.visibleError = true;
        this.controlarError(err);
      },
    });
  }

  guardar() {
    if (this.editorial.idEditorial === 0) {
      this.bibliotecaService.addEditorial(this.editorial).subscribe({
        next: (data) => {
          this.visibleError = false;
          this.formulario.reset();
          this.getEditoriales();
        },
        error: (err) => {
          console.log(err);
          this.visibleError = true;
          this.controlarError(err);
        },
      });
    } else {
      this.bibliotecaService.updateEditorial(this.editorial).subscribe({
        next: (data) => {
          this.visibleError = false;
          this.cancelarEdicion();
          this.formulario.reset();
          this.getEditoriales();
        },
        error: (err) => {
          this.visibleError = true;
          this.controlarError(err);
        },
      });
    }
  }

  edit(editorial: IEditorial) {
    this.editorial = { ...editorial };
  }

  cancelarEdicion() {
    this.editorial = {
      idEditorial: 0,
      nombreEditorial: '',
    };
  }

  confirmDelete(editorial: IEditorial) {
    this.confirmationService.confirm({
      message: `Eliminar la editorial ${editorial.nombreEditorial}?`,
      header: 'Estás seguro?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.deleteEditorial(editorial.idEditorial!),
    });
  }

  deleteEditorial(id: number) {
    this.bibliotecaService.deleteEditorial(id).subscribe({
      next: (data) => {
        this.visibleError = false;
        this.formulario.reset({
          nombreEditorial: '',
        });
        this.getEditoriales();
      },
      error: (err) => {
        this.visibleError = true;
        this.controlarError(err);
      },
    });
  }

  controlarError(err: any) {
    if (err.error && typeof err.error === 'object' && err.error.message) {
      this.mensajeError = err.error.message;
    } else if (typeof err.error === 'string') {
      // Si `err.error` es un string, se asume que es el mensaje de error
      this.mensajeError = err.error;
    } else {
      // Maneja el caso en el que no se recibe un mensaje de error útil
      this.mensajeError = 'Se ha producido un error inesperado';
    }
  }
}
