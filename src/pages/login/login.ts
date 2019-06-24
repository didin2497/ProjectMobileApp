import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, MenuController, ToastController, LoadingController } from 'ionic-angular';
import { ManagePage } from '../manage/manage';
import { RegisterPage } from '../register/register';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {


  name: string;
  password: string;


  constructor(public navCtrl: NavController, private sqlite: SQLite, public menu: MenuController, public navParams: NavParams, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public toast: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  ionViewDidEnter() {
    this.menu.swipeEnable(false);
  }

  ionViewWillLeave() {
    this.menu.swipeEnable(true);
  }

  login() {

    if (this.name == "") {

      let alert = this.alertCtrl.create({

        title: "ATTENTION",
        subTitle: "Staff ID field is empty",
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
            db.executeSql('SELECT * FROM user WHERE username=? AND password=?', [this.name, this.password])
              .then(res => {
                loader.dismiss();
                if (res.rows.length > 0) {
                  let alert = this.alertCtrl.create({
                    title: '',
                    subTitle: 'Succesfully Login',
                    buttons: ['OK']
                  });
                  alert.present();
                  this.navCtrl.setRoot(ManagePage);

                } else {

                  let alert = this.alertCtrl.create({
                    title: 'Alert!',
                    subTitle: 'Please try again.',
                    buttons: ['OK']
                  });
                  alert.present();
                  this.navCtrl.setRoot(this.navCtrl.getActive().component);
                }

              })
              .catch(e => console.log(e));


          }).catch(e => console.log(e));


        });
      }

  }

  signUp() {
    this.navCtrl.setRoot(RegisterPage);
  }


}
