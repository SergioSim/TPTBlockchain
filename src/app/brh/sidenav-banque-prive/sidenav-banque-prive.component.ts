import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { faHome, faUniversity, faAddressBook } from '@fortawesome/free-solid-svg-icons';

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

  constructor() { }

  ngOnInit() {
  }

  public onSidenavClose = () => {
    this.sidenavClose.emit();
  }

}
