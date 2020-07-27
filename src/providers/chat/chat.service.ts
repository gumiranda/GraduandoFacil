import { AngularFire, FirebaseObjectObservable, FirebaseListObservable, FirebaseAuthState } from 'angularfire2';
import { Chat } from './../../models/chat.model';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/first';
import { BaseService } from '../base.service';

/*
  Generated class for the ChatProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ChatServiceProvider extends BaseService {
  chats: FirebaseListObservable<Chat[]>;


  constructor(public af: AngularFire, public http: Http) {
    super();
    //console.log('Hello ChatProvider Provider');
    this.setChats();
  }
  create(chat: Chat, userId1: string, userId2: string): firebase.Promise<void> {
    //console.log('olocor');
    //console.log(chat);

    return this.af.database.object(`/chats/${userId1}/${userId2}`).set(chat).catch(this.handlePromiseError);
  }
  getDeepChat(userId1: string, userId2: string): FirebaseObjectObservable<Chat> {
    return <FirebaseObjectObservable<Chat>>this.af.database
      .object(`/chats/${userId1}/${userId2}`)
      .catch(this.handleObservableError);
  }
  private setChats(): void {
    this.af.auth.subscribe(
      (authState: FirebaseAuthState) => {
        if (authState) {
          this.chats = <FirebaseListObservable<Chat[]>>this.af.database.list(`/chats/${authState.auth.uid}`, {
            query: {
              orderByChild: 'timestamp'
            }
          }).map((chats: Chat[]) => {
            return chats.reverse();
          }).catch(this.handleObservableError);
        }
      }
    );
  }
  updatePhoto(chatStatus:string,chat: FirebaseObjectObservable<Chat>, chatPhoto: string, recipientUserPhoto: string,status:string): firebase.Promise<boolean> {
    if (chatPhoto != recipientUserPhoto) {
      return chat.update({
        photo: recipientUserPhoto
      }).then(() => {
        return true;
      }).catch(this.handlePromiseError);
    }
    if(chatStatus != status){
      return chat.update({
        status: status
      }).then(() => {
        return true;
      }).catch(this.handlePromiseError);
    }
    return Promise.resolve(false);
  }


}
