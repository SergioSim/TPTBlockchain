import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faDownload, faSyncAlt, faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { SogebankService } from '../sogebank.service';
import { Title } from '@angular/platform-browser';
import { Role } from '../Role';

@Component({
  selector: 'app-documents-sogebank',
  templateUrl: './documents-sogebank.component.html',
  styleUrls: ['./documents-sogebank.component.css']
})
export class DocumentsSogebankComponent implements OnInit {
  displayedColumns: string[];
  dataSource: any[];
  faDownload = faDownload;
  faSyncAlt = faSyncAlt;
  faPlusCircle = faPlusCircle;
  faMinusCircle = faMinusCircle;

  constructor(
    private router: Router,
    private sogebankService: SogebankService,
    private titleService: Title
  ) { }

  ngOnInit() {
    if (this.sogebankService.currentUserRole !== Role.DEMANDEPARTICULIER &&
      this.sogebankService.currentUserRole !== Role.DEMANDECOMMERCANT) {
      this.router.navigate(['/sogebank/dashboard']);
    }
    this.titleService.setTitle('Mes documents - Sogebank');
  }

}


