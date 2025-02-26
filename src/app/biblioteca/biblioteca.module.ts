import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BibliotecaComponent } from './biblioteca.component';
import { EditorialesComponent } from './editoriales/editoriales.component';
import { AutoresComponent } from './autores/autores.component';
import { LibrosComponent } from './libros/libros.component';
import { BibliotecaRoutingModule } from './biblioteca-routing.module';
import { BibliotecaService } from './biblioteca.service';
import { SharedModule } from "../shared/shared.module";
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';


@NgModule({
  declarations: [EditorialesComponent, AutoresComponent, LibrosComponent, BibliotecaComponent],
  imports: [CommonModule, BibliotecaRoutingModule, SharedModule,
    FormsModule, TableModule, ButtonModule,
    ConfirmDialogModule, DialogModule
  ],
  providers: [BibliotecaService]
})
export class BibliotecaModule {}
