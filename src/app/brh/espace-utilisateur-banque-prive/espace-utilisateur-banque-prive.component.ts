import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NodeapiService } from 'src/app/nodeapi.service';
import { MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { BanqueClient } from '../clients-banque-prive/clients-banque-prive.component';
import { InfoPersonelBanquePriveComponent } from '../info-personel-banque-prive/info-personel-banque-prive.component';


@Component({
  selector: 'app-espace-utilisateur-banque-prive',
  templateUrl: './espace-utilisateur-banque-prive.component.html',
  styleUrls: ['./espace-utilisateur-banque-prive.component.css']
})
export class EspaceUtilisateurBanquePriveComponent implements OnInit {

  selectedClient: BanqueClient;
  showClients = true;

  constructor(
    public router: Router,
    public apiService: NodeapiService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    if (!apiService.isConnected() || !(apiService.permission === 'Banque' || apiService.permission === 'Admin' )) {
      this.router.navigate(['/brh/accueil']);
      this.snackBar.open('Utilisateur Non Autorise!', 'Fermer', {
        duration: 5000,
        panelClass: ['alert-snackbar']
      });
      apiService.logout();
    }
   }

  ngOnInit() {
  }

  logout() {
    this.apiService.logout();
    this.router.navigate(['/brh/accueil']);
  }

  handleSelectedClient(event) {
    this.selectedClient = event;
    this.showClients = false;
  }

  update(name: string, value: string) {
    console.log('name', name , 'value', value);
    this.dialog.open(InfoPersonelBanquePriveComponent, {
      width: '250px',
      data: {name, value}
    });
  }

}

export interface DialogData {
  name: string;
  value: string;
}
