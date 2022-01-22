import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ImputationComponent } from './list/imputation.component';
import { ImputationDetailComponent } from './detail/imputation-detail.component';
import { ImputationUpdateComponent } from './update/imputation-update.component';
import { ImputationDeleteDialogComponent } from './delete/imputation-delete-dialog.component';
import { ImputationRoutingModule } from './route/imputation-routing.module';

@NgModule({
  imports: [SharedModule, ImputationRoutingModule],
  declarations: [ImputationComponent, ImputationDetailComponent, ImputationUpdateComponent, ImputationDeleteDialogComponent],
  entryComponents: [ImputationDeleteDialogComponent],
})
export class ImputationModule {}
