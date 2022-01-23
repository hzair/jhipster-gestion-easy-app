import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISortie } from '../sortie.model';
import { SortieService } from '../service/sortie.service';

@Component({
  templateUrl: './sortie-delete-dialog.component.html',
})
export class SortieDeleteDialogComponent {
  sortie?: ISortie;

  constructor(protected sortieService: SortieService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.sortieService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
