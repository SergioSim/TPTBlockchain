import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NodeapiService {
  public token: string;
  private readonly url: string = environment.apiUrl;

  constructor(private http: HttpClient) {
    apilog("getting current User");
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    apilog("currentUser " + currentUser);
    this.token = currentUser && currentUser.address && currentUser.accessToken;
    apilog("token " + this.token);
  }

  createClient(email: string, password: string, banque: string): Observable<any> {
    const headers = { headers: new HttpHeaders({
      'Content-Type':'application/json',
      'Accept': 'application/json',
      'X-Content-Type-Options': 'nosniff'
      })};
    apilog("req: [ " + this.url + "createClient/ ] post {email: " + email + ", password: " + password + ", banque: " + banque + "}");
    return this.http.post<any>(this.url + "createClient/", {
        email: email, 
        password: password, 
        banque: banque 
      }, headers).pipe(map(res => {apilog("Got response:"); console.log(res); return res;}));
  }

  makeRequest(iApiurl: apiUrl, data: any): Observable<any> {
    let aUrls = iApiurl.split('$');
    let atype = aUrls[0];
    let aUrl = aUrls[1];
    const headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Accept': 'application/json',
      'X-Content-Type-Options': 'nosniff',
      'authorization' : "Bearer " + this.token
      });
    apilog("req " + atype + " : [ " + this.url + aUrl + " ] data :");
    console.log(data);
    if(atype == "POST")
    return this.http.post<any>(this.url + aUrl, data, {headers}).pipe(map(res => {apilog("Got response:"); console.log(res); return res;}));
    if(atype == "PUT")
    return this.http.put<any>(this.url + aUrl, data, {headers}).pipe(map(res => {apilog("Got response:"); console.log(res); return res;}));
    if(atype == "GET"){
      data.observe = 'response'
      const  params = new HttpParams(data);
      return this.http.get<any>(this.url + aUrl, {headers, params}).pipe(map(res => {apilog("Got response:"); console.log(res); return res;}));
    }
    if(atype == "DELETE"){
      data.observe = 'response'
      const params = new HttpParams(data);
      return this.http.delete<any>(this.url + aUrl, {headers, params}).pipe(map(res => {apilog("Got response:"); console.log(res); return res;}));
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.url + 'auth/', { email: email, password: password })
      .pipe(
        map(res => {
          apilog("Got response:");
          console.log(res);
          if (res && res.accessToken) {
            localStorage.setItem('currentUser', JSON.stringify(res));
            this.token = res.address && res.accessToken;
            apilog("token : " + this.token);
          }
          return res;
        })
      );
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('currentUser');
  }

}

export enum apiUrl {
  clients = "GET$clients/",
  allClients = "GET$allClients/",
  createBank = "POST$createBank/",
  createClient = "POST$createClient/",
  blockClient = "PUT$blockClient/",
  unBlockClient = "PUT$unBlockClient/",
  updateClient = "PUT$updateClient/",
  createBankClient = "POST$createBankClient/",
  createContact = "POST$createContact/",
  deleteBank = "DELETE$deleteBank/",
  deleteClient = "DELETE$deleteClient/",
  deleteContact = "DELETE$deleteContact/",
  submit = "POST$submit",
  issueDHTG = "POST$issueDHTG"
}

function apilog(ilog: string) {
  console.log("[NODEAPI] " + ilog);
}
