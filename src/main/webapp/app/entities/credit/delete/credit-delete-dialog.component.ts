import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICredit } from '../credit.model';
import { CreditService } from '../service/credit.service';

@Component({
  templateUrl: './credit-delete-dialog.component.html',
})
export class CreditDeleteDialogComponent {
  credit?: ICredit;

  constructor(protected creditService: CreditService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.creditService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
