import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { faHome, faUniversity, faAddressBook, faExchangeAlt, faCreditCard } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidenav-banque-prive',
  templateUrl: './sidenav-banque-prive.component.html',
  styleUrls: ['./sidenav-banque-prive.component.css']
})
export class SidenavBanquePriveComponent implements OnInit {

  @Output() sidenavClose = new EventEmitter();
  faHome = faHome;
  faUniversity = faUniversity;
  faAddressBook = faAddressBook;
  faExchangeAlt = faExchangeAlt;
  faCreditCard = faCreditCard;

  constructor() { }

  ngOnInit() {
  }

  public onSidenavClose = () => {
    this.sidenavClose.emit();
  }

}
