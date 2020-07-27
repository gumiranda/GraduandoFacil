import { Notificacao } from './../../models/notificacao.model';
import { Platform } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BaseService } from '../base.service';
import { Message } from '../../models/message.model';

import { BehaviorSubject, Subject } from 'rxjs';
import * as CryptoJS from 'crypto-js/crypto-js';

/*
  Generated class for the MessageProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class MessageServiceProvider extends BaseService {
private nbObjects: BehaviorSubject<any> = new BehaviorSubject<any>(33);
//public nbObjects: Subject<any>;
static getDEcryptedCode(pwd: string, key: string): string {
  // Decrypt 
  var bytes = CryptoJS.AES.decrypt(pwd.toString(), key);
  var plaintext = bytes.toString(CryptoJS.enc.Utf8);
  return plaintext;
}

static getEncryptCode(pwd: string, key: string): string {
  // Encrypt 
  var ciphertext = CryptoJS.AES.encrypt(pwd, key);
  return ciphertext.toString();
}
constructor(public http: Http,public af : AngularFire){//public platform:Platform) {
    super();
/*    this.platform.ready().then(() => {
		  this.nbObjects.next(40);
		});
  */
      this.nbObjects.next(this.nbObjects.getValue() + 2);
  }
  loadMoreObjects() : void {
		this.nbObjects.next(this.nbObjects.getValue() + 15); 
	}

getAllNotificacoes(userId1: string): FirebaseListObservable<Notificacao[]>{
  return <FirebaseListObservable<Notificacao[]>> this.af.database.list(`/notifications/${userId1}`,{
    query :{
      orderByChild: 'timestamp',
    }
  }).catch(this.handleObservableError); 
  }
  getMessages(userId1: string,userId2:string): FirebaseListObservable<Message[]>{
    return <FirebaseListObservable<Message[]>> this.af.database.list(`/messages/${userId1}-${userId2}`,{
      query :{
        orderByChild: 'timestamp',
        limitToLast : this.nbObjects  //limita o numero de mensagens que ira aparecer na tela
      }
    }).catch(this.handleObservableError); 
    }
getNotificacoes(userId1: string): FirebaseListObservable<Notificacao[]>{
  return <FirebaseListObservable<Notificacao[]>> this.af.database.list(`/notifications/${userId1}`,{
    query :{
      orderByChild: 'timestamp',
      limitToLast : this.nbObjects  //limita o numero de mensagens que ira aparecer na tela
    }
  }).catch(this.handleObservableError); 
  }
create(message : Message, listMessages : FirebaseListObservable<Message[]>): firebase.Promise<void>{
 // message.text = MessageServiceProvider.getEncryptCode(message.text,'docrjicrjfijrifjrijefirejfifjdc324j2343h24h23u4hu32h4uh3u4h');
  return listMessages.push(message).catch(this.handlePromiseError);
}
editNotificacao(notificacao:Notificacao) : firebase.Promise<void>{
   notificacao.lida = true;
  return this.af.database.object(`/notifications/${notificacao.userId}/${notificacao.$key}`).update(notificacao).catch(this.handlePromiseError);
}
deleteNotificacao(notificacao:Notificacao) : firebase.Promise<void>{
 return this.af.database.object(`/notifications/${notificacao.userId}`).remove().catch(this.handlePromiseError);
}
createNotificacao(message : Notificacao, listMessages : FirebaseListObservable<Notificacao[]>): firebase.Promise<void>{
  return listMessages.push(message).catch(this.handlePromiseError);
}

}
