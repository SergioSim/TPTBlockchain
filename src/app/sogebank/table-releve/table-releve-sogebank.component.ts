import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { faDownload, faPrint } from '@fortawesome/free-solid-svg-icons';
import { SogebankService } from '../sogebank.service';
import { Role } from '../Role';
import { NodeapiService } from 'src/app/nodeapi.service';
declare let jsPDF;

@Component({
  selector: 'app-table-releve-sogebank',
  templateUrl: './table-releve-sogebank.component.html',
  styleUrls: ['./table-releve-sogebank.component.css']
})
export class TableReleveSogebankComponent implements OnInit {
  @Input() dataSource: string;
  displayedColumns: string[];
  faDownload = faDownload;
  faPrint = faPrint;
  roles = Role;

  constructor(
    private apiService: NodeapiService,
    public sogebankService: SogebankService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.setColumnsToDisplay();
  }

  setColumnsToDisplay() {
    this.displayedColumns = this.apiService.permission === Role.COMMERCANT
      ? ['id', 'date', 'type', 'nature', 'montant', 'portefeuille', 'recu']
      : ['id', 'date', 'type', 'nature', 'montant', 'portefeuille'];
  }

  print() {
    let isCommercant = false;

    if (this.apiService.permission === Role.COMMERCANT) {
      isCommercant = true;
      this.apiService.permission = Role.PARTICULIER;
      this.setColumnsToDisplay();
    }

    this.cdr.detectChanges();

    const printPopup = window.open('');
    const tableToPrint = document.getElementById('releve-table');
    let htmlToPrint = '' +
        '<style type="text/css">' +
        'table th, table td {' +
        'border:1px solid #000;' +
        'padding:0.5em;' +
        '}' +
        '</style>';
    htmlToPrint += tableToPrint.outerHTML;
    printPopup.document.write(htmlToPrint);
    printPopup.print();
    printPopup.close();

    if (isCommercant) {
      this.apiService.permission = Role.COMMERCANT;
      this.setColumnsToDisplay();
    }
  }

  download() {
    let isCommercant = false;

    if (this.apiService.permission === Role.COMMERCANT) {
      isCommercant = true;
      this.apiService.permission = Role.PARTICULIER;
      this.setColumnsToDisplay();
    }

    this.cdr.detectChanges();

    const doc = new jsPDF();
    doc.autoTable({html: '#releve-table'});
    doc.save('releve.pdf');

    if (isCommercant) {
      this.apiService.permission = Role.COMMERCANT;
      this.setColumnsToDisplay();
    }
  }

}


