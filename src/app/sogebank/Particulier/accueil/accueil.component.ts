import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']

})
export class AccueilComponent implements OnInit {

  public title:string;
  constructor() { }

  ngOnInit() {
    this.title="nadirkejbfkzebfzek";
  }
  updatetitle(){
    this.title="nom";
  }

}
