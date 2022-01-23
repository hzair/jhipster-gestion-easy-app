import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICamion } from '../camion.model';
import { CamionService } from '../service/camion.service';

@Component({
  templateUrl: './camion-delete-dialog.component.html',
})
export class CamionDeleteDialogComponent {
  camion?: ICamion;

  constructor(protected camionService: CamionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.camionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
