import { Component, OnInit } from '@angular/core';
import { NodeapiService, apiUrl } from 'src/app/nodeapi.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-demande-habilitation',
  templateUrl: './demande-habilitation.component.html',
  styleUrls: ['./demande-habilitation.component.css']
})
export class DemandeHabilitationComponent implements OnInit {

  nouvelBanqueNom: '';
  nouvelBanqueEmail: '';
  nouvelBanqueTel: '';
  nouvelBanquePassword: '';
  nouvelBanquePrenom: '';
  Nom: '';
  Prenom: '';
  Adresse: '';
  CodePostale: '';
  Ville: '';
  annonceLegale: {name: ''};

  constructor(
    private service: NodeapiService,
    private snackBar: MatSnackBar) { }


  ngOnInit() {
  }

  confirmAddBanque(){

    this.service.makeRequest(apiUrl.createBank, {name:this.nouvelBanqueNom,email:this.nouvelBanqueEmail,telephone:this.nouvelBanqueTel,isVisible:1,statut:'en cours'}).
    subscribe( res =>{
      console.log('on a recu la response:' );
      console.log(res);

      this.service.makeRequest(apiUrl.createClient, {
        email: this.nouvelBanqueEmail, password: this.nouvelBanquePassword,
        prenom: this.nouvelBanquePrenom, nom: this.nouvelBanqueNom, banque: this.nouvelBanqueNom, roleId: 1
      }).
        subscribe(res => {
          console.log('on a recu la response:');
          console.log(res);
        }, error => {
          console.log('got an error 1');
          console.log(error);
        });
      this.snackBar.open('La banque a bien été créé avec succès.', 'Fermer', { duration: 5000, });

    }, error => {
        console.log('got an error 2');
        console.log(error);
    });
    this.snackBar.open('La banque a bien été créé avec succès.', 'Fermer', { duration: 5000,});
  }
}

