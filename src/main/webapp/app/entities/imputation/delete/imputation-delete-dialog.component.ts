import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IImputation } from '../imputation.model';
import { ImputationService } from '../service/imputation.service';

@Component({
  templateUrl: './imputation-delete-dialog.component.html',
})
export class ImputationDeleteDialogComponent {
  imputation?: IImputation;

  constructor(protected imputationService: ImputationService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.imputationService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
