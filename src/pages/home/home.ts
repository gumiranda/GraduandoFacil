import { Bloqueado } from "./../../models/bloqueado.model";
import { BloqueadoService } from "./../../providers/bloqueado/bloqueado.service";
import { NotificacoesPage } from "./../notificacoes/notificacoes";
import { MessageServiceProvider } from "./../../providers/message/message.service";
import { LocalNotifications } from "@ionic-native/local-notifications";
import { StoryService } from "./../../providers/story/story.service";
import { BehaviorSubject } from "rxjs";
//import { BranchIo } from '@ionic-native/branch-io';
import { SpottedServiceProvider } from "./../../providers/spotted/spotted.service";
import { BotchatPage } from "./../botchat/botchat";
import { ChatServiceProvider } from "./../../providers/chat/chat.service";
import { Chat } from "./../../models/chat.model";
import { ChatPage } from "./../chat/chat";
import { WelcomePage } from "./../welcome/welcome";
import { AuthServiceProvider } from "./../../providers/auth/auth.service";
import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  MenuController,
  Platform,
  AlertController,
  IonicPage,
  LoadingController,
  Loading,
} from "ionic-angular";
import { User } from "./../../models/user.model";
import { UserServiceProvider } from "./../../providers/user/user.service";
import { FirebaseListObservable } from "angularfire2";
import firebase from "firebase";
import "rxjs/add/operator/first";
import { Spotted } from "../../models/spotted.model";
import { SpottedPage } from "../spotted/spotted";
import { SpottedDetalhesPage } from "../spotted-detalhes/spotted-detalhes";
import {
  Geolocation,
  Geoposition,
  GeolocationOptions,
} from "@ionic-native/geolocation";
import { PerfilPage } from "../perfil/perfil";
//import { errorHandler } from '@angular/platform-browser';
import * as Geofire from "geofire";
import { Story } from "../../models/story.model";
import { Notificacao } from "../../models/notificacao.model";

@Component({
  selector: "page-home",
  templateUrl: "home.html",
})
export class HomePage {
  chats: FirebaseListObservable<Chat[]>;
  users: FirebaseListObservable<User[]>;
  bloqueados: FirebaseListObservable<Bloqueado[]>;
  stories: FirebaseListObservable<Story[]>;

  usuariosPerto: any[];
  plataforma: boolean = false;
  spotteds: FirebaseListObservable<Spotted[]>;
  headerImage: any = "assets/images/background/22.jpg";
  view: string = "feed";
  long: number;
  lat: number;
  raioDoUsuario: number;
  referencia: any;
  geoFire: any;
  hits = new BehaviorSubject([]);
  skins = {
    Snapgram: {
      avatars: true,
      list: false,
      autoFullScreen: false,
      cubeEffect: true,
    },

    VemDeZAP: {
      avatars: false,
      list: true,
      autoFullScreen: false,
      cubeEffect: false,
    },

    FaceSnap: {
      avatars: true,
      list: false,
      autoFullScreen: true,
      cubeEffect: false,
    },

    Snapssenger: {
      avatars: false,
      list: false,
      autoFullScreen: false,
      cubeEffect: false,
    },
  };

  face: boolean;
  arraydelocalizacao: Array<number>;
  chave: string;
  static flag: boolean;
  constructor(
    public menuCtrl: MenuController,
    private geolocation: Geolocation,
    public alertCtrl: AlertController,
    // private branch: BranchIo,
    public storyService: StoryService,
    public loadingCtrl: LoadingController,
    public messageService: MessageServiceProvider,
    private localNotifications: LocalNotifications,
    public platform: Platform,
    public spottedService: SpottedServiceProvider,
    public chatService: ChatServiceProvider,
    public authService: AuthServiceProvider,
    public bloqueadoService: BloqueadoService,
    public userService: UserServiceProvider,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.plataforma = platform.is("android");
    this.view = navParams.get("visao");
    this.face = navParams.get(
      "face"
    ); /*
if(this.plataforma){
   branch.initSession().then(function(data) {
    if (data['+clicked_branch_link']) {
      // read deep link data on click
      alert('Deep Link Data1: ' + JSON.stringify(data))
    }
  });
}
*/
    this.storyService.getFeed();

    /*
 this.localNotifications.on('click',this.callback).subscribe((notification) =>
{

   if(notification.data.notif.tipo === 1){
  if(notification.data.flag === 1 ){
  this.messageService.deleteNotificacao(notification.data.notif);
  this.view = 'conversas';
  let chat = new Chat('a','k','k','k','l');
  chat.$key = notification.data.recipientId;
  this.setChatOpen(chat);
 }
else{
 //alert('caiu no else');
}
}
});
*/
    this.platform.ready().then((readySource) => {
      this.localNotifications.on("click", (notification, state) => {
        if (notification.data.notif.tipo === 1) {
          if (notification.data.flag === 1) {
            this.messageService.deleteNotificacao(notification.data.notif);
            this.view = "conversas";
            let chat = new Chat("a", "k", "k", "k", "l");
            chat.$key = notification.data.recipientId;
            this.setChatOpen(chat);
          } else {
            //alert('caiu no else');
          }
        }
      });
    });
  }
  removerSpotted(spotted: Spotted) {
    let alert = this.alertCtrl.create({
      title: "Deseja deletar o post?",
      enableBackdropDismiss: false,
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          handler: () => {
            //console.log('Cancel clicked');
          },
        },
        {
          text: "Sim",
          handler: () => {
            this.spottedService.delete(spotted);
            this.navCtrl.setRoot(HomePage, {
              visao: "feed",
            });
          },
        },
      ],
    });
    alert.present();
  }
  private callback = function (notification) {};
  arrayGlobal = [];
  getLocationUsers(radius: number, raioUsuario: number, coords: Array<number>) {
    var usuarioLoc = {};
    var usuariosPerto = [];
    var usuarioFinal = {};

    this.geoFire
      .query({
        center: coords,
        radius: radius,
      })
      .on("key_entered", (key, location, distance) => {
        ////console.log("key => ",key,"location -> ",location,"distance->",distance);
        if (distance < raioUsuario) {
          this.arrayGlobal.push({ key: key, distancia: distance });
        }
        let hit = {
          location: location,
          distance: distance,
        };
        usuarioLoc = {
          id: key,
          distancia: distance.toFixed(0),
          localizacao: location,
        };
        let distancia_final;
        if (usuarioLoc["distancia"] < 1) {
          distancia_final = "< 1km";
        } else {
          distancia_final = usuarioLoc["distancia"] + "km";
        }

        this.userService.get(key).subscribe((user: User) => {
          usuarioFinal = {
            id: key,
            name: user.name,
            photo: user.photo,
            distancia: distancia_final,
            localizacao: location,
          };
          if (distance > raioUsuario) {
            usuariosPerto.push(usuarioFinal);
            //AQUI QUE FAZ A FILTRAGEM
            this.users = <FirebaseListObservable<User[]>>this.users.map(
              (users: User[]) => {
                return users.filter((user: User) => {
                  return user.$key !== key;
                });
              }
            );
            //FILTRAGEM DOS SPOTTED
            this.spotteds = <FirebaseListObservable<Spotted[]>>(
              this.spotteds.map((spotteds: Spotted[]) => {
                return spotteds.filter((spotted: Spotted) => {
                  return spotted.userId !== key;
                });
              })
            );
          }
        });
        let currentHits = this.hits.value;
        currentHits.push(hit);
        this.hits.next(currentHits);
      });
    this.geoFire
      .query({
        center: coords,
        radius: radius,
      })
      .on("key_moved", (key, location, distance) => {
        //console.log("key => ",key,"location -> ",location,"distance->",distance);

        let hit = {
          location: location,
          distance: distance,
        };
        let currentHits = this.hits.value;
        currentHits.push(hit);

        this.hits.next(currentHits);
      });
    usuariosPerto.push(usuarioFinal);

    return usuariosPerto;
  }

  setLocation(key: string, coords: Array<number>) {
    this.geoFire.set(key, coords);
  }

  feeds = [];
  arrayNotif = [];
  bloqueia() {
    this.bloqueados.forEach((bloq) => {
      bloq.forEach((b) => {
        this.users = <FirebaseListObservable<User[]>>this.users.map(
          (users: User[]) => {
            return users.filter((user: User) => {
              return user.$key !== b.bloqueado;
            });
          }
        );
        this.spotteds = <FirebaseListObservable<Spotted[]>>this.spotteds.map(
          (spotteds: Spotted[]) => {
            return spotteds.filter((spotted: Spotted) => {
              return spotted.userId !== b.bloqueado;
            });
          }
        );
        this.chats = <FirebaseListObservable<Chat[]>>this.chats.map(
          (chats: Chat[]) => {
            return chats.filter((chat: Chat) => {
              return chat.title !== b.nomeBloqueado;
            });
          }
        );
      });
    });
  }
  nome;
  facebookflag: boolean;
  ionViewDidLoad() {
    let loading: Loading = this.showLoading("Carregando...");
    this.userService.currentUser.first().subscribe((currentUser: User) => {
      this.chave = currentUser.$key;
      this.facebookflag = currentUser.facebookflag;
      this.nome = currentUser.name;
      this.raioDoUsuario = currentUser.distance;
      //     console.log(this.userService.getLocalization(this.chave));

      if (
        this.authService.getEmailVerified() === false &&
        (this.face === false ||
          this.facebookflag === false ||
          this.facebookflag === undefined)
      ) {
        let alert = this.alertCtrl.create({
          title: "Confirme o seu email para realizar o login",
          enableBackdropDismiss: false,
          buttons: [
            {
              text: "OK",
              handler: () => {
                loading.dismiss();

                this.onLogout();
                /*  this.navCtrl.setRoot(WelcomePage,{
                 face:false
               });
               */
              },
            },
          ],
        });
        alert.present();
      }

      this.chats = this.chatService.chats;
      this.stories = this.storyService.stories;
      let diferencaTempo: number;
      if (this.nome === undefined) {
        this.userService.delete(this.chave);
        this.navCtrl.setRoot(WelcomePage, {
          face: this.face,
        });
      }
      if (this.stories === undefined || this.stories === null) {
        this.feeds = this.storyService.getFeed();

        //tenho que modificar o html dos componente toda vez que entra para atuali
      } else {
        this.stories.forEach((element) => {
          element.forEach((k) => {
            diferencaTempo = Math.floor(
              (Math.floor(Date.now() / 1000) - k.timestamp) / 60 / 60 / 24
            );
            if (diferencaTempo > 1) {
              let storageRef = firebase.storage().ref();
              storageRef
                .child(`stories/${k.userId}/${k.timestamp}.jpeg`)
                .delete();
              this.storyService.delete(k);
            }
            this.feeds.push({
              id: k.$key,
              photo: k.userPhoto,
              name: k.userNome,
              link: "",
              lastUpdated: k.timestamp,
              items: [
                StoryService.buildItem(
                  `${k.$key}`,
                  "photo",
                  10,
                  k.photo,
                  `${k.photo}:small`,
                  "",
                  false,
                  k.timestamp
                ),
              ],
            });
          });
        });
      }
      //          this.users = this.userService.users;
      this.users = this.userService.users;
      this.spotteds = this.spottedService.getAllSpotteds();
      this.bloqueados = this.bloqueadoService.getBloqueados(this.chave);
      this.bloqueia();
      this.filtraUsuariosSemLocalizacao();
      //          this.spotteds = this.spottedService.spotteds;

      let esseUsuarioTaPerto = 0;
      //let loading2: Loading = this.showLoading('Geolocalizando..');
      this.geolocaliza();
      // loading2.dismiss();
      loading.dismiss();
    });

    if (!HomePage.flag) {
      this.userService.currentUser.first().subscribe((currentUser: User) => {
        this.notificacoes = this.messageService.getAllNotificacoes(
          currentUser.$key
        );
        this.notificacoes.subscribe((notificacoes: Notificacao[]) => {
          if (notificacoes.length === 1) {
            notificacoes.forEach((n) => {
              if (!n.lida) {
                this.platform.ready().then(() => {
                  this.localNotifications.schedule({
                    title: n.titulo,
                    text: n.texto,
                    icon: n.senderPhoto,
                    data: {
                      notif: n,
                      flag: 1,
                      recipientId: n.senderKey,
                      nome: n.titulo,
                    },
                  });
                });
              }
            });
          } else if (notificacoes.length > 1) {
            notificacoes.forEach((n) => {
              this.messageService.deleteNotificacao(n);
            });
            this.platform.ready().then(() => {
              this.localNotifications.schedule({
                title: "Graduando Fácil",
                text: "você tem " + notificacoes.length + " novas mensagens",
                data: { usuarioAtual: currentUser, flag: 2 },
              });
            });
          }
        });
      });
    }
    /*let storiesC = new (<any>window).Zuck('stories', {
  backNative: true,
  autoFullScreen: this.skins['Snapgram']['autoFullScreen'],
  skin: 'Snapgram',
  avatars: this.skins['Snapgram']['avatars'],
  list: this.skins['Snapgram']['list'],
  cubeEffect: this.skins['Snapgram']['cubeEffect'],
  localStorage: true,
  stories:this.feeds //feeds //
});
*/
    this.menuCtrl.enable(true, "user-menu");
  }

  onChatCreate(recipientUser: User) {
    HomePage.flag = true;
    this.userService.currentUser.first().subscribe((currentUser: User) =>
      this.chatService
        .getDeepChat(currentUser.$key, recipientUser.$key)
        .first()
        .subscribe((chat: Chat) => {
          if (chat.hasOwnProperty(`$value`)) {
            let timestamp: Object = firebase.database.ServerValue.TIMESTAMP;
            let chat1 = new Chat(
              "",
              timestamp,
              recipientUser.name,
              "",
              recipientUser.status
            );
            this.chatService.create(
              chat1,
              currentUser.$key,
              recipientUser.$key
            );
            let chat2 = new Chat(
              "",
              timestamp,
              currentUser.name,
              "",
              recipientUser.status
            );
            this.chatService.create(
              chat2,
              recipientUser.$key,
              currentUser.$key
            );
          }
        })
    );
    let distancia: number;
    if (this.arrayGlobal === undefined) {
      this.geolocaliza();
    } else {
      this.arrayGlobal.forEach((a) => {
        if (recipientUser.$key === a.key) {
          distancia = a.distancia;
        }
      });
    }
    this.navCtrl.push(ChatPage, {
      recipientUser: recipientUser,
      usuariosperto: distancia,
    });
  }

  onLogout() {
    this.authService.logout();
    this.navCtrl.setRoot(WelcomePage, {
      face: false,
    });
  }
  openPerfil(userId: string) {
    let distancia: number;
    this.arrayGlobal.forEach((a) => {
      if (userId === a.key) {
        distancia = a.distancia;
      }
    });
    this.userService
      .get(userId)
      .first()
      .subscribe((user: User) => {
        this.navCtrl.push(PerfilPage, {
          usuario: user,
          usuarioAtual: this.chave,
          usuariosperto: distancia,
        });
      });
  }
  usuarioCurso: string;
  usuarioFaculdade: string;
  openSpotted() {
    let alert = this.alertCtrl.create({
      title: "Novo post",
      message: "Selecione a opção desejada",
      buttons: [
        {
          text: "Solicitar Matéria",
          handler: () => {
            let alert2 = this.alertCtrl.create({
              title: "Confirmar cadastro",
              inputs: [
                {
                  name: "materia",
                  placeholder: "Nome da matéria",
                },
                {
                  name: "professor",
                  placeholder: "Nome do professor",
                },
              ],
              buttons: [
                {
                  text: "Cancelar",
                  role: "cancel",
                  handler: () => {},
                },
                {
                  text: "Enviar",
                  handler: (data) => {
                    this.userService.currentUser
                      .first()
                      .subscribe((currentUser: User) => {
                        this.chave = currentUser.$key;
                        this.usuarioCurso = currentUser.curso;
                        this.usuarioFaculdade = currentUser.faculdade;
                      });
                    data.userId = this.chave;
                    data.usuarioCurso = this.usuarioCurso;
                    data.usuarioFaculdade = this.usuarioFaculdade;
                    data.timestamp = firebase.database.ServerValue.TIMESTAMP;
                    this.spottedService.createSolicitacao(data);
                  },
                },
              ],
            });
            alert2.present();
          },
        },
        {
          text: "Avaliar Matéria",
          handler: () => {
            this.navCtrl.push(SpottedPage);
          },
        },
      ],
    });
    alert.present();
  }
  openChatBot() {
    this.navCtrl.push(BotchatPage);
  }

  ionViewCanEnter(): Promise<boolean> {
    return this.authService.authenticated;
  }

  async deuLike(currentspotted: Spotted) {
    let user = this.userService.currentUser;
    this.userService.currentUser.first().subscribe((currentUser: User) => {
      this.chave = currentUser.$key;
    });
    await this.spottedService.darLike(currentspotted, this.chave);
    await this.spottedService.atualizaLike(currentspotted, this.chave);
  }
  async irParaPageDetalhesSpotted(spotted: Spotted) {
    let distancia: number;
    if (this.arrayGlobal === undefined) {
      await this.geolocaliza();
    } else {
      await this.arrayGlobal.forEach((a) => {
        if (spotted.userId === a.key) {
          distancia = a.distancia;
        }
      });
    }
    this.navCtrl.push(SpottedDetalhesPage, {
      spotted: spotted,
      usuariosperto: this.arrayGlobal,
    });
  }
  async filterItems(event: any) {
    let searchTerm: string = event.target.value;
    this.chats = this.chatService.chats;
    this.users = this.userService.users;
    this.spotteds = await this.spottedService.getAllSpotteds();
    await this.geolocaliza();
    await this.bloqueia();
    await this.filtraUsuariosSemLocalizacao();
    if (searchTerm) {
      switch (this.view) {
        case "conversas":
          this.chats = await (<FirebaseListObservable<Chat[]>>this.chats.map(
            (chats: Chat[]) => {
              return chats.filter((chat: Chat) => {
                return (
                  chat.title
                    .toLowerCase()
                    .indexOf(searchTerm.toLocaleLowerCase()) > -1
                );
              });
            }
          ));
          break;
        case "pessoas":
          this.users = await (<FirebaseListObservable<User[]>>this.users.map(
            (users: User[]) => {
              return users.filter((user: User) => {
                return (
                  user.name
                    .toLowerCase()
                    .indexOf(searchTerm.toLocaleLowerCase()) > -1
                );
              });
            }
          ));
          break;
        case "feed":
          this.spotteds = await (<FirebaseListObservable<Spotted[]>>(
            this.spotteds.map((spotteds: Spotted[]) => {
              return spotteds.filter((spotted: Spotted) => {
                return (
                  spotted.professor
                    .toLowerCase()
                    .indexOf(searchTerm.toLocaleLowerCase()) > -1 ||
                  spotted.conteudo
                    .toLowerCase()
                    .indexOf(searchTerm.toLocaleLowerCase()) > -1 ||
                  spotted.materia
                    .toLowerCase()
                    .indexOf(searchTerm.toLocaleLowerCase()) > -1
                );
              });
            })
          ));
          break;
      }
    }
  }
  async setChatOpen(chat: Chat) {
    let recipientUserId: string = chat.$key;
    let distancia: number;
    if (this.arrayGlobal === undefined) {
      await this.geolocaliza();
    } else {
      await this.arrayGlobal.forEach((a) => {
        if (recipientUserId === a.key) {
          distancia = a.distancia;
        }
      });
    }

    await this.userService
      .get(recipientUserId)
      .first()
      .subscribe((user: User) => {
        this.navCtrl.setRoot(ChatPage, {
          recipientUser: user,
          usuariosperto: distancia,
        });
      });
  }
  async onChatOpen(chat: Chat) {
    let recipientUserId: string = chat.$key;
    let distancia: number;
    if (this.arrayGlobal === undefined) {
      await this.geolocaliza();
    } else {
      await this.arrayGlobal.forEach((a) => {
        if (recipientUserId === a.key) {
          distancia = a.distancia;
        }
      });
    }

    await this.userService
      .get(recipientUserId)
      .first()
      .subscribe((user: User) => {
        this.navCtrl.push(ChatPage, {
          recipientUser: user,
          usuariosperto: distancia,
        });
      });
  }

  async onSpottedOpen(spotted: Spotted) {
    let recipientUserId: string = spotted.$key;
    await this.userService
      .get(recipientUserId)
      .first()
      .subscribe((user: User) => {
        this.navCtrl.push(ChatPage, {
          recipientUser: user,
        });
      });
  }
  notificacoes: FirebaseListObservable<Notificacao[]>;

  ionViewWillEnter() {
    if (this.authService.getEmailVerified() === false && this.face === false) {
      let alert = this.alertCtrl.create({
        title: "Confirme o seu email para realizar o login",
        enableBackdropDismiss: false,
        buttons: [
          {
            text: "OK",
            handler: () => {
              this.navCtrl.setRoot(WelcomePage, {
                face: false,
              });
            },
          },
        ],
      });
      alert.present();
    }
  }

  storiesList;
  verificaArray() {
    let tamain: number;
    this.users.forEach((e) => {
      tamain = e.length;
    });
    if (this.arrayGlobal.length !== tamain) {
      this.geolocaliza();
    }
  }

  async doInfinite(infiniteScroll) {
    if (this.view === "conversas") {
    } else if (this.view === "feed") {
      if (infiniteScroll) {
        setTimeout(async () => {
          await this.spottedService.loadMoreObjects();
          this.navCtrl.setRoot(HomePage, {
            visao: "feed",
          });
          this.spotteds = this.spottedService.getAllSpotteds();
          if (
            this.arrayGlobal === undefined ||
            this.arraydelocalizacao === undefined
          ) {
            this.geolocaliza();
          } else {
            let tamain: number;
            this.users.forEach((e) => {
              tamain = e.length;
            });
            if (this.arrayGlobal.length !== tamain) {
              this.geolocaliza();
            }
          }
          infiniteScroll.complete();
        }, 2500);
      }
    } else {
      if (infiniteScroll) {
        setTimeout(() => {
          this.userService.loadMoreObjects();
          this.users = this.userService.users;
          this.geolocaliza();
          this.bloqueia();
          this.filtraUsuariosSemLocalizacao();
          this.navCtrl
            .setRoot(HomePage, {
              visao: "pessoas",
            })
            .then(() => {
              if (this.view !== "pessoas") {
                this.view = "pessoas";
              }
            });

          infiniteScroll.complete();
        }, 2560);
      }
    }
  }
  geolocaliza2() {
    this.referencia = this.spottedService.metodoretornareferencia().$ref;
    this.geoFire = new Geofire(this.referencia);
    this.platform.ready().then(() => {
      const options: GeolocationOptions = {
        enableHighAccuracy: false,
        maximumAge: 0,
        timeout: 5000,
      };
      this.geolocation
        .getCurrentPosition(options)
        .then((resp) => {
          this.lat = resp.coords.latitude;
          this.long = resp.coords.longitude;
          this.arraydelocalizacao = [this.lat, this.long];
          if (
            this.arraydelocalizacao === undefined ||
            this.arraydelocalizacao === null
          ) {
            this.userService.getLocalization(this.chave).forEach((e) => {
              this.arraydelocalizacao = e.l;
            });
          }
          //console.log("array dentro do metodo getCurrentPosition" , this.arraydelocalizacao);
          this.geoFire.set(this.chave, this.arraydelocalizacao);
          this.getLocationUsers(
            120000,
            this.raioDoUsuario,
            this.arraydelocalizacao
          );
        })
        .catch((err) => {
          this.userService
            .getLocalization(this.chave)
            .forEach((e) => {
              this.getLocationUsers(120000, this.raioDoUsuario, e.l);
            })
            .catch((errr) => {
              let alert = this.alertCtrl.create({
                title: "Sua localização não foi detectada",
                enableBackdropDismiss: false,
                message:
                  "Por favor realize o login novamente e ligue o GPS do seu dispositivo",
                buttons: [
                  {
                    text: "OK",
                    handler: () => {
                      this.onLogout();
                    },
                  },
                ],
              });
              alert.present();
            });
        });
    });
  }
  geolocaliza() {
    this.referencia = this.spottedService.metodoretornareferencia().$ref;
    this.geoFire = new Geofire(this.referencia);
    this.platform.ready().then(() => {
      const options: GeolocationOptions = {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      };
      this.geolocation
        .getCurrentPosition(options)
        .then((resp) => {
          this.lat = resp.coords.latitude;
          this.long = resp.coords.longitude;
          this.arraydelocalizacao = [this.lat, this.long];
          if (
            this.arraydelocalizacao === undefined ||
            this.arraydelocalizacao === null
          ) {
            this.userService.getLocalization(this.chave).forEach((e) => {
              this.arraydelocalizacao = e.l;
            });
          }
          //  console.log("array dentro do metodo getCurrentPosition" , this.arraydelocalizacao);
          this.geoFire.set(this.chave, this.arraydelocalizacao);
          this.getLocationUsers(
            120000,
            this.raioDoUsuario,
            this.arraydelocalizacao
          );
        })
        .catch((err) => {
          this.userService
            .getLocalization(this.chave)
            .forEach((e) => {
              this.getLocationUsers(120000, this.raioDoUsuario, e.l);
            })
            .catch((errr) => {
              let alert = this.alertCtrl.create({
                title: "Sua localização não foi detectada",
                enableBackdropDismiss: false,
                message: "Clique OK para atualizar",
                buttons: [
                  {
                    text: "OK",
                    handler: () => {
                      //                   this.onLogout();
                      this.geolocaliza2();
                    },
                  },
                ],
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
  Zuck;
  private showLoading(mensagem: string): Loading {
    let loading: Loading = this.loadingCtrl.create({
      content: mensagem,
    });
    loading.present();
    return loading;
  }
  filtraUsuariosSemLocalizacao() {
    this.users.forEach((u) => {
      u.forEach((uu) => {
        this.userService.getLocalization(uu.$key).forEach((e) => {
          if (e.l === undefined) {
            this.users = <FirebaseListObservable<User[]>>this.users.map(
              (users: User[]) => {
                return users.filter((user: User) => {
                  return user.$key !== uu.$key;
                });
              }
            );
            //FILTRAGEM DOS SPOTTED
            this.spotteds = <FirebaseListObservable<Spotted[]>>(
              this.spotteds.map((spotteds: Spotted[]) => {
                return spotteds.filter((spotted: Spotted) => {
                  return spotted.userId !== uu.$key;
                });
              })
            );
          }
        });
      });
    });
  }
}
