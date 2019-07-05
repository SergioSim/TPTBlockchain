import { Component, OnInit } from '@angular/core';
import { NodeapiService, apiUrl } from 'src/app/nodeapi.service';
import { MatSnackBar } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { InputErrorStateMatcher } from './InputErrorStatMatcher';
import { Router } from '@angular/router';
import { Statut } from 'src/app/sogebank/Statut';


@Component({
  selector: 'app-demande-habilitation',
  templateUrl: './demande-habilitation.component.html',
  styleUrls: ['./demande-habilitation.component.css']
})
export class DemandeHabilitationComponent implements OnInit {
  statut = Statut;
  pieceIdentite: File;
  pieceIdentiteBuffer: string | ArrayBuffer;
  annonceLegale: File;
  annonceLegaleBuffer: string | ArrayBuffer;
  justificatifDomicile: File;
  justificatifDomicileBuffer: string | ArrayBuffer;
  nouvelBanqueEmail = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  BanqueNom: FormControl = new FormControl('', [Validators.required, Validators.minLength(3)]);
  nouvelBanquePrenom: FormControl = new FormControl('', [Validators.required, Validators.minLength(3)]);
  nouvelBanqueNom: FormControl = new FormControl('', [Validators.required, Validators.minLength(3)]);
  nouvelBanquePassword: FormControl = new FormControl('', [Validators.required, Validators.minLength(6)]);
  nouvelBanquePasswordConfirm: FormControl = new FormControl('', [Validators.required, Validators.minLength(6)]);
  nouvelBanqueTel: FormControl = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]);


  matcher = new InputErrorStateMatcher();
  constructor(
    private service: NodeapiService,
    private snackBar: MatSnackBar,
    public router: Router) { }

  ngOnInit() {
  }

  pieceIdentiteChange(file) {
    console.log("idzntite")

    if (file && file.length > 0) {
      this.pieceIdentite = file[0];
      const reader = new FileReader();
      reader.readAsDataURL(file[0]);
      reader.onload = () => {
        this.pieceIdentiteBuffer = reader.result;
      };
    }
  }
  
  justificatifDomicileChange(file) {
    console.log("domicile")
    if (file && file.length > 0) {
      this.justificatifDomicile = file[0];
      const reader = new FileReader();
      reader.readAsDataURL(file[0]);
      reader.onload = () => {
        this.justificatifDomicileBuffer = reader.result;
      };
    }
  }
  
  annonceLegaleChange(file) {
    console.log("annoce")

    if (file && file.length > 0) {
      this.annonceLegale = file[0];
      const reader = new FileReader();
      reader.readAsDataURL(file[0]);
      reader.onload = () => {
        this.annonceLegaleBuffer = reader.result;
      };
    }
  }
  confirmAddBanque() {
    if (this.BanqueNom.invalid || this.nouvelBanquePrenom.invalid || this.nouvelBanqueNom.invalid || this.nouvelBanqueTel.invalid
      || this.nouvelBanquePassword.invalid || this.nouvelBanquePasswordConfirm.invalid ) {
      this.snackBar.open('Tous les champs sont requis!', 'Fermer', {
        duration: 5000,
        panelClass: ['alert-snackbar']
      });
      return;
    }
    console.log(this.nouvelBanquePasswordConfirm);
    console.log('-----------------------');

    console.log(this.nouvelBanquePassword);

    if (this.nouvelBanquePasswordConfirm.value !== this.nouvelBanquePassword.value) {
      this.snackBar.open('La confirmation du mot de passe doit être identique au mot de passe', 'Fermer', {
        duration: 5000,
        panelClass: ['alert-snackbar']
      });
      return;
    }

    this.service.makeRequest(apiUrl.createBank,
      {
        name: this.BanqueNom.value, email: this.nouvelBanqueEmail.value,
        telephone: this.nouvelBanqueTel.value, isVisible: 1, statut: 'en cours'
      }).
      subscribe(res => {
        console.log('on a recu la response:');
        console.log(res);

        this.service.makeRequest(apiUrl.createClient, {
          email: this.nouvelBanqueEmail.value, password: this.nouvelBanquePassword.value,
          prenom: this.nouvelBanquePrenom.value, nom: this.nouvelBanqueNom.value, tel: this.nouvelBanqueTel.value, banque: this.BanqueNom.value, roleId: 1
        }).
          subscribe(res2 => {
            console.log("ouiouoiououoiouooui1");

            if (res2 && res2.success === true) {

              if (this.pieceIdentiteBuffer && this.justificatifDomicileBuffer && this.annonceLegaleBuffer) 

                this.service.makeRequest(apiUrl.insertBanqueDocs, 
                  {
                  email: this.nouvelBanqueEmail.value,
                  pieceIdentite: this.pieceIdentiteBuffer,
                  justificatifDomicile: this.justificatifDomicileBuffer,
                  annonceLegale:this.annonceLegaleBuffer})
                  .toPromise()
                  .then(res => {
                    this.snackBar.open('Votre demande d\'habilitation a été enregistrée.',
                    'Fermer', { duration: 5000, panelClass: ['succes-snackbar'] });
                  this.router.navigateByUrl('/brh/banque/login');
                  }, error => {
                    this.snackBar.open('L\'envoi n\'a pas pu s\'effectuer, veuillez réessayer.', 'Fermer', {
                      duration: 5000,
                    });
                  });
              

            }
          }, error => {
            console.log('got an error 1');
            console.log(error);
          });

      }, error => {
        console.log('got an error 2');
        this.snackBar.open('Erreur : vous devez remplir tous les champs  !!',
          'Fermer', { duration: 5000, panelClass: ['alert-snackbar'] });

        console.log(error);
      });
  }

  goBack() {
    this.router.navigateByUrl('/brh/accueil');
  }
  openPieceIdentiteInput() {
    document.getElementById('pieceIdentiteInput').click();
  }



  openAnnonceLegaleInput() {
    document.getElementById('annonceLegaleInput').click();
  }

  openJustificatifDomicileInput() {
    document.getElementById('justificatifDomicileInput').click();
  }


  submitBanqueDocs() {
    if (this.pieceIdentiteBuffer && this.justificatifDomicileBuffer) {
      const particulierDocs = {
        email: this.nouvelBanqueEmail.value,
        pieceIdentite: this.pieceIdentiteBuffer,
        justificatifDomicile: this.justificatifDomicileBuffer
      };
      // If user has not sent in any documents (Status: 'En attente')
      this.service.makeRequest(apiUrl.insertBanqueDocs, particulierDocs).toPromise()
        .then(res => {
          console.log("ouiouoiououoiouooui");
        }, error => {
          this.snackBar.open('L\'envoi n\'a pas pu s\'effectuer, veuillez réessayer.', 'Fermer', {
            duration: 5000,
          });
        });
    }
  }
}
