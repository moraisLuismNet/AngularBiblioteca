export interface IEditorial{
  idEditorial?: number;
  nombreEditorial: string;
  totalLibros?: number;
}

export interface IAutor {
  idAutor?: number;
  nombreAutor: string;
  totalLibros?: number;
}

export interface ILibro {
  isbn: number;
  titulo: string;
  paginas: number;
  precio: number;
  fotoPortada: string | null;
  foto?: File | null;
  fotoNombre?: string | null;
  descatalogado: boolean;
  autorId: number | null;
  editorialId: number | null;
  nombreAutor?: string;
  nombreEditorial?: string;
}
