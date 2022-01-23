import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CamionComponent } from './list/camion.component';
import { CamionDetailComponent } from './detail/camion-detail.component';
import { CamionUpdateComponent } from './update/camion-update.component';
import { CamionDeleteDialogComponent } from './delete/camion-delete-dialog.component';
import { CamionRoutingModule } from './route/camion-routing.module';

@NgModule({
  imports: [SharedModule, CamionRoutingModule],
  declarations: [CamionComponent, CamionDetailComponent, CamionUpdateComponent, CamionDeleteDialogComponent],
  entryComponents: [CamionDeleteDialogComponent],
})
export class CamionModule {}
