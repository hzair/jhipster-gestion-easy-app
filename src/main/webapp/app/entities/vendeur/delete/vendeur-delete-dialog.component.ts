import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IVendeur } from '../vendeur.model';
import { VendeurService } from '../service/vendeur.service';

@Component({
  templateUrl: './vendeur-delete-dialog.component.html',
})
export class VendeurDeleteDialogComponent {
  vendeur?: IVendeur;

  constructor(protected vendeurService: VendeurService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.vendeurService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
