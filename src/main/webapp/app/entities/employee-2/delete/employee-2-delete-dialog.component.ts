import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEmployee2 } from '../employee-2.model';
import { Employee2Service } from '../service/employee-2.service';

@Component({
  templateUrl: './employee-2-delete-dialog.component.html',
})
export class Employee2DeleteDialogComponent {
  employee2?: IEmployee2;

  constructor(protected employee2Service: Employee2Service, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.employee2Service.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
