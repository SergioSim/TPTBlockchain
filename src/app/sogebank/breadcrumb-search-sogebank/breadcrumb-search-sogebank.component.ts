import { Component, OnInit, Input } from '@angular/core';
import { faChartLine, faWallet, faCreditCard, faExchangeAlt, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { SogebankService } from '../sogebank.service';
import { FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-breadcrumb-search-sogebank',
  templateUrl: './breadcrumb-search-sogebank.component.html',
  styleUrls: ['./breadcrumb-search-sogebank.component.css']
})
export class BreadcrumbSearchSogebankComponent implements OnInit {
  @Input() faIcon: string;
  @Input() breadcrumbTitle: string;
  @Input() breadcrumbDetails: string;

  faChartLine = faChartLine;
  faWallet = faWallet;
  faCreditCard = faCreditCard;
  faExchangeAlt = faExchangeAlt;
  faClipboardList = faClipboardList;

  constructor(
    private route: ActivatedRoute,
    private sogebankService: SogebankService,
    private titleService: Title
  ) { }

  ngOnInit() {
  }

}


