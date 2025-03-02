import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BibliotecaService } from '../biblioteca.service';
import { ConfirmationService } from 'primeng/api';
import { NgForm } from '@angular/forms';
import { IAutor, IEditorial, ILibro } from '../biblioteca.interface';

@Component({
  selector: 'app-libros',
  templateUrl: './libros.component.html',
  styleUrls: ['./libros.component.css'],
  providers: [ConfirmationService],
})
export class LibrosComponent implements OnInit {
  constructor(
    private bibliotecaService: BibliotecaService,
    private confirmationService: ConfirmationService
  ) {}

  @ViewChild('formulario') formulario!: NgForm;
  @ViewChild('fileInput') fileInput!: ElementRef;
  visibleError = false;
  mensajeError = '';
  libros: ILibro[] = [];
  autores: IAutor[] = [];
  editoriales: IEditorial[] = [];
  visibleConfirm = false;
  urlImagen = '';
  visibleFoto = false;
  foto = '';

  libro: ILibro = {
    isbn: 0,
    titulo: '',
    paginas: 0,
    precio: 0,
    foto: null,
    fotoPortada: null,
    descatalogado: false,
    autorId: null,
    editorialId: null,
  };
  ngOnInit(): void {
    this.getAutores();
    this.getEditoriales();
    this.getLibros();
  }

  getAutores() {
    this.bibliotecaService.getAutores().subscribe({
      next: (data) => {
        this.visibleError = false;
        this.autores = data;
      },
      error: (err) => {
        this.visibleError = true;
        this.controlarError(err);
      },
    });
  }

  getEditoriales() {
    this.bibliotecaService.getEditoriales().subscribe({
      next: (data) => {
        this.visibleError = false;
        this.editoriales = data;
      },
      error: (err) => {
        this.visibleError = true;
        this.controlarError(err);
      },
    });
  }

  getLibros() {
    this.bibliotecaService.getLibros().subscribe({
      next: (data) => {
        this.visibleError = false;
        this.libros = data;
      },
      error: (err) => {
        this.visibleError = true;
        this.controlarError(err);
      },
    });
  }

  onChange(event: any) {
    const file = event.target.files;

    if (file && file.length > 0) {
      this.libro.foto = file[0];
      this.libro.fotoNombre = file[0].name;
    }
  }

  onAceptar() {
    // Después de procesar el archivo seleccionado, borrar su contenido del input
    this.fileInput.nativeElement.value = '';
  }

  showImage(libro: ILibro) {
    if (this.visibleFoto && this.libro === libro) {
      // Si la imagen ya está visible y el mismo libro fue seleccionado, oculta el diálogo
      this.visibleFoto = false;
    } else {
      // Si es un nuevo libro o el diálogo está oculto, muestra la imagen
      this.libro = libro;
      this.foto = libro.fotoPortada!;
      this.visibleFoto = true;
    }
  }

  guardar() {
    if (this.libro.isbn === 0) {
      this.bibliotecaService.addLibro(this.libro).subscribe({
        next: (data) => {
          this.visibleError = false;
          this.formulario.reset();
          this.getLibros();
        },
        error: (err) => {
          console.log(err);
          this.visibleError = true;
          this.controlarError(err);
        },
      });
    } else {
      this.bibliotecaService.updateLibro(this.libro).subscribe({
        next: (data) => {
          this.visibleError = false;
          this.cancelarEdicion();
          this.formulario.reset();
          this.getLibros();
        },
        error: (err) => {
          this.visibleError = true;
          this.controlarError(err);
        },
      });
    }
  }

  confirmDelete(libro: ILibro) {
    this.confirmationService.confirm({
      message: `Eliminar el libro ${libro.titulo}?`,
      header: 'Estás seguro?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí´',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.deleteLibro(libro.isbn),
    });
  }

  deleteLibro(id: number) {
    this.bibliotecaService.deleteLibro(id).subscribe({
      next: (data: ILibro) => {
        this.visibleError = false;
        this.getLibros();
      },
      error: (err: any) => {
        this.visibleError = true;
        this.controlarError(err);
      },
    });
  }

  edit(libro: ILibro) {
    const editorialEncontrada = this.editoriales.find(c => c.nombreEditorial === libro.nombreEditorial);
    const autorEncontrado = this.autores.find(c => c.nombreAutor === libro.nombreAutor);
    this.libro = { ...libro };
    this.libro.editorialId = editorialEncontrada?.idEditorial ?? null;
    this.libro.autorId = autorEncontrado?.idAutor ?? null;
     // Mantener el nombre de la imagen existente
    this.libro.fotoNombre = libro.fotoPortada
      ? this.extraerNombreImagen(libro.fotoPortada)
      : ''; // Extraer nombre si tiene imagen
       // No establecer this.libro.foto a menos que se seleccione una nueva imagen
      this.libro.foto = null; // Resetear el archivo al editar
  }

  extraerNombreImagen(url: string): string {
    return url.split('/').pop() || ''; // Extraer el nombre de la imagen de la URL
  }

  cancelarEdicion() {
    this.libro = {
      isbn: 0,
      titulo: '',
      paginas: 0,
      precio: 0,
      descatalogado: false,
      autorId: 0,
      editorialId: 0,
      foto: null,
      fotoPortada: null,
    };
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
