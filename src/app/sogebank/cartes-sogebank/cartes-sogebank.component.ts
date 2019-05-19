import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SogebankService } from '../sogebank.service';
import { Title } from '@angular/platform-browser';
import { faPen, faTimes, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { CommonUtilsService } from 'src/app/common/common-utils.service';

@Component({
  selector: 'app-cartes-sogebank',
  templateUrl: './cartes-sogebank.component.html',
  styleUrls: ['./cartes-sogebank.component.css']
})
export class CartesSogebankComponent implements OnInit {
  faPen = faPen;
  faTimes = faTimes;
  faPlusCircle = faPlusCircle;
  cartes: any[];
  totalCards = 0;
  totalSolde = '14 636 DHTG';
  totalActivite = '0';

  constructor(
    private route: ActivatedRoute,
    private sogebankService: SogebankService,
    private commonUtilsService: CommonUtilsService,
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
    let activite = 0;
    this.cartes.forEach( carte => {
      this.totalCards++;
      activite += this.commonUtilsService.currencyStringtoNumber(carte.activite);
    });
    this.totalActivite = this.commonUtilsService.numberToCurrencyString(activite);
  }

}


