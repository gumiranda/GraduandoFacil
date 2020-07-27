import { StoryService } from './../../providers/story/story.service';
import { UserServiceProvider } from './../../providers/user/user.service';
import { CanvasDraw } from './../../components/canvas-draw/canvas-draw';
import {Component, ViewChild, Input, Inject} from '@angular/core';
import { NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import {CameraPreview} from "@ionic-native/camera-preview";
import { Camera, CameraOptions } from 'ionic-native';
import firebase from 'firebase';
import { User } from '../../models/user.model';
import { Story } from '../../models/story.model';
import { HomePage } from '../home/home';


@Component({
  selector: 'page-story-photo',
  templateUrl: 'story-photo.html',
})
export class StoryPhotoPage {

  currentUser: User;

  //base64 da foto
  srcPhoto = "";
  caminhoFoto ="";
  //array com as cores
  availableColours;
  //modo inicial
  mode = 'camera';
  //componente canvas
  @ViewChild('myCanvasDraw')
  canvas :CanvasDraw


  constructor(public storyService:StoryService,public userService:UserServiceProvider,public navCtrl: NavController, public navParams: NavParams, private cameraPreview : CameraPreview, private platform : Platform,alertCtrl:AlertController) {
    this.startCamera();
    this.alertCtrl=alertCtrl;
    this.userService.currentUser.subscribe(
      (user: User) => {
        this.currentUser = user;
      }
    )
  }

  startCamera(){

    try{
      this.cameraPreview.stopCamera().then(() =>{
        //console.log("camera started")

      }).catch(e =>{
        //console.log("camera error")
      });
    }catch(e) {

    }
    // start camera
    this.cameraPreview.startCamera({x: 0, y: 0, width:this.platform.width(), height: this.platform.height(), toBack: true, previewDrag: false, tapPhoto: true});

  }
  frontalOuTraseira :boolean = true;
mudaCamera(){
   this.frontalOuTraseira = !this.frontalOuTraseira;
}
  ionViewDidLoad() {
    //console.log('ionViewDidLoad StoryPhotoPage');
  }

  ionViewWillLeave(){
    this.cameraPreview.stopCamera();
  }

  /**
   * Switch from back to front cämera
   */
  refresh(){
    this.cameraPreview.switchCamera();
  }

  /**
   * Back button
   */
  back(){
      this.navCtrl.pop()
  }


  //inicia modo brush e slide das cores
  modeBrush(){
    this.mode = 'brush'
    this.availableColours = this.canvas.availableColours;
  }

  //ao salvar vai adicionar ao feed de Story
  save(){

  }

  //ao finalizar o desenho na foto
  done(){
    this.mode = 'photo';
  }

  takePicture(){

    var self = this;

    const pictureOpts = {
      quality: 80
    }


    //tira a foto e coloca modo 'photo'
    this.cameraPreview.takePicture(pictureOpts).then(base64PictureData =>{
      self.srcPhoto = base64PictureData;
    this.caminhoFoto = `data:image/jpeg;base64,${base64PictureData}`
      this.mode = 'photo';

      self.cameraPreview.hide().then(() => {
      })

    });
  }
alertCtrl:AlertController;
@Input('useURI') useURI : boolean=true;
  upFromGallery(sourceType){
    this.mode = 'gallery';
    let cameraDirection:number;
      if(this.frontalOuTraseira){
        cameraDirection = 1;
      }else{
   cameraDirection = 0;
  }
  const cameraOptions:CameraOptions = {
    quality:80,
    destinationType: Camera.DestinationType.DATA_URL,
    encodingType: Camera.EncodingType.JPEG,
    mediaType: Camera.MediaType.PICTURE,
    correctOrientation:true,
    cameraDirection:cameraDirection,
    sourceType:sourceType
  };
Camera.getPicture(cameraOptions).then((caminhoFoto)=>{
  this.srcPhoto = caminhoFoto;
  this.caminhoFoto = `data:image/jpeg;base64,`+ caminhoFoto;
},(e)=>{
  //console.log(e);
});
    }
    upload(){
     let storageRef =   firebase.storage().ref();
const fileName = Math.floor(Date.now()/1000);
const imageRef = storageRef.child(`stories/${this.currentUser.$key}/${fileName}.jpeg`);
imageRef.putString(this.caminhoFoto,firebase.storage.StringFormat.DATA_URL).then((snapshot)=>{
 let story = new Story(snapshot.downloadURL,this.currentUser.$key,this.currentUser.name,this.currentUser.photo,fileName);
 this.storyService.create(story);
  this.showSuccesfulUploadAlert();
  this.navCtrl.setRoot(HomePage);
  //snapshot.downloadURL); 
});
this.mode = 'camera';
}
showSuccesfulUploadAlert(){
  let alert = this.alertCtrl.create({
    title: 'Enviado',
    subTitle:'Story enviada com sucesso ',
    buttons:['OK']
  });
  alert.present();
  this.caminhoFoto="";
}
//storage.ref().child(uid).child(img).delete()
   

}