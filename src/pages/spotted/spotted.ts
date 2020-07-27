import { SpottedServiceProvider } from './../../providers/spotted/spotted.service';
import { HomePage } from './../home/home';
import {FirebaseListObservable } from 'angularfire2';
import { AuthServiceProvider } from './../../providers/auth/auth.service';
import { UserServiceProvider } from './../../providers/user/user.service';
import { Component, ChangeDetectorRef, Input } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import firebase from 'firebase';
import { User } from '../../models/user.model';
import { Spotted } from '../../models/spotted.model';
import { Camera, CameraOptions } from 'ionic-native';

/**
* Generated class for the SpottedPage page.
*
* See http://ionicframework.com/docs/components/#navigation for more info
* on Ionic pages and navigation.
*/

@Component({
  selector: 'page-spotted',
  templateUrl: 'spotted.html',
})
export class SpottedPage {
	    caminhoFoto ="";
    flagFoto:boolean = false;
  spottedForm: FormGroup;
  currentUser: User;
  private filePhoto: File;
  uploadProgress: number;
  spotted: Spotted;
        srcPhoto = '';
  spotteds: FirebaseListObservable<Spotted[]>;
  keySolicitacao:string;
 professor:string;
  materia:string;
  flagSolicitacao:boolean = false ;
  constructor(public loadingCtrl: LoadingController,
    public cd: ChangeDetectorRef,
    public spottedService: SpottedServiceProvider,
    public alertCtrl: AlertController,
    public authService: AuthServiceProvider, public userService: UserServiceProvider, public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder) {
      this.keySolicitacao = navParams.get('keySolicitacao');
     this.materia = navParams.get('materia');
     this.professor = navParams.get('professor');
     //console.log(this.materia,this.professor,this.keySolicitacao);
     if(this.keySolicitacao === undefined){
      this.spottedForm = this.formBuilder.group({
        materia: ['', [Validators.required, Validators.minLength(3),Validators.maxLength(20)]],
        dificuldadeMateria: ['', [Validators.required]],
        professor: ['', [Validators.required, Validators.minLength(3),Validators.maxLength(20)]],
        dificuldadeProfessor: ['', [Validators.required]],
        conteudo: ['', [Validators.required, Validators.minLength(10)]]
      });
      this.flagSolicitacao = true;
     }else{
      this.spottedForm = this.formBuilder.group({
        dificuldadeMateria: ['', [Validators.required]],
        dificuldadeProfessor: ['', [Validators.required]],
        conteudo: ['', [Validators.required, Validators.minLength(10)]]
      });
      this.flagSolicitacao = false;
    }
//console.log(this.flagSolicitacao);

    

  }
  openSpotted(): void {

  }
  ionViewDidLoad() {
    this.userService.currentUser.subscribe(
      (user: User) => {
        this.currentUser = user;
      }
    )
    ////console.log('ionViewDidLoad SpottedPage');
  }

foto;

  onSubmit(): void {
    let loading: Loading = this.showLoading();
  //console.log(this.srcPhoto,"1");

if(this.flagSolicitacao === true){
  let currentTimestamp: Object = firebase.database.ServerValue.TIMESTAMP;
  let formSpotted = this.spottedForm.value;
    let materia: string = formSpotted.materia;
      let professor: string = formSpotted.professor;
      let dificuldadeMateria: string = formSpotted.dificuldadeMateria;
      let dificuldadeProfessor: string = formSpotted.dificuldadeProfessor;
      let conteudo: string = formSpotted.conteudo;
  if(this.flagFoto){
    //console.log(this.flagFoto);
      let storageRef =   firebase.storage().ref();
 const fileName = Math.floor(Date.now()/1000);
 const imageRef = storageRef.child(`spotteds/${this.currentUser.$key}/${fileName}.jpeg`);
 //console.log(fileName,imageRef);
 imageRef.putString(this.caminhoFoto,firebase.storage.StringFormat.DATA_URL).then((snapshot)=>{
   let spotted = new Spotted(this.currentUser.faculdade,this.currentUser.curso,materia,professor,dificuldadeMateria,dificuldadeProfessor, 
    conteudo,snapshot.downloadURL,this.currentUser.$key,this.currentUser.name,this.currentUser.photo,0,0,currentTimestamp);
  //console.log(this.srcPhoto,"2");
 this.spottedService.create(spotted).then(() => {
  //console.log('spotted criado');
  this.showSuccesfulUploadAlert(); //snapshot.downloadURL);
  this.srcPhoto = '';
     this.caminhoFoto="";
          this.navCtrl.setRoot(HomePage,{
            visao:'feed'
          });
          loading.dismiss();
        }).catch((error: any) => {
          //console.log(error);
          loading.dismiss();
          this.showAlert(error);
        });
 });

}else{
	 this.spotted = new Spotted(this.currentUser.faculdade,this.currentUser.curso,materia,professor,dificuldadeMateria,dificuldadeProfessor, 
conteudo,'',this.currentUser.$key,this.currentUser.name,this.currentUser.photo,0,0,currentTimestamp);

      
this.spottedService.create(this.spotted).then(() => {
  //console.log('spotted criado');
  this.showSuccesfulUploadAlert(); //snapshot.downloadURL);
  this.srcPhoto = '';
     this.caminhoFoto="";
          this.navCtrl.setRoot(HomePage,{
            visao:'feed'
          });
          loading.dismiss();
        }).catch((error: any) => {
          //console.log(error);
          loading.dismiss();
          this.showAlert(error);
        });
}
}
else{
  //this.spottedService.deleteSolicitacao(this.keySolicitacao);
  let materia: string = this.materia;
  let professor: string = this.professor;
  let currentTimestamp: Object = firebase.database.ServerValue.TIMESTAMP;
  let formSpotted = this.spottedForm.value;
      let dificuldadeMateria: string = formSpotted.dificuldadeMateria;
      let dificuldadeProfessor: string = formSpotted.dificuldadeProfessor;
      let conteudo: string = formSpotted.conteudo;
  if(this.flagFoto){
      let storageRef =   firebase.storage().ref();
 const fileName = Math.floor(Date.now()/1000);
 const imageRef = storageRef.child(`spotteds/${this.currentUser.$key}/${fileName}.jpeg`);
 imageRef.putString(this.caminhoFoto,firebase.storage.StringFormat.DATA_URL).then((snapshot)=>{
  let baguidafoto = snapshot.downloadURL;
  let spotted = new Spotted(this.currentUser.faculdade,this.currentUser.curso,materia,professor,dificuldadeMateria,dificuldadeProfessor, conteudo,baguidafoto,this.currentUser.$key,this.currentUser.name,this.currentUser.photo,0,0,currentTimestamp);
 this.spottedService.create(spotted).then(() => {
  //console.log('spotted criado');
  this.showSuccesfulUploadAlert(); //snapshot.downloadURL);
  this.srcPhoto = '';
     this.caminhoFoto="";
          this.navCtrl.setRoot(HomePage,{
            visao:'feed'
          });
          loading.dismiss();
        }).catch((error: any) => {
          //console.log(error);
          loading.dismiss();
          this.showAlert(error);
        });
 });

}
else{
	this.spotted = new Spotted(this.currentUser.faculdade,this.currentUser.curso,materia,professor,dificuldadeMateria,dificuldadeProfessor, conteudo,'',this.currentUser.$key,this.currentUser.name,this.currentUser.photo,0,0,currentTimestamp);

      
  this.spottedService.create(this.spotted).then(() => {
    //console.log('spotted criado');
    this.showSuccesfulUploadAlert(); //snapshot.downloadURL);
    this.srcPhoto = '';
       this.caminhoFoto="";
            this.navCtrl.setRoot(HomePage,{
              visao:'feed'
            });
            loading.dismiss();
          }).catch((error: any) => {
            //console.log(error);
            loading.dismiss();
            this.showAlert(error);
          });
}

}
 //loading.present(); 
  }//fim do método onSubmit

  private showAlert(message: string): void {
    this.alertCtrl.create({
      message: message,
      buttons: ['OK']
    }).present();
  }


  private showLoading(): Loading {
    let loading: Loading = this.loadingCtrl.create({
      content: 'Carregando...'
    });
    loading.present();
    return loading;
  }
  @Input('useURI') useURI : boolean=true;
  upFromGallery(sourceType){
  
  const cameraOptions:CameraOptions = {
    quality:80,
    destinationType: Camera.DestinationType.DATA_URL,
    encodingType: Camera.EncodingType.JPEG,
    mediaType: Camera.MediaType.PICTURE,
    correctOrientation:true,
targetHeight:300,
targetWidth:300,
    sourceType:sourceType
  };
    //console.log(cameraOptions,"1");

Camera.getPicture(cameraOptions).then((caminhoFoto)=>{
  this.srcPhoto = caminhoFoto;
    //console.log(this.srcPhoto,"3");
  this.caminhoFoto = `data:image/jpeg;base64,`+ caminhoFoto;
    //console.log(caminhoFoto,"1");

},(e)=>{
  //console.log(e);
});

this.flagFoto = true;
    }
 showSuccesfulUploadAlert(){
   let alert = this.alertCtrl.create({
     title: 'Enviado',
     subTitle:'Post enviado com sucesso ',
     buttons:['OK']
   });
   alert.present();
 }
}