import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICamion } from '../camion.model';

@Component({
  selector: 'jhi-camion-detail',
  templateUrl: './camion-detail.component.html',
})
export class CamionDetailComponent implements OnInit {
  camion: ICamion | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ camion }) => {
      this.camion = camion;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
