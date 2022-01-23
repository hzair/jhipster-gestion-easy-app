import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SortieComponent } from './list/sortie.component';
import { SortieDetailComponent } from './detail/sortie-detail.component';
import { SortieUpdateComponent } from './update/sortie-update.component';
import { SortieDeleteDialogComponent } from './delete/sortie-delete-dialog.component';
import { SortieRoutingModule } from './route/sortie-routing.module';

@NgModule({
  imports: [SharedModule, SortieRoutingModule],
  declarations: [SortieComponent, SortieDetailComponent, SortieUpdateComponent, SortieDeleteDialogComponent],
  entryComponents: [SortieDeleteDialogComponent],
})
export class SortieModule {}
