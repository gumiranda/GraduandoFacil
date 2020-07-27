import { StoryService } from './../../providers/story/story.service';
import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/user/user.service';
import { User } from '../../models/user.model';

/**
 * Generated class for the StoriesListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-stories-list',
  templateUrl: 'stories-list.html',
})
export class StoriesListPage {
  currentUser: User;

  constructor(public userService: UserServiceProvider,public navCtrl: NavController, public navParams: NavParams) {
  //  this.storyService.getFeed();
  }

  ionViewWillEnter() {
   
  }
  ionViewDidLoad() {
    this.userService.currentUser.subscribe(
      (user: User) => {
        this.currentUser = user;
      }
    );
   
    //console.log('ionViewDidLoad SpottedPage');
  }

}
