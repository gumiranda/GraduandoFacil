import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';
import { Mensagem } from '../../models/mensagem.model';
import firebase from 'firebase';
import { ApiAiClient } from 'api-ai-javascript';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from '../../providers/environment';
import { Observable } from 'rxjs/Observable';

/**
 * Generated class for the BotchatPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */


@Component({
  selector: 'page-botchat',
  templateUrl: 'botchat.html',
})
export class BotchatPage {
  @ViewChild(Content) content: Content;

//  mensagens: Mensagem[] = [];
  mensagens: Observable<Mensagem[]> ;
  
  readonly token = environment.dialogflow.angularBot;

  readonly client = new ApiAiClient({ accessToken: this.token });
  conversation = new BehaviorSubject<Mensagem[]>([]);
  constructor(public navCtrl: NavController, public navParams: NavParams) {
   /* let currentTimestamp: Object = firebase.database.ServerValue.TIMESTAMP;
    const botMessage = new Mensagem('Olá, eu sou a juana, você quer ser minha amiguinha?','Usuario',currentTimestamp);
    this.mensagens.push(botMessage); 
  */
  }

  converse(msg: string) {
    let currentTimestamp: Object = firebase.database.ServerValue.TIMESTAMP;
    const userMessage = new Mensagem(msg, 'user',currentTimestamp);
    this.update(userMessage);

    return this.client.textRequest(msg)
               .then(res => {
                  const speech = res.result.fulfillment.speech;
                  const botMessage = new Mensagem(speech, 'Eva',currentTimestamp);
                  this.update(botMessage);
                  this.scrollToBottom();
               });
  }
  update(msg: Mensagem) {
    this.conversation.next([msg]);
  }
  scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom();
    });
  }
  ionViewDidLoad() {
    this.mensagens = this.conversation.asObservable()
    .scan((acc, val) => acc.concat(val) );
    //console.log('ionViewDidLoad BotchatPage');
  }

  sendMessage(newMessage:string) :void {
     if(newMessage){
      this.converse(newMessage);
/*
 let currentTimestamp: Object = firebase.database.ServerValue.TIMESTAMP;
   const botMessage = new Mensagem(newMessage,'user',currentTimestamp);
   this.mensagens.push(botMessage);
     */   } 
 }
}
