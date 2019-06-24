import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Banque } from './banque.modele';
import { Portefeuille } from './Portefeuille.modele';
const protobuf = require('protobufjs');

@Injectable({
  providedIn: 'root'
})
export class NodeapiService {
  public token: string;
  public refreshToken: string;
  public address: string;
  public banque: string;
  public email: string;
  public permission: string;
  public portefeuilles: any[];
  public contacts: any[];
  public cartes: any[];
  public nom: string;
  public prenom: string;
  public fullname: string;
  public civilite: string;
  public situationFamiliale: string;
  public profession: string;
  public secteurActivite: string;
  public siret: string;
  public tel: string;
  public adresse: string;
  public ville: string;
  public codePostal: string;
  public documents: any;
  public statut: number;

  private readonly url: string = environment.apiUrl;
  private readonly urlOpenchain: string = environment.openchainUrl;
  private transactionSchema = null;
  private mutationSchema = null;

  formData: Banque;
  list: Banque[];
  transaction: any;

  constructor(private http: HttpClient) {
    apilog('getting current User');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      this.setLogin(currentUser);
    }
    this.logLogin();
    protobuf.load('./assets/schema.proto', (err, root) => {
      if (err) {
        console.log('Error, unable to load proto schema');
        throw err;
      }
      this.transactionSchema = root.lookupType('Openchain.Transaction');
      this.mutationSchema = root.lookupType('Openchain.Mutation');
    });
  }

fromHexString = hexString =>
  new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

toHexString = bytes =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

  createClient(email: string, password: string, prenom: string, nom: string, banque: string): Observable<any> {
    const headers = { headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Content-Type-Options': 'nosniff'
      })};
    apilog('req: [ ' + this.url + 'createClient/ ] post {email: ' + email + ', password: ' + password +
      ', prenom: ' + prenom + ', nom: ' + nom + ', banque: ' + banque + '}');
    return this.http.post<any>(this.url + 'createClient/', {
        email, password, prenom, nom, banque }, headers).pipe(map(
          res => {
            apilog('Got response:');
            console.log(res);
            return res;
          }));
  }

  makeRequest(iApiurl: apiUrl, data: any): Observable<any> {
    const aUrls = iApiurl.split('$');
    const atype = aUrls[0];
    const aUrl = aUrls[1];
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Content-Type-Options': 'nosniff',
      authorization: 'Bearer ' + this.token
      });
    apilog('req ' + atype + ' : [ ' + this.url + aUrl + ' ] data :');
    console.log(data);
    if (atype === 'POST') {
      return this.http.post<any>(this.url + aUrl, data, {headers}).pipe(map(
        res => {apilog('Got response:'); console.log(res); return res; }));
    }
    if (atype === 'PUT') {
      return this.http.put<any>(this.url + aUrl, data, {headers}).pipe(map(
        res => {apilog('Got response:'); console.log(res); return res; }));
    }
    if (atype === 'GET') {
      data.observe = 'response';
      return this.http.get<any>(this.url + aUrl, {headers, params: data}).pipe(map(
        res => {apilog('Got response:'); console.log(res); return res; }));
    }
    if (atype === 'DELETE') {
      data.observe = 'response';
      return this.http.delete<any>(this.url + aUrl, {headers, params: data}).pipe(map(
        res => {apilog('Got response:'); console.log(res); return res; }));
    }
  }

  login(email: string, password: string, saveToken: boolean = false): Observable<any> {
    localStorage.removeItem('currentUser');
    return this.http.post<any>(this.url + 'auth/', { email, password })
      .pipe(
        map(res => {
          apilog('Got response:');
          console.log(res);
          if (res && res.accessToken) {
            if (saveToken) {
              localStorage.setItem('currentUser', JSON.stringify(res));
            }
            this.setLogin(res);
            this.logLogin();
          }
          return res;
        })
      );
  }

  register(email: string, password: string, prenom: string, nom: string, banque: string, roleId: number): Observable<any> {
    return this.http.post<any>(this.url + 'createClient/', { email, password, prenom, nom, banque, roleId })
      .pipe(
        map(res => {
          apilog('Got response:');
          console.log(res);
          return res;
        })
      );
  }

  setLogin(obj: any) {
    this.token = obj.accessToken;
    this.refreshToken = obj.refreshToken;
    this.email = obj.email;
    this.portefeuilles = obj.portefeuilles;
    this.contacts = obj.contacts;
    this.cartes = obj.cartes;
    this.banque = obj.banque;
    this.nom = obj.nom;
    this.prenom = obj.prenom;
    this.fullname = obj.prenom + ' ' + obj.nom;
    this.civilite = obj.civilite;
    this.situationFamiliale = obj.situationFamiliale;
    this.profession = obj.profession;
    this.secteurActivite = obj.secteurActivite;
    this.siret = obj.siret;
    this.tel = obj.tel;
    this.adresse = obj.adresse;
    this.ville = obj.ville;
    this.codePostal = obj.codePostal;
    this.statut = obj.statut;
    this.documents = obj.documents;
    this.permission = obj.permission;
  }

  logLogin() {
    apilog('token: ' + this.token);
    apilog('refreshToken: ' + this.refreshToken);
    apilog('email: ' + this.email);
    apilog('portefeuilles: ');
    console.log(this.portefeuilles);
    apilog('contacts: ');
    console.log(this.contacts);
    apilog('banque: ' + this.banque);
    apilog('nom: ' + this.nom);
    apilog('prenom: ' + this.prenom);
    apilog('civilite: ' + this.civilite);
    apilog('situationFamiliale: ' + this.situationFamiliale);
    apilog('profession: ' + this.profession);
    apilog('secteurActivite: ' + this.secteurActivite);
    apilog('siret: ' + this.siret);
    apilog('tel: ' + this.tel);
    apilog('adresse: ' + this.adresse);
    apilog('ville: ' + this.ville);
    apilog('codePostal: ' + this.codePostal);
    apilog('documents: ' + this.documents);
    apilog('permission: ' + this.permission);
    apilog('statut : ' + this.statut);
  }

  isConnected() {
    return this.token !== null && this.token !== 'undefined';
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('currentUser');
  }

  getAllAccountsFromOpenchain() {
    return this.http.get<any>(this.urlOpenchain + 'query/subaccounts?account=%2F', {}).pipe(map(
      res => {apilog('Got response:'); console.log(res); return res; }));
  }

  getRecord(adress, version = null) {
    if (version) {
      return this.http.get<any>(this.urlOpenchain + 'query/recordversion?key=' + adress + '&version=' + version
      , {}).pipe(map(res => {apilog('Got response:'); console.log(res); return res; }));
    }
    return this.http.get<any>(this.urlOpenchain + 'query/account?account=%2Fp2pkh%2F' + adress + '%2F', {}).pipe(map(
      res => {apilog('Got response:'); console.log(res); return res; }));
  }

  Utf8ToHex(str) {
    try {
      return unescape(encodeURIComponent(str)).split('').map( v => {
        return v.charCodeAt(0).toString(16);
          }).join('');
    } catch (e) {
      console.log('invalid text input: ' + str);
    }
  }

  HexToString(s) {
    if (s) {
      return decodeURIComponent(s.replace(/\s+/g, '').replace(/[0-9a-f]{2}/g, '%$&'));
    } else {
      return '';
    }
  }

getTransactions(iaddress) {
  let address = '/p2pkh/' + iaddress + '/:ACC:/asset/p2pkh/XkjpCHJhrNja3z5qoaX9JvdijMMD32oEyD/';
  address = this.Utf8ToHex(address);
  const options = {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  return this.http.get<any>(this.urlOpenchain + 'query/recordmutations?key=' + address, {}).pipe(map(
      res => {
        const transactions: Transaction[] = [];
        const observables = [];
        const mHashes = [];
        let index = 0;
        res.forEach(element => {
          element = element.mutation_hash;
          observables.push(this.http.get(
            this.urlOpenchain + 'query/transaction?format=raw&mutation_hash=' + element));
          mHashes.push(element);
          });
        if (observables.length === 0) {
          return new Observable(sub => {
            sub.next(transactions);
            sub.complete();
          }).pipe(map(
            result => transactions));
        }
        return forkJoin(observables).pipe(map(
          result => {
            if (!this.transactionSchema || !this.mutationSchema) {
              console.log('transactionSchema or mutationSchema is NULL! ');
              return transactions;
            }
            //console.log('raw transaction: ', result);
            result.forEach( raw => {
              const aTransaction: Transaction = {
                Expediteur: '', Destinataire: '', MutationHash: mHashes[index++], Nature: '', Date: '', Timestamp: 0, Montant: 0, Solde: 0};
              raw = raw.raw;
              try {
                const aMessage = this.transactionSchema.decode( this.fromHexString(raw));
                aMessage.mutation = this.mutationSchema.decode(aMessage.mutation);
                const aExpKey = this.HexToString(this.toHexString(aMessage.mutation.records[0].key));
                aTransaction.Expediteur = aExpKey.substr(7).split('/:ACC:/')[0];
                const aDestKey = this.HexToString(this.toHexString(aMessage.mutation.records[1].key));
                aTransaction.Destinataire = aDestKey.substr(7).split('/:ACC:/')[0];
                //aMessage.transactionMetadata = this.toHexString(aMessage.transactionMetadata);
                aTransaction.Solde =  parseInt(this.toHexString(aMessage.mutation.records[0].value.data), 16);
                aTransaction.Montant =  parseInt(this.toHexString(aMessage.mutation.records[1].value.data), 16);
                aTransaction.Nature = 'Recu';
                aTransaction.Timestamp = aMessage.timestamp;
                const d = new Date(0);
                d.setUTCSeconds(aTransaction.Timestamp);
                aTransaction.Date = d.toLocaleDateString('fr-FR', options);
                const version = this.toHexString(aMessage.mutation.records[1].version);
                this.getRecord(this.toHexString(aMessage.mutation.records[1].key), version).subscribe(data => {
                  if (iaddress === aTransaction.Expediteur) {
                    aTransaction.Nature = 'Virement';
                    aTransaction.Montant = data.value ? parseInt(data.value, 16) - aTransaction.Montant : - aTransaction.Montant;
                  } else {
                    aTransaction.Montant = data.value ? aTransaction.Montant - parseInt(data.value, 16) : aTransaction.Montant;
                  }
                });
              } catch (exe) {
                console.log(exe);
              }
              transactions.push(aTransaction);
            });
            transactions.sort((x, y) => y.Timestamp - x.Timestamp);
            console.log('transactions: ', transactions);
            return transactions;
        }));
    }));
  }

  getListBanque() {
    return [

    //  this.displayedColumns = ['id','nom', 'date', 'nbClient', 'nbPortefeuille', 'totalActif', 'numPortefeuille'];

      {id: '4587',nom: 'xtx', date: '22/04/2019',nbClient:'54545545', nbPortefeuille:'445454545445',
      totalActif:'45454115145', numPortefeuille:'454545454545'},
      {id: '458',nom: 'alex', date: '22/04/2019',nbClient:'54545545', nbPortefeuille:'445454545445',
      totalActif:'45454115145', numPortefeuille:'454545454545'},
      {id: '45787',nom: 'bnb', date: '22/04/2019',nbClient:'54545545', nbPortefeuille:'445454545445',
      totalActif:'45454115145', numPortefeuille:'454545454545'},
      {id: '45987',nom: 'fred', date: '22/04/2019',nbClient:'54545545', nbPortefeuille:'445454545445',
      totalActif:'45454115145', numPortefeuille:'454545454545'},
      {id: '455487',nom: 'je000', date: '22/04/2019',nbClient:'54545545', nbPortefeuille:'445454545445',
      totalActif:'45454115145', numPortefeuille:'454545454545'},
      {id: '455487',nom: 'jebfjbef', date: '22/04/2019',nbClient:'54545545', nbPortefeuille:'445454545445',
      totalActif:'45454115145', numPortefeuille:'454545454545'},
      {id: '455487',nom: 'BankOS', date: '22/04/2019',nbClient:'54545545', nbPortefeuille:'987945',
      totalActif:'45454115145', numPortefeuille:'454545454545'},
      {id: '455487',nom: 'AFRIBANK', date: '22/04/2019',nbClient:'54545545', nbPortefeuille:'787454',
      totalActif:'45454115145', numPortefeuille:'454545454545'},
      {id: '455487',nom: 'TOAST', date: '23/04/2019',nbClient:'54545545', nbPortefeuille:'5445',
      totalActif:'45454115145', numPortefeuille:'454545454545'},
      {id: '455487',nom: 'CREDIT AGRICOLR', date: '22/04/2019',nbClient:'54545545', nbPortefeuille:'45445',
      totalActif:'45454115145', numPortefeuille:'454545454545'},
      {id: '455487',nom: 'zest', date: '22/04/2019',nbClient:'54545545', nbPortefeuille:'445454545445',
      totalActif:'45454115145', numPortefeuille:'454545454545'},
      {id: '455487',nom: 'BANK AVENIR', date: '25/04/2019',nbClient:'54545545', nbPortefeuille:'445454545445',
      totalActif:'45454115145', numPortefeuille:'454545454545'},
      {id: '455487',nom: 'FACILEBANK', date: '22/04/2019',nbClient:'54545545', nbPortefeuille:'445454545445',
      totalActif:'45454115145', numPortefeuille:'454545454545'},
      {id: '455487',nom: 'jebfjbef', date: '29/04/2019',nbClient:'54545545', nbPortefeuille:'445454545445',
      totalActif:'45454115145', numPortefeuille:'454545454545'},
      {id: '455487',nom: 'BANK AVENIR', date: '22/04/2019',nbClient:'54545545', nbPortefeuille:'445454545445',
      totalActif:'45454115145', numPortefeuille:'454545454545'},
      {id: '455487',nom: 'citron', date: '20/04/2019',nbClient:'54545545', nbPortefeuille:'445454545445',
      totalActif:'45454115145', numPortefeuille:'454545454545'}
    ];
  }

  ID: Number;
  Nom: string;
  Portefeuille: string;
  Date: string;
  MaxTransaction :number
  MaxTransactionMoi:number;
  Status :string
  _contactList: Portefeuille[] =  [
     { ID: 1 , Nom: 'Société général', Portefeuille: 'CZKFBZEKFBZE45151', Date: 'eeeeeee', MaxTransaction:1000,MaxTransactionMoi:10000,Status:'Actif',ClePub:'fojfdj'}];

  _monnieElectronqueList =  [
    { ID: 1 , NomMonnieX: 'DHTG', UniteMonnieX: 1, NomMonnieY: 'BITCOIN', UniteMonnieY:5},
    { ID: 2 , NomMonnieX: 'DHTG', UniteMonnieX: 1, NomMonnieY: 'ETHERHOM', UniteMonnieY:15},
    { ID: 3 , NomMonnieX: 'DHTG', UniteMonnieX: 1, NomMonnieY: 'RANK', UniteMonnieY:0.5},
    { ID: 4 , NomMonnieX: 'DHTG', UniteMonnieX: 1, NomMonnieY: 'MONNECIE', UniteMonnieY:0.15},
    { ID: 5 , NomMonnieX: 'DHTG', UniteMonnieX: 1, NomMonnieY: 'XXX', UniteMonnieY:0.15},
    { ID: 6 , NomMonnieX: 'DHTG', UniteMonnieX: 1, NomMonnieY: 'YYY', UniteMonnieY:0.15},
    { ID: 7 , NomMonnieX: 'DHTG', UniteMonnieX: 1, NomMonnieY: 'ZZZ', UniteMonnieY:0.15}

 ];
 _monniePysiqueList =  [
  { ID: 1 , NomMonnieElectroniqueX: 'Digital HaïTian Gourde', UniteMonniePhysiqueX: 1, NomMonniePhysiqueY: 'EUROS', UniteMonniePhysiqueY:5},
  { ID: 2 , NomMonnieElectroniqueX: 'Digital HaïTian Gourde', UniteMonniePhysiqueX: 1, NomMonniePhysiqueY: 'DOLLAR AMERCICAIN', UniteMonniePhysiqueY:15},
  { ID: 3 , NomMonnieElectroniqueX: 'Digital HaïTian Gourde', UniteMonniePhysiqueX: 1, NomMonniePhysiqueY: 'DOLLAR CANADIEN', UniteMonniePhysiqueY:0.5},
  { ID: 4 , NomMonnieElectroniqueX: 'Digital HaïTian Gourde', UniteMonniePhysiqueX: 1, NomMonniePhysiqueY: 'DINAR ALGERIEN', UniteMonniePhysiqueY:0.15},

];

  editContact(contact: Portefeuille) {
    const index = this._contactList.findIndex(c => c.ID === contact.ID);
    console.log(contact);
    this._contactList[index] = contact;
    console.log('nadir');
  }

  getAllContacts() {
    return this._contactList;
  }

  getAllMonnieElectronique(){
    return this._monnieElectronqueList;
  }

  getAllMonniePhysique(){
    return this._monniePysiqueList;
  }

  getBanque() {
    return [

    //  this.displayedColumns = ['id','nom', 'date', 'nbClient', 'nbPortefeuille', 'totalActif', 'numPortefeuille'];

      {id: '4587',nom: 'jebfjbef', email: 'ZEFZEF',telephone:'54545545', portefeuille:'445454545445',}
    ];
  }
  }



export enum apiUrl {
  clients = 'GET$clients',
  contactsByUserEmail = 'GET$contactsByUserEmail',
  allClients = 'GET$allClients',
  allBanks = 'GET$allBanks',
  allMonnies = 'GET$allMonnies',
  allBanksVisible = 'GET$allBanksVisible',
  allParametres = 'GET$allParametres',
  allBanksNotVisible = 'GET$allBanksNotVisible',
  allBanksValid = 'GET$allBanksValid',
  allBanksNotValid = 'GET$allBanksNotValid',
  createMonnie = 'POST$createMonnie/',
  createParametre = 'POST$createParametre/',
  createBank = 'POST$createBank/',
  createClient = 'POST$createClient/',
  createPortefeuille = 'POST$createPortefeuille/',
  createCarte = 'POST$createCarte/',
  createContact = 'POST$createContact/',
  insertCommercantDocs = 'POST$insertCommercantDocs',
  insertParticulierDocs = 'POST$insertParticulierDocs',
  updateCommercantDocs = 'POST$updateCommercantDocs',
  updateParticulierDocs = 'POST$updateParticulierDocs',
  cardsByPortefeuilleIds = 'POST$cardsByPortefeuilleIds/',
  portefeuillesByUserEmail = 'POST$portefeuillesByUserEmail/',
  portefeuillesByBanqueEmail = 'POST$portefeuillesByBanqueEmail/',
  blockClient = 'PUT$blockClient/',
  unBlockClient = 'PUT$unBlockClient/',
  unBlockBanque = 'PUT$unBlockBanque/',
  updateClient = 'PUT$updateClient/',
  updateCarte = 'PUT$updateCarte/',
  updatePortefeuilleLibelle = 'PUT$updatePortefeuilleLibelle/',
  updateContact = 'PUT$updateContact/',
  updateBanque = 'PUT$updateBanque/',
  updateMonnie = 'PUT$updateMonnie/',
  updateParametre = 'PUT$updateParametre/',
  createBankClient = 'POST$createBankClient/',
  deleteParametre = 'DELETE$deleteParametre',
  deleteBank = 'DELETE$deleteBank',
  deleteCarte = 'DELETE$deleteCarte',
  deleteMonnieElectronique = 'DELETE$deleteMonnieElectronique',
  deleteClient = 'DELETE$deleteClient',
  deleteContact = 'DELETE$deleteContact',
  deletePortefeuille = 'DELETE$deletePortefeuille',
  submit = 'POST$submit',
  transferTo = 'POST$transferTo',
  issueDHTG = 'POST$issueDHTG',
}

function apilog(ilog: string) {
  console.log('[NODEAPI] ' + ilog);
}

export interface Transaction {
  Expediteur: string;
  Destinataire: string;
  MutationHash: string;
  Nature: string;
  Date: string;
  Timestamp: number;
  Montant: number;
  Solde: number;
}
