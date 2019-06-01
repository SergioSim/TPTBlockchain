import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faDownload, faSyncAlt, faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { SogebankService } from '../sogebank.service';
import { Title } from '@angular/platform-browser';
import { Role } from '../Role';
import { NodeapiService } from 'src/app/nodeapi.service';

@Component({
  selector: 'app-documents-sogebank',
  templateUrl: './documents-sogebank.component.html',
  styleUrls: ['./documents-sogebank.component.css']
})
export class DocumentsSogebankComponent implements OnInit {
  roles = Role;
  // Particulier fields
  pieceIdentite: File;
  justificatifDomicile: File;
  selectedCivilite: string;
  selectedSituation: string;
  profession: string;
  // Commerçant fields
  annonceLegale: File;
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
    private titleService: Title
  ) { }

  ngOnInit() {
    if (this.apiService.permission !== Role.DEMANDEPARTICULIER &&
      this.apiService.permission !== Role.DEMANDECOMMERCANT) {
      this.router.navigate(['/sogebank/dashboard']);
    }
    this.titleService.setTitle('Mes documents - Sogebank');
  }

  openPieceIdentiteInput() {
    document.getElementById('pieceIdentiteInput').click();
  }

  pieceIdentiteChange(file) {
    this.pieceIdentite = file[0];
  }

  openJustificatifDomicileInput() {
    document.getElementById('justificatifDomicileInput').click();
  }

  justificatifDomicileChange(file) {
    this.justificatifDomicile = file[0];
  }

  openAnnonceLegaleInput() {
    document.getElementById('annonceLegaleInput').click();
  }

  annonceLegaleChange(file) {
    this.annonceLegale = file[0];
  }

  submitParticulierDocs() {
    return;
  }

  submitCommercantDocs() {
    return;
  }

}


