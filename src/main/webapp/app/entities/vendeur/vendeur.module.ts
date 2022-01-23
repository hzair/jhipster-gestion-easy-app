import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { VendeurComponent } from './list/vendeur.component';
import { VendeurDetailComponent } from './detail/vendeur-detail.component';
import { VendeurUpdateComponent } from './update/vendeur-update.component';
import { VendeurDeleteDialogComponent } from './delete/vendeur-delete-dialog.component';
import { VendeurRoutingModule } from './route/vendeur-routing.module';

@NgModule({
  imports: [SharedModule, VendeurRoutingModule],
  declarations: [VendeurComponent, VendeurDetailComponent, VendeurUpdateComponent, VendeurDeleteDialogComponent],
  entryComponents: [VendeurDeleteDialogComponent],
})
export class VendeurModule {}
