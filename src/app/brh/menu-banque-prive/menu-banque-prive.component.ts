import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-banque-prive',
  templateUrl: './menu-banque-prive.component.html',
  styleUrls: ['./menu-banque-prive.component.css']
})
export class MenuBanquePriveComponent implements OnInit {

  faBars = faBars;
  public selectedIndexs = [-1, -1, -1, -1];
  public baseUrl = '/brh/banque/prive/';
  public endUrl = ['portefeuille', 'transactions', 'clients', 'cartes', 'dashboard'];

  @Output() public sidenavToggle = new EventEmitter();

  constructor(public router: Router) { }

  ngOnInit() {
    const urlArray = this.router.url.split('/');
    this.selectedIndexs[this.endUrl.indexOf(urlArray[urlArray.length - 1])] = 1;
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }

  public onClick(i: number) {
    console.log('navigating to ', i , this.endUrl[i]);
    this.router.navigateByUrl(this.baseUrl + this.endUrl[i]);
  }

}
