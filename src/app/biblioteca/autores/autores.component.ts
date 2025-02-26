import { Component, OnInit, ViewChild } from '@angular/core';
import { BibliotecaService } from '../biblioteca.service';
import { NgForm } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { IAutor } from '../biblioteca.interface';

@Component({
  selector: 'app-autores',
  templateUrl: './autores.component.html',
  styleUrls: ['./autores.component.css'],
  providers: [ConfirmationService],
})
export class AutoresComponent implements OnInit {
  constructor(
    private bibliotecaService: BibliotecaService,
    private confirmationService: ConfirmationService
  ) {}
  @ViewChild('formulario') formulario!: NgForm;
  visibleError = false;
  mensajeError = '';
  autores: IAutor[] = [];
  visibleConfirm = false;

  autor: IAutor = {
    idAutor: 0,
    nombreAutor: '',
  };

  ngOnInit(): void {
    this.getAutores();
  }

  getAutores() {
    this.bibliotecaService.getAutores().subscribe({
      next: (data) => {
        console.log(data);
        this.visibleError = false;
        this.autores = data;
      },
      error: (err) => {
        this.visibleError = true;
        this.controlarError(err);
      },
    });
  }

  guardar() {
    if (this.autor.idAutor === 0) {
      this.bibliotecaService.addAutor(this.autor).subscribe({
        next: (data) => {
          this.visibleError = false;
          this.formulario.reset();
          this.getAutores();
        },
        error: (err) => {
          console.log(err);
          this.visibleError = true;
          this.controlarError(err);
        },
      });
    } else {
      this.bibliotecaService.updateAutor(this.autor).subscribe({
        next: (data) => {
          this.visibleError = false;
          this.cancelarEdicion();
          this.formulario.reset();
          this.getAutores();
        },
        error: (err) => {
          this.visibleError = true;
          this.controlarError(err);
        },
      });
    }
  }

  edit(autor: IAutor) {
    this.autor = { ...autor };
  }

  cancelarEdicion() {
    this.autor = {
      idAutor: 0,
      nombreAutor: '',
    };
  }

  confirmDelete(autor: IAutor) {
    this.confirmationService.confirm({
      message: `Eliminar el autor ${autor.nombreAutor}?`,
      header: 'Estás seguro?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.deleteAutor(autor.idAutor!),
    });
  }

  deleteAutor(id: number) {
    this.bibliotecaService.deleteAutor(id).subscribe({
      next: (data) => {
        this.visibleError = false;
        this.formulario.reset({
          nombreAutor: '',
        });
        this.getAutores();
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
