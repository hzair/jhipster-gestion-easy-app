import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { Employee2Component } from './list/employee-2.component';
import { Employee2DetailComponent } from './detail/employee-2-detail.component';
import { Employee2UpdateComponent } from './update/employee-2-update.component';
import { Employee2DeleteDialogComponent } from './delete/employee-2-delete-dialog.component';
import { Employee2RoutingModule } from './route/employee-2-routing.module';

@NgModule({
  imports: [SharedModule, Employee2RoutingModule],
  declarations: [Employee2Component, Employee2DetailComponent, Employee2UpdateComponent, Employee2DeleteDialogComponent],
  entryComponents: [Employee2DeleteDialogComponent],
})
export class Employee2Module {}
