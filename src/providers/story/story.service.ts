import { AngularFire, FirebaseApp, FirebaseListObservable, FirebaseObjectObservable, FirebaseAuthState } from 'angularfire2';
import { UserServiceProvider } from './../user/user.service';
import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import firebase from 'firebase';
import { Story } from '../../models/story.model';
import { BaseService } from '../base.service';
import { User } from '../../models/user.model';

@Injectable()
export class StoryService extends BaseService {
  stories: FirebaseListObservable<Story[]>;
items;
  feeds;

  constructor(public userService:UserServiceProvider,
    public af: AngularFire, public http: Http, @Inject(FirebaseApp) public firebaseApp: any) {
    super();
    this.setStories();
this.items = [];
    this.feeds =

      [
        {
          id: "elvis",
          photo: "http://noize.com.br/wp-content/uploads/2015/01/Elvis-Presley-png-version.png",
          name: "Elvis",
          link: "https://ramon.codes",
          lastUpdated: 1492665454,
          items: [
            StoryService.buildItem("ramon-3", "video", 0, "https://scontent-gru2-2.cdninstagram.com/t50.2886-16/14965218_193969377722724_482497862983221248_n.mp4", "https://scontent-gru2-2.cdninstagram.com/t51.2885-15/e15/10597412_455246124639813_1360162248_n.jpg", '', false, 1492665454)
          ]
        }/*
        ,
        {
          id: "gorillaz",
          photo: "https://lh3.googleusercontent.com/xYFz6B9FHMQq7fDOI_MA61gf0sNdzGBbdR7-mZ7i4rEVvE_N-kZEY_A4eP74Imcf8Sq3FYxAgd4eJA=w200",
          name: "Gorillaz",
          link: "",
          lastUpdated: 1492665454,
          items: [
            StoryService.buildItem("gorillaz-1", "video", 0, "https://instagram.frao1-1.fna.fbcdn.net/t50.2886-16/17886251_1128605603951544_572796556789415936_n.mp4", "https://pbs.twimg.com/media/C8VgMQ8WAAE5i9M.jpg:small", '', false, 1492665454),
            StoryService.buildItem("gorillaz-2", "photo", 3, "https://pbs.twimg.com/media/C8VgMQ8WAAE5i9M.jpg:large", "https://pbs.twimg.com/media/C8VgMQ8WAAE5i9M.jpg:small", '', false, 1492665454),
          ]
        },
        {
          id: "ladygaga",
          photo: "https://lh3.googleusercontent.com/VkANYSL1HOzINPSnzBJRM879b302ShsRwLoKD7mLezgTLvlpHPm_dIVop7mkAQfepze6O5N8rw8l4yM=w200",
          name: "Lady Gaga",
          link: "",
          lastUpdated: 1492665454,
          items: [
            StoryService.buildItem("ladygaga-1", "photo", 5, "https://pbs.twimg.com/media/C8mtrEMXcAA9KKM.jpg:large", "https://pbs.twimg.com/media/C8mtrEMXcAA9KKM.jpg:small", '', false, 1492665454),
            StoryService.buildItem("ladygaga-2", "photo", 3, "https://pbs.twimg.com/media/C4t_bxcXAAE3Hwb.jpg:large", "https://pbs.twimg.com/media/C4t_bxcXAAE3Hwb.jpg:small", 'http://ladygaga.com', false, 1492665454),
          ]
        },
        {
          id: "starboy",
          photo: "https://lh3.googleusercontent.com/nMxfllzaAmaCCZJEMiKe2EARjyUNItQ-mdgAq6he-LWXwkIWbiiBIHyC3rGiqDu6fgyVK6NnjcgueA=w200",
          name: "The Weeknd",
          link: "",
          lastUpdated: 1492665454,
          items: [
            StoryService.buildItem("starboy-1", "photo", 5, "https://pbs.twimg.com/media/C6f-dTqVQAAiy1K.jpg:large", "https://pbs.twimg.com/media/C6f-dTqVQAAiy1K.jpg:small", '', false, 1492665454)
          ]
        },
        {
          id: "qotsa",
          photo: "https://lh3.googleusercontent.com/nE4grkY8s88P_1mFFA06mGCNshhqtIz4C4y2dV7AZbm0360zopRKDMCYtUHR0uQR2DAfYMRZdA=s180-p-e100-rwu-v1",
          name: "QOTSA",
          link: "",
          lastUpdated: 1492665454,
          items: [
            StoryService.buildItem("qotsa-1", "photo", 10, "https://pbs.twimg.com/media/C8wTxgUVoAALPGA.jpg:large", "https://pbs.twimg.com/media/C8wTxgUVoAALPGA.jpg:small", '', false, 1492665454)
          ]
        }


      */      ];
    let diferencaTempo:number;
    if(this.stories === undefined){}else{
      this.stories.forEach(
        element=>{
          
          element.forEach(k=>{ 
      
            diferencaTempo = Math.floor((Math.floor(Date.now() / 1000)-k.timestamp)/60/60/24) ;
           //console.log(diferencaTempo,"dif");
            if(diferencaTempo > 1){
                  let storageRef =   firebase.storage().ref();
                   storageRef.child(`stories/${k.userId}/${k.timestamp}.jpeg`).delete();   
                   this.delete(k);
                 }
            this.feeds.push({     
              id: k.$key,
              photo: k.userPhoto,
              name:k.userNome,
              link: "",
              lastUpdated: 	k.timestamp,
              items: [
                StoryService.buildItem(`${k.$key}`, "photo", 10,k.photo,`${k.photo}:small`, '', false,k.timestamp)
              ]
          });

}); 
        }
      );
 
    }
  }
  diferencaTimestamp(timestamp1, timestamp2) {
    var difference = timestamp1 - timestamp2;
    var daysDifference = Math.floor(difference/1000/60/60/24);

    return daysDifference;
}

  static buildItem(id, type, length, src, preview, link, seen, time) {
    return {
      "id": id,
      "type": type,
      "length": length,
      "src": src,
      "preview": preview,
      "link": link,
      "seen": seen,
      "time": time
    };
  }
  users: FirebaseListObservable<User[]>;
  delete(story:Story,/*userId:string*/) : firebase.Promise<void>{
    return this.af.database.object(`/stories/${story.$key}`).remove().catch(this.handlePromiseError);
  }
  getFeed() {
    return this.feeds;
  }

  addFeed(obj) {
    this.feeds.unshift(obj);
  }
  get(userId: string): FirebaseObjectObservable<Story> {
    return <FirebaseObjectObservable<Story>>this.af.database.object(`/stories/${userId}`)
      .catch(this.handleObservableError);
  }
  getAllStories(): FirebaseListObservable<Story[]>{
    return <FirebaseListObservable<Story[]>> this.af.database.list(`stories/`,{
      query :{
        orderByChild: 'timestamp',
        //limita o numero de mensagens que ira aparecer na tela
      }
    }).catch(this.handleObservableError); 
    }
    getStories(userId1: string): FirebaseListObservable<Story[]>{
      return <FirebaseListObservable<Story[]>> this.af.database.list(`/stories/${userId1}`,{
        query :{
          orderByChild: 'timestamp',
          //limita o numero de mensagens que ira aparecer na tela
        }
      }).catch(this.handleObservableError); 
      }
      create(story: Story): firebase.Promise<void> {
        return this.af.database.list(`/stories/`).push(story).catch(this.handlePromiseError);
      }
      uploadPhoto(file:File,userId:string) :firebase.storage.UploadTask {
        return this.firebaseApp.storage().ref().child(`/stories/${userId}`).put(file);
      }
      public setStories(): void {
        this.af.auth.subscribe(
          (authState: FirebaseAuthState) => {
            if (authState) {
              this.stories = <FirebaseListObservable<Story[]>>this.af.database.list(`/stories/`, {
                query: {
                  orderByChild: 'timestamp'
                }
              }).map((stories: Story[]) => {
                return stories.reverse();
              }).catch(this.handleObservableError);
            }
          }
        );
      }

}