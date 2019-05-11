import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SogebankService } from '../sogebank.service';
import { Title } from '@angular/platform-browser';
import { faPen } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-portefeuilles-sogebank',
  templateUrl: './portefeuilles-sogebank.component.html',
  styleUrls: ['./portefeuilles-sogebank.component.css']
})
export class PortefeuillesSogebankComponent implements OnInit {
  faPen = faPen;
  portefeuilles: any[];
  totalWallets = 0;
  totalSolde = 0;
  totalActivite = 0;

  constructor(
    private route: ActivatedRoute,
    private sogebankService: SogebankService,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Mes portefeuilles - Sogebank');

    this.portefeuilles = this.sogebankService.getUserWallets();

    if (this.portefeuilles.length > 0) {
      this.countTotals();
    }
  }

  countTotals() {
    this.portefeuilles.forEach( portefeuille => {
      this.totalWallets++;
      this.totalSolde += Number(portefeuille.solde.substring(0, portefeuille.solde.length - 5).replace(' ', ''));
      this.totalActivite += Number(portefeuille.activite.substring(0, portefeuille.activite.length - 5).replace(' ', ''));
    });
  }

}


