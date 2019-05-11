import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SogebankService } from '../sogebank.service';
import { Title } from '@angular/platform-browser';
import { faPen, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-cartes-sogebank',
  templateUrl: './cartes-sogebank.component.html',
  styleUrls: ['./cartes-sogebank.component.css']
})
export class CartesSogebankComponent implements OnInit {
  faPen = faPen;
  faTimes = faTimes;
  cartes: any[];
  totalCards = 0;
  totalSolde = 14636;
  totalActivite = 0;

  constructor(
    private route: ActivatedRoute,
    private sogebankService: SogebankService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Mes cartes - Sogebank');

    this.cartes = this.sogebankService.getUserCards();

    if (this.cartes.length > 0) {
      this.countTotals();
    }
  }

  countTotals() {
    this.cartes.forEach( carte => {
      this.totalCards++;
      this.totalActivite += Number(carte.activite.substring(0, carte.activite.length - 5).replace(' ', ''));
    });
  }

}


