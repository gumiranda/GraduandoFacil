import { FirebaseAuthState } from "angularfire2";
import { AuthServiceProvider } from "./../providers/auth/auth.service";
import { User } from "./../models/user.model";
import { Component, ViewChild } from "@angular/core";
import { Nav, Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { UserServiceProvider } from "../providers/user/user.service";
import firebase from "firebase";
import { ChatPage } from "../pages/chat/chat";
import { SpottedDetalhesPage } from "../pages/spotted-detalhes/spotted-detalhes";

@Component({
  templateUrl: "app.html",
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  currentUser: User;
  rootPage: any = "welcome";

  pages: Array<{ title: string; component: any }>;

  constructor(
    authService: AuthServiceProvider,
    userService: UserServiceProvider,
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen
  ) {
    authService.auth.subscribe((authState: FirebaseAuthState) => {
      if (authState) {
        userService.currentUser.subscribe((user: User) => {
          this.currentUser = user;
        });
      }
    });
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      handleBranch();
    });
    platform.resume.subscribe(() => {
      handleBranch();
    });
    const handleBranch = () => {
      // only on devices
      if (!platform.is("cordova")) {
        return;
      }
      const Branch = window["Branch"];
      Branch.initSession().then((data) => {
        if (data["+clicked_branch_link"]) {
          // read deep link data on click
          alert("Deep Link Data: " + JSON.stringify(data));
        }
      });
    };
    // used for an example of ngFor and navigation
    this.pages = [{ title: "Home", component: "HomePage" }];
  }

  initializeApp() {}

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
