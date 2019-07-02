import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { SogebankService } from '../sogebank.service';
import { Title } from '@angular/platform-browser';
import { Role } from '../Role';
import { Statut } from '../Statut';
import { NodeapiService, apiUrl } from 'src/app/nodeapi.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-documents-sogebank',
  templateUrl: './documents-sogebank.component.html',
  styleUrls: ['./documents-sogebank.component.css']
})
export class DocumentsSogebankComponent implements OnInit {
  roles = Role;
  statut = Statut;
  faTimesCircle = faTimesCircle;
  // Particulier fields
  pieceIdentite: File;
  pieceIdentiteBuffer: string | ArrayBuffer;
  justificatifDomicile: File;
  justificatifDomicileBuffer: string | ArrayBuffer;
  selectedCivilite: string;
  selectedSituation: string;
  profession: string;
  // Commerçant fields
  annonceLegale: File;
  annonceLegaleBuffer: string | ArrayBuffer;
  selectedStatutJuridique: string;
  siret: number;
  secteurActivite: string;
  // Common fields
  tel: string;
  addresse: string;
  ville: string;
  codePostal: string;

  constructor(
    private router: Router,
    public apiService: NodeapiService,
    private sogebankService: SogebankService,
    private titleService: Title,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    if (this.apiService.permission !== Role.DEMANDEPARTICULIER &&
      this.apiService.permission !== Role.DEMANDECOMMERCANT) {
      this.router.navigate(['/sogebank/dashboard']);
    }
    this.titleService.setTitle('Mes documents - Sogebank');
  }

  initData() {
    this.tel = this.apiService.tel;
    this.addresse = this.apiService.adresse;
    this.ville = this.apiService.ville;
    this.codePostal = this.apiService.codePostal;
    if (this.apiService.permission === Role.DEMANDEPARTICULIER) {
      this.selectedCivilite = this.apiService.civilite;
      this.selectedSituation = this.apiService.situationFamiliale;
      this.profession = this.apiService.profession;
    } else if (this.apiService.permission === Role.DEMANDECOMMERCANT) {
      this.siret = Number(this.apiService.siret);
      this.secteurActivite = this.apiService.secteurActivite;
    }
  }

  openPieceIdentiteInput() {
    document.getElementById('pieceIdentiteInput').click();
  }

  pieceIdentiteChange(file) {
    if (file && file.length > 0) {
      this.pieceIdentite = file[0];
      const reader = new FileReader();
      reader.readAsDataURL(file[0]);
      reader.onload = () => {
        this.pieceIdentiteBuffer = reader.result;
      };
    }
  }

  openJustificatifDomicileInput() {
    document.getElementById('justificatifDomicileInput').click();
  }

  justificatifDomicileChange(file) {
    if (file && file.length > 0) {
      this.justificatifDomicile = file[0];
      const reader = new FileReader();
      reader.readAsDataURL(file[0]);
      reader.onload = () => {
        this.justificatifDomicileBuffer = reader.result;
      };
    }
  }

  openAnnonceLegaleInput() {
    document.getElementById('annonceLegaleInput').click();
  }

  annonceLegaleChange(file) {
    if (file && file.length > 0) {
      this.annonceLegale = file[0];
      const reader = new FileReader();
      reader.readAsDataURL(file[0]);
      reader.onload = () => {
        this.annonceLegaleBuffer = reader.result;
      };
    }
  }

  submitParticulierDocs() {
    if (this.pieceIdentiteBuffer && this.justificatifDomicileBuffer && this.selectedCivilite && this.selectedSituation
      && this.profession && this.tel && this.addresse && this.ville && this.codePostal) {
        const particulierDocs = {
          pieceIdentite: this.pieceIdentiteBuffer,
          justificatifDomicile: this.justificatifDomicileBuffer,
          civilite: this.selectedCivilite,
          situation: this.selectedSituation,
          profession: this.profession,
          tel: this.tel,
          addresse: this.addresse,
          ville: this.ville,
          codePostal: this.codePostal
        };
        // If user has not sent in any documents (Status: 'En attente')
        if (this.apiService.statut === this.statut.EN_ATTENTE) {
          this.apiService.makeRequest(apiUrl.insertParticulierDocs, particulierDocs).toPromise()
            .then(res => {
              this.apiService.statut = this.statut.EN_COURS;
            }, error => {
              this.snackBar.open('L\'envoi n\'a pas pu s\'effectuer, veuillez réessayer.', 'Fermer', {
                duration: 5000,
              });
            });
        } else if (this.apiService.statut === this.statut.INVALIDE) {
          // If user had invalid documents and must update them (Status: 'Pas valide')
          this.apiService.makeRequest(apiUrl.updateParticulierDocs, particulierDocs).toPromise()
          .then(res => {
            this.apiService.statut = this.statut.EN_COURS;
          }, error => {
            this.snackBar.open('L\'envoi n\'a pas pu s\'effectuer, veuillez réessayer.', 'Fermer', {
              duration: 5000,
            });
          });
        }
    } else {
      this.snackBar.open('Veuillez renseigner toutes les informations nécessaires avant de valider.', 'Fermer', {
        duration: 5000,
      });
    }
  }

  submitCommercantDocs() {
    if (this.tel && this.addresse && this.ville && this.codePostal && this.annonceLegaleBuffer
      && this.selectedStatutJuridique && this.siret && this.secteurActivite) {
        const commercantDocs = {
          tel: this.tel,
          addresse: this.addresse,
          ville: this.ville,
          codePostal: this.codePostal,
          annonceLegale: this.annonceLegaleBuffer,
          statutJuridique: this.selectedStatutJuridique,
          siret: this.siret,
          secteurActivite: this.secteurActivite
        };
        // If user has not sent in any documents (Status: 'En attente')
        if (this.apiService.statut === this.statut.EN_ATTENTE) {
          this.apiService.makeRequest(apiUrl.insertCommercantDocs, commercantDocs).toPromise()
            .then(res => {
              this.apiService.statut = this.statut.EN_COURS;
            }, error => {
              this.snackBar.open('L\'envoi n\'a pas pu s\'effectuer, veuillez réessayer.', 'Fermer', {
                duration: 5000,
              });
            });
        } else if (this.apiService.statut === this.statut.INVALIDE) {
          // If user had invalid documents and must update them (Status: 'Pas valide')
          this.apiService.makeRequest(apiUrl.updateCommercantDocs, commercantDocs).toPromise()
          .then(res => {
            this.apiService.statut = this.statut.EN_COURS;
          }, error => {
            this.snackBar.open('L\'envoi n\'a pas pu s\'effectuer, veuillez réessayer.', 'Fermer', {
              duration: 5000,
            });
          });
        }
    } else {
      this.snackBar.open('Veuillez renseigner toutes les informations nécessaires avant de valider.', 'Fermer', {
        duration: 5000,
      });
    }
  }

}


