import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faDownload, faSyncAlt, faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { Title } from '@angular/platform-browser';
import { SogebankService } from 'src/app/sogebank/sogebank.service';
import { NodeapiService } from 'src/app/nodeapi.service';
import { CommonUtilsService } from 'src/app/common/common-utils.service';
@Component({
  selector: 'app-releve-brh',
  templateUrl: './releve-brh.component.html',
  styleUrls: ['./releve-brh.component.css']
})
export class ReleveBrhComponent implements OnInit {
  displayedColumns: string[];
  dataSource: any[];
  faDownload = faDownload;
  faSyncAlt = faSyncAlt;
  faPlusCircle = faPlusCircle;
  faMinusCircle = faMinusCircle;
  solde='';


  constructor(
    public sogebankService: SogebankService,
    private titleService: Title,
    private  service: NodeapiService,
    private commonUtilsService:CommonUtilsService

  ) { }

  ngOnInit() {
    this.titleService.setTitle('Tableau de bord - Sogebank');
    this.displayedColumns = ['id', 'date', 'type', 'nature', 'montant', 'portefeuille', 'recu'];
    this.dataSource = this.sogebankService.formatRecentTransactionData();
    this.getSoldeBRH();
  }

  getSoldeBRH() {

    if (this.service.portefeuilles && this.service.portefeuilles.length > 0) {
      for (const portefeuille of this.service.portefeuilles) {
        this.service.getTransactions(portefeuille.ClePub).subscribe(
          sub => {
            sub.subscribe(res => {
              portefeuille.Transactions = res;
            }, err => {
              console.log(err);
            }, () => {
              this.service.getRecord(portefeuille.ClePub).subscribe(
                data => {
                  if (data[0] && data[0].balance) {
                    portefeuille.Solde = this.commonUtilsService.numberToCurrencyString(data[0].balance);
                    this.solde = portefeuille.Solde;
                  //  this.soldeTotal = data[0].balance;
                  }
                },
                error => {
                  console.log(error);
                })
            })
          })
      }
    }
  }
}



