import { Component, OnInit } from '@angular/core';
import { NodeapiService, apiUrl } from 'src/app/nodeapi.service';
import { BanqueClient } from '../clients-banque-prive/clients-banque-prive.component';
import { MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { faClipboard, faUserFriends, faChevronDown, faCheck, faCheckCircle, faPlus } from '@fortawesome/free-solid-svg-icons';
import { filter } from 'rxjs/operators';
import { from } from 'rxjs';


@Component({
  selector: 'app-virements-banque-prive',
  templateUrl: './virements-banque-prive.component.html',
  styleUrls: ['./virements-banque-prive.component.css']
})

// Copy Paste and arranged From Luke
export class VirementsBanquePriveComponent implements OnInit {

  public clients: Array<BanqueClient>;
  public selectedPortefeuille;
  public isBeneficiaireSelected;
  public selectedSolde;
  public selectedBeneficiaire: BanqueClient;
  public editBeneficiaire: {};
  public newBeneficiaireLibelle: string;
  public newBeneficiaireClePub: string;
  private contactDialogRef: any;
  faCheck = faCheck;
  faClipboard = faClipboard;
  faUserFriends = faUserFriends;
  faChevronDown = faChevronDown;
  faCheckCircle = faCheckCircle;
  faPlus = faPlus;
  public roles: any[] = ['Public', 'DemandeParticulier', 'DemandeCommercant', 'Particulier', 'Commercant', 'Banque', 'Admin'];

  constructor(
    private apiService: NodeapiService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.selectedPortefeuille = this.apiService.portefeuilles[0];
    this.editBeneficiaire = { ClePub: '', Libelle: '' };
    this.apiService.makeRequest(apiUrl.clients, {banque: this.apiService.banque}).subscribe(
      res => {
        this.apiService.bankClients = res;
        this.clients = res;
      }, err => {
        console.log('err : ');
        console.log(err);
        if (err.status === 403) {
          this.apiService.logout();
          this.router.navigate(['/brh/accueil']);
          this.snackBar.open('Votre session a expire!', 'Fermer', {
            duration: 5000,
            panelClass: ['alert-snackbar']
          });
        }
      }
    );
    this.apiService.getRecord(this.apiService.portefeuilles[0].ClePub).subscribe(data => {
      this.selectedSolde = data[0].balance;
    });
    console.log('clients', this.clients);
  }

  selectBeneficiaire(beneficiaire: BanqueClient) {
    this.selectedBeneficiaire = beneficiaire;
    this.isBeneficiaireSelected = true;
  }

  openContactDialog(templateRef) {
    this.contactDialogRef = this.dialog.open(templateRef, {width: '350px'});
    this.contactDialogRef.afterClosed().subscribe(result => {
   });
  }

  changeBeneficiaireLibelle(event) {
    if (this.editBeneficiaire === 'newContact') {
      this.newBeneficiaireLibelle = event.target.value;
    }
  }

  changeBeneficiaireClePub(event) {
    if (this.editBeneficiaire === 'newContact') {
      this.newBeneficiaireClePub = event.target.value;
    }
  }

  chooseBeneficiaire() {
    this.isBeneficiaireSelected = false;
  }

  applyFilter(afilter: string, itype: string) {
    // Probably a VERY INEFFICIENT way to filter ... \o?
    afilter = afilter.trim().toLowerCase();
    this.clients = this.apiService.bankClients;
    const arr: Array<BanqueClient> = [];
    if (afilter !== null || afilter !== '') {
      from(this.clients).pipe(filter( data => data[itype].trim().toLowerCase().indexOf(afilter) !== -1)).subscribe(res => arr.push(res));
      this.clients = arr;
    }
  }

}
