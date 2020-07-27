import { Bloqueado } from './../../models/bloqueado.model';
import { BloqueadoService } from './../../providers/bloqueado/bloqueado.service';
import { HomePage } from './../home/home';
import { SpottedServiceProvider } from './../../providers/spotted/spotted.service';
import { Spotted } from './../../models/spotted.model';
import { Content,ActionSheetController, NavController, NavParams,AlertController, Platform } from 'ionic-angular';
import { Component, ViewChild } from '@angular/core';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { User } from '../../models/user.model';
import firebase from 'firebase';
import { Comentario } from '../../models/comentario.model';
import { UserServiceProvider } from '../../providers/user/user.service';
import {DenunciaService } from '../../providers/denuncia/denuncia.service';

import { PerfilPage } from '../perfil/perfil';
import { Denuncia } from '../../models/denuncia.model';
import { Notificacao } from '../../models/notificacao.model';
import { MessageServiceProvider } from '../../providers/message/message.service';
//import { BranchIo } from '@ionic-native/branch-io';


@Component({
  selector: 'page-spotted-detalhes', 
  templateUrl: 'spotted-detalhes.html',
}) 
export class SpottedDetalhesPage {
  notificacoes: FirebaseListObservable<Notificacao[]>;

  data : any;

headerImage:any = "assets/images/background-small/33.jpg";
usernameAtual:string;
photo:string;
numerodecomentarios:number;

active: boolean = true;
plataforma;
usuariosperto;
  constructor(public actionSheetCtrl:ActionSheetController,
    public messageService:MessageServiceProvider,
    public bloqueadoService:BloqueadoService,
    //private branch: BranchIo,
    public platform:Platform,
    public alertCtrl:AlertController,public denunciaService:DenunciaService,
    public userService: UserServiceProvider,public navCtrl: NavController,public spottedService:SpottedServiceProvider, public navParams: NavParams) {
    this.data = navParams.get('spotted');
    this.usuariosperto = navParams.get('usuariosperto');
    this.plataforma = platform.is('android') ;
/*if(this.plataforma){
  branch.initSession().then(function(data) {
    if (data['+clicked_branch_link']) {
      // read deep link data on click
    //  alert('Deep Link Data1: ' + JSON.stringify(data))
    }
  });

}*/
this.numerodecomentarios =    this.data.numComentarios;
    this.userService.currentUser.first().subscribe(
      (currentUser: User) =>{ 
        this.chaveUsuarioAtual = currentUser.$key;
        this.usernameAtual = currentUser.name;
        this.photo = currentUser.photo; 
         }   )
 this.comentarios = this.spottedService.getComentarios(this.data.$key);

  }
apresentarActionSheetSpotted(objeto:any){
  let currentTimestamp: Object = firebase.database.ServerValue.TIMESTAMP;

  const actionSheet =  this.actionSheetCtrl.create({
    title:"Opções",
    enableBackdropDismiss:true,
    buttons:[
      
      {
        text:"Denunciar",
        handler:()=>{
          let alert2 = this.alertCtrl.create({
            title: 'Informe o motivo da denúncia',
            inputs: [
              {
                name: 'motivo',
                placeholder: 'Motivo'
              }
            ],
                buttons: [
                  {
                    text: 'Cancelar',
                    role: 'cancel',
                    handler: () => {
                      //console.log('Cancel clicked');
                    }
                  },
              {
                text: 'Enviar',
                handler: data => {
                  this.denunciaService.create(new Denuncia(data.motivo,this.chaveUsuarioAtual,objeto.userId,objeto.$key,'',objeto.userNome,currentTimestamp,objeto.conteudo));
                  }
              }
              
            ]
          });
          alert2.present();
          console.log('clicou em editar');
        }
      },
      {
        text:"Bloquear "+objeto.userNome,
        handler:()=>{
          if(this.chaveUsuarioAtual === objeto.userId){
            let alert2 = this.alertCtrl.create({
              title: 'Você não pode bloquear a si mesmo',
              
                  buttons: [
                    {
                      text: 'OK',
                      role: 'cancel',
                      handler: () => {
                        //console.log('Cancel clicked');
                      }
                    }
                
              ]
            });
            alert2.present();
          }else{
          let alert2 = this.alertCtrl.create({
            title: 'Deseja bloquear '+objeto.userNome+' ?',
            
                buttons: [
                  {
                    text: 'Cancelar',
                    role: 'cancel',
                    handler: () => {
                      //console.log('Cancel clicked');
                    }
                  },
              {
                text: 'Sim',
                handler:()=> {
                  this.bloqueadoService.create(new Bloqueado(this.chaveUsuarioAtual,objeto.userId,objeto.userNome,currentTimestamp,1));
                  this.bloqueadoService.create(new Bloqueado(objeto.userId,this.chaveUsuarioAtual,this.usernameAtual,currentTimestamp,2));
                  }
              }
              
            ]
          });
          alert2.present();
        }
          console.log('clicou em editar');
        }
      }
    ]
  });
  actionSheet.present();
}

apresentarActionSheetComentario(objeto:any){
  let currentTimestamp: Object = firebase.database.ServerValue.TIMESTAMP;

  const actionSheet =  this.actionSheetCtrl.create({
    title:"Opções",
    enableBackdropDismiss:true,
    buttons:[
      
      {
        text:"Denunciar",
        handler:()=>{
          let alert2 = this.alertCtrl.create({
            title: 'Informe o motivo da denúncia',
            inputs: [
              {
                name: 'motivo',
                placeholder: 'Motivo'
              }
            ],
                buttons: [
                  {
                    text: 'Cancelar',
                    role: 'cancel',
                    handler: () => {
                      //console.log('Cancel clicked');
                    }
                  },
              {
                text: 'Enviar',
                handler: data => {
                   let denuncia:Denuncia = new Denuncia(data.motivo,this.chaveUsuarioAtual,objeto.userId,'',objeto.$key,objeto.apelido,currentTimestamp,objeto.text);
                   console.log(denuncia,objeto);
                  this.denunciaService.create(denuncia);
                  }
              }
              
            ]
          });
          alert2.present();
          console.log('clicou em editar');
        }
      },
      {
        text:"Bloquear "+objeto.apelido,
        handler:()=>{
          if(this.chaveUsuarioAtual === objeto.userId){
            let alert2 = this.alertCtrl.create({
              title: 'Você não pode bloquear a si mesmo',
              
                  buttons: [
                    {
                      text: 'OK',
                      role: 'cancel',
                      handler: () => {
                        //console.log('Cancel clicked');
                      }
                    }
                
              ]
            });
            alert2.present();
          }else{
          let alert2 = this.alertCtrl.create({
            title: 'Deseja bloquear '+objeto.apelido+' ?',
            
                buttons: [
                  {
                    text: 'Cancelar',
                    role: 'cancel',
                    handler: () => {
                      //console.log('Cancel clicked');
                    }
                  },
              {
                text: 'Sim',
                handler:()=> {
                  
                  this.bloqueadoService.create(new Bloqueado(this.chaveUsuarioAtual,objeto.userId,objeto.userNome,currentTimestamp,1));
                  this.bloqueadoService.create(new Bloqueado(objeto.userId,this.chaveUsuarioAtual,this.usernameAtual,currentTimestamp,2));
                  }
              }
              
            ]
          });
          alert2.present();
        }
          console.log('clicou em editar');
        }
      }
    ]
  });
  actionSheet.present();
}

  ionViewDidLoad() {
    this.spotted1 = this.spottedService.retornaObjetoSpotted(this.data);  
    this.spotted1.forEach(k=>{
      
      this.notificacoes = this.messageService.getAllNotificacoes(k.userId);
      /*if(this.plataforma){
        let s = 'post/'+k.$key;
        let s2 =  'https://graduandofacil.com.br/'+s;
        var properties = {
          canonicalIdentifier: s,
          canonicalUrl:s2,
          title: 'Post do'+k.userNome,
          contentDescription: k.conteudo + Date.now(),
          contentImageUrl: k.photo,
          price: 0,
          currency: 'BRL',
          contentIndexingMode: 'private',
          contentMetadata: {
            custom: 'data',
            testing: 123,
            this_is: true
          }
        }
      // create a branchUniversalObj variable to reference with other Branch methods
    var branchUniversalObj = null;
    this.branch.createBranchUniversalObject(properties).then(function (res) {
      branchUniversalObj = res;
      //alert('Response2: ' + JSON.stringify(res));
      var analytics = {
        channel: 'facebook',
        feature: 'onboarding',
        campaign: 'content 123 launch',
        stage: 'new user',
        tags: ['one', 'two', 'three']
      }
      var properties2 = {
        $desktop_url: s2,
        $android_url: s2,
        $ios_url: s2,
        $ipad_url: s2,
        $match_duration: 2000,
        custom_string: 'data',
        custom_integer: Date.now(),
        custom_boolean: true
      }
      branchUniversalObj.generateShortUrl(analytics, properties2).then(function (res) {
       // alert('Response3: ' + JSON.stringify(res.url))
      }).catch(function (err) {
       // alert('Error3: ' + JSON.stringify(err))
      });
    }).catch(function (err) {
     // alert('Error2: ' + JSON.stringify(err))
    });
        }*/  
    });
   
  }
  
  comentar(newComentario: string): void {
    this.numerodecomentarios++;
    //console.log(newComentario);
    if (newComentario) {
      //console.log(newComentario);
      let currentTimestamp: Object = firebase.database.ServerValue.TIMESTAMP;
      //console.log(this.comentarios);
//console.log(this.photo);
//console.log(new Comentario(this.chaveUsuarioAtual, newComentario, currentTimestamp,this.usernameAtual,this.photo));

      this.spottedService.comentar(new Comentario(this.chaveUsuarioAtual, newComentario,this.usernameAtual,this.photo,currentTimestamp),this.data.$key).
      then(
        () =>{
          this.messageService.createNotificacao(new Notificacao(this.data.userId,this.usernameAtual,this.chaveUsuarioAtual,'',newComentario,2,false, currentTimestamp), this.notificacoes);
          this.spotted1.update({
            lastComentario : newComentario,
            lastComentarioFoto: this.photo,
            nomeLastComentario:this.usernameAtual,
            numComentarios : this.numerodecomentarios,
            timestampUltimoComentario: currentTimestamp
          });
         
        });
      //console.log(this.comentarios);

    }
  }
  comentarios: FirebaseListObservable<Comentario[]>;
  chaveUsuarioAtual: string;
  private spotted1: FirebaseObjectObservable<Spotted>;

  openPerfil(userId : string){
    let distancia:number;
    this.usuariosperto.forEach(a=>{
      if(userId === a.key){
         distancia = a.distancia
      }
    })
    this.userService.get(userId).first().subscribe(
      (user: User) => {
        this.navCtrl.push(PerfilPage, {
          usuario: user,
          usuariosperto: distancia
        });
      }
    );

  }


  

}








