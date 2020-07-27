import { UserServiceProvider } from './../../providers/user/user.service';
import { AuthServiceProvider } from './../../providers/auth/auth.service';
import { Component, ChangeDetectorRef } from '@angular/core';
import {  NavController, NavParams, MenuController } from 'ionic-angular';
import { User } from '../../models/user.model';

/**
 * Generated class for the UserProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {
  currentUser: User;
  canEdit: boolean = false;
  private filePhoto: File;
  uploadProgress: number;

  constructor(public menuCtrl:MenuController,public cd: ChangeDetectorRef, public authService: AuthServiceProvider, public userService: UserServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.menuCtrl.enable(false, 'user-menu');
    this.userService.currentUser.subscribe(
      (user: User) => {
        this.currentUser = user;
      }
    )
    //console.log('ionViewDidLoad UserProfilePage');
  }
  onPhoto(event): void {
    this.filePhoto = event.target.files[0];
  }

  private editUser(photoUrl?: string): void {
    this.userService.edit({
      name: this.currentUser.name ,distance: this.currentUser.distance,curso: this.currentUser.curso,faculdade: this.currentUser.faculdade, photo: photoUrl || '' ||
        this.currentUser.photo
    }).then(() => {
      this.canEdit = false;
      this.filePhoto = undefined;
      this.uploadProgress = 0;
    });
  }
  ionViewWillLeave() {
    this.menuCtrl.enable(true, 'user-menu');
  }
  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.filePhoto) {
      //console.log("ver caminho da foto");
      //console.log(this.filePhoto);
      let uploadTask = this.userService.uploadPhoto(this.filePhoto, this.currentUser.$key);
      uploadTask.on('state_changed', (snapshot) => {
        this.uploadProgress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        this.cd.detectChanges();
      }, (error: Error) => {
      }, () => {
        //console.log("url de download da foto");
        //console.log(uploadTask.snapshot.downloadURL);
        this.editUser(uploadTask.snapshot.downloadURL);
      }
      );
    }
    else {
      this.editUser();
    }
  }

}
