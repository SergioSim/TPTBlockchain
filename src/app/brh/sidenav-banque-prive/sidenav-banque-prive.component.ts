import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { faHome, faUniversity, faAddressBook, faExchangeAlt, faCreditCard, faSignOutAlt, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { NodeapiService } from 'src/app/nodeapi.service';

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
  faSignOutAlt = faSignOutAlt;
  faPaperPlane = faPaperPlane;

  constructor(private apiService: NodeapiService) { }

  ngOnInit() {
  }

  public onSidenavClose = () => {
    this.sidenavClose.emit();
  }

  logout() {
    this.apiService.logout();
  }

}
