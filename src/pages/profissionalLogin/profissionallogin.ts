import { SpottedServiceProvider } from './../../providers/spotted/spotted.service';
import { Component, ChangeDetectorRef } from '@angular/core';
import { User } from '../../models/user.model';
import { UserServiceProvider } from '../../providers/user/user.service';
import { NavParams, NavController, IonicPage, Loading, LoadingController, Platform, AlertController } from 'ionic-angular';
import { FirebaseListObservable } from 'angularfire2';
import { SpottedPage } from '../spotted/spotted';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as Geofire from "geofire";
import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';
import { AuthServiceProvider } from '../../providers/auth/auth.service';
import { WelcomePage } from '../welcome/welcome';

@Component({
  selector: 'page-login',
  templateUrl: 'profissionallogin.html',
})
export class ProfissionalLoginPage {
  currentUser: User;
  solicitacoes: FirebaseListObservable<any[]>;

  constructor(    private geolocation: Geolocation,
    public loadingCtrl:LoadingController,
    public platform:Platform,
    public alertCtrl:AlertController,
    public authService: AuthServiceProvider, 

    public spottedService:SpottedServiceProvider,public userService: UserServiceProvider,public navCtrl: NavController, public navParams: NavParams) {
  }
  openSpotted(key:string,materia:string,professor:string):void{
    this.navCtrl.push(SpottedPage,{
      keySolicitacao:key,
      materia:materia,
      professor:professor
    });
  }
  ionViewWillEnter() {
   
  }
  chave;
  ionViewDidLoad() {
    let loading: Loading = this.showLoading('Carregando...');

    this.solicitacoes = this.spottedService.solicitacoes;
    this.userService.currentUser.subscribe(
      (user: User) => {
        this.currentUser = user;
        this.chave = user.$key;
        this.raioDoUsuario = user.distance;
        
      }
    );
    if(this.chave === undefined){
      this.navCtrl.setRoot(ProfissionalLoginPage);
     }else{
      this.geolocaliza();
       loading.dismiss();
     }
    //console.log('ionViewDidLoad SpottedPage');
  }
  private showLoading(mensagem:string): Loading {
    let loading: Loading = this.loadingCtrl.create({
      content: mensagem
    });
    loading.present();
    return loading;
  }
  arraydelocalizacao:Array<number>;
  arrayGlobal = [];

  getLocationUsers(radius: number,raioUsuario:number, coords: Array<number>){
    var usuarioLoc = {};
    var usuariosPerto = [];
    var usuarioFinal = {};

    this.geoFire.query({
      center: coords,
      radius: radius
    })
    .on('key_entered', (key, location, distance)=>{
      ////console.log("key => ",key,"location -> ",location,"distance->",distance);
      if(distance < raioUsuario){
        this.arrayGlobal.push({key:key,distancia:distance});
      }
      let hit = {
        location: location,
        distance: distance
      }
      usuarioLoc = {
        id: key,
        distancia: distance.toFixed(0),
        localizacao: location
      };
      let distancia_final;
      if (usuarioLoc['distancia'] < 1){
        distancia_final = "< 1km";
      }else{
        distancia_final = usuarioLoc['distancia'] + "km";
      }

      this.userService.get(key).subscribe(
        (user: User) => {
          usuarioFinal = {
            id: key,
            name: user.name,
            photo: user.photo,
            distancia: distancia_final,
            localizacao: location
          };
          if(distance > raioUsuario){
            usuariosPerto.push(usuarioFinal);
//AQUI QUE FAZ A FILTRAGEM

            //FILTRAGEM DOS SPOTTED
            this.solicitacoes = <FirebaseListObservable<any[]>>this.solicitacoes.map(
              (solicitacoes: any[]) => {
               
                return solicitacoes.filter(
                  (solicitacao: any) => {
                    return (solicitacao.userId !== key);
                  });
              });
          }
        }
      );
      let currentHits = this.hits.value;
      currentHits.push(hit);
      this.hits.next(currentHits);
    })
    this.geoFire.query({
      center: coords,
      radius: radius
    }).on('key_moved', (key, location, distance)=>{
      //console.log("key => ",key,"location -> ",location,"distance->",distance);

      let hit = {
        location: location,
        distance: distance
      }
      let currentHits = this.hits.value;
      currentHits.push(hit);

      this.hits.next(currentHits);
    })
    usuariosPerto.push(usuarioFinal)
     
return usuariosPerto
  }
  onLogout(): void {
    this.authService.logout();
    this.navCtrl.setRoot(WelcomePage,{
      face:false
    });
  }
geolocaliza2(){
  let loading: Loading = this.showLoading('Geolocalizando..');
  this.referencia = this.spottedService.metodoretornareferencia().$ref;
  this.geoFire = new Geofire(this.referencia);
      this.platform.ready().then(()=>{
        const options : GeolocationOptions = {
      enableHighAccuracy:false,
      maximumAge:0,
      timeout:50000
        };
       this.geolocation.getCurrentPosition(options).then(resp=>{
        this.lat =  resp.coords.latitude;
        this.long = resp.coords.longitude;
  this.arraydelocalizacao = [this.lat, this.long];
  if(this.arraydelocalizacao === undefined || this.arraydelocalizacao === null){
    this.userService.getLocalization(this.chave).forEach(e=>{
     this.arraydelocalizacao = e.l;
    });
    
  }
  //console.log("array dentro do metodo getCurrentPosition" , this.arraydelocalizacao);
       this.geoFire.set(this.chave,this.arraydelocalizacao);
       this.getLocationUsers(120000,this.raioDoUsuario,this.arraydelocalizacao);
       loading.dismiss();

        }).catch((err)=>{
          this.userService.getLocalization(this.chave).forEach(e=>{
            this.getLocationUsers(120000,this.raioDoUsuario,e.l);
            loading.dismiss();
          }).catch(errr=>{
            let alert = this.alertCtrl.create({
              title: 'Sua localização não foi detectada',
              enableBackdropDismiss	:false,
              message: ('Por favor realize o login novamente e ligue o GPS do seu dispositivo'),
                  buttons: [
               
                {
                  text: 'OK',
                  handler: () => {
                    loading.dismiss();
                      this.onLogout();
                     }
                }
                
              ]
            });
            alert.present(); 
          });
        });

      }); 
}
long :number ;
lat:number;
raioDoUsuario : number;
referencia:any;
geoFire:any;
hits = new BehaviorSubject([]);
geolocaliza(){
  let loading: Loading = this.showLoading('Geolocalizando..');

  this.referencia = this.spottedService.metodoretornareferencia().$ref;
  this.geoFire = new Geofire(this.referencia);
      this.platform.ready().then(()=>{
        const options : GeolocationOptions = {
      enableHighAccuracy:true,
      maximumAge:0,
      timeout:50000
        };
       this.geolocation.getCurrentPosition(options).then(resp=>{
        this.lat =  resp.coords.latitude;
        this.long = resp.coords.longitude;
  this.arraydelocalizacao = [this.lat, this.long];
  if(this.arraydelocalizacao === undefined || this.arraydelocalizacao === null){
    this.userService.getLocalization(this.chave).forEach(e=>{
     this.arraydelocalizacao = e.l;
    });

   
  }
//  console.log("array dentro do metodo getCurrentPosition" , this.arraydelocalizacao);
       this.geoFire.set(this.chave,this.arraydelocalizacao);
       this.getLocationUsers(120000,this.raioDoUsuario,this.arraydelocalizacao);
       loading.dismiss();

        }).catch((err)=>{
          this.userService.getLocalization(this.chave).forEach(e=>{
            this.getLocationUsers(120000,this.raioDoUsuario,e.l);
            loading.dismiss();

          }).catch(errr=>{
            let alert = this.alertCtrl.create({
              title: 'Sua localização não foi detectada',
              enableBackdropDismiss	:false,
              message: ('Clique OK para atualizar'),
                  buttons: [
               
                {
                  text: 'OK',
                  handler: () => {
                    //                   this.onLogout();
                    loading.dismiss();
                  this.geolocaliza2();
                     }
                }
                
              ]
            });
            alert.present(); 
          });
        });
      
      /*this.geolocation.watchPosition(options).subscribe(resp=>{
        this.lat =  resp.coords.latitude;
        this.long = resp.coords.longitude;
  this.arraydelocalizacao = [this.lat, this.long];
 
       this.geoFire.set(this.chave,this.arraydelocalizacao);
  
  console.log(this.getLocationUsers(120000,this.raioDoUsuario,this.arraydelocalizacao));
      });
      */
      });  
}

}