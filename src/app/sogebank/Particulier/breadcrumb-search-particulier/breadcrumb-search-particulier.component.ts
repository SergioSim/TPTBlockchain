import { Component, OnInit, Input } from '@angular/core';
import { IconDefinition, faSearch } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-breadcrumb-search-particulier',
  templateUrl: './breadcrumb-search-particulier.component.html',
  styleUrls: ['./breadcrumb-search-particulier.component.css']

})
export class  BreadcrumbSearchParticulierComponent implements OnInit {
  @Input() faIcon: IconDefinition;
  @Input() breadcrumbTitle: string;
  @Input() breadcrumbDetails: string;
  faSearch = faSearch;

  constructor(
    private route: ActivatedRoute,
    private titleService: Title
  ) { }

  ngOnInit() {
  }

}