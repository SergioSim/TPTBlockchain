import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-menu-banque-prive',
  templateUrl: './menu-banque-prive.component.html',
  styleUrls: ['./menu-banque-prive.component.css']
})
export class MenuBanquePriveComponent implements OnInit {

  @Output() public sidenavToggle = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }

}
