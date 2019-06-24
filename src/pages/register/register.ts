import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, MenuController, ToastController, LoadingController } from 'ionic-angular';
import { ManagePage } from '../manage/manage';
import { LoginPage } from '../login/login';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {


  name: string;
  password: string;


  constructor(public navCtrl: NavController, private sqlite: SQLite, public menu: MenuController, public navParams: NavParams, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public toast: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  ionViewDidEnter() {
    this.menu.swipeEnable(false);
  }

  ionViewWillLeave() {
    this.menu.swipeEnable(true);
  }

  register() {

    if (this.name == "") {

      let alert = this.alertCtrl.create({

        title: "ATTENTION",
        subTitle: "Name field is empty",
        buttons: ['OK']
      });
      alert.present();
    } else

      if (this.password == "") {

        let alert = this.alertCtrl.create({

          title: "ATTENTION",
          subTitle: "Password field is empty",
          buttons: ['OK']
        });
        alert.present();

      } else {

        let data = {
          id: this.name,
          password: this.password
        };

        let loader = this.loadingCtrl.create({
          content: 'Processing please wait...',
        });

        loader.present().then(() => {

          this.sqlite.create({
            name: 'ionicdb.db',
            location: 'default'
          }).then((db: SQLiteObject) => {
            db.executeSql('CREATE TABLE IF NOT EXISTS user(username VARCHAR(255), password VARCHAR(255))', [])
              .then(res => console.log('Executed SQL'))
              .catch(e => console.log(e));
            db.executeSql('INSERT INTO user VALUES(?,?)', [this.name, this.password])
              .then(res => {
                loader.dismiss();
                let alert = this.alertCtrl.create({
                  title: '',
                  subTitle: 'Succesfully Register',
                  buttons: ['OK']
                });
                alert.present();
                this.navCtrl.setRoot(LoginPage);

              })
              .catch(e => {
                loader.dismiss();
                const toast = this.toast.create({
                  message: 'Fail',
                  duration: 3000,
                  position: 'bottom'
                });

                toast.onDidDismiss(() => {
                  console.log('Dismissed toast');
                });

                toast.present();
              });

          }).catch(e => console.log(e));


        });
      }

  }

  login() {
    this.navCtrl.setRoot(LoginPage);
  }


}
