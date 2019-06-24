import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { RestApiProvider } from '../../providers/rest-api/rest-api';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation';

declare var google:any;
/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  apiUrl = 'https://jsonplaceholder.typicode.com';
  itemId = '';
  empId = '';
  empName = '';
  empUsername = '';
  empEmail = '';
  empLat = '';
  empLng = '';
  //employee: any;

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  markers = [];

  constructor(public http: HttpClient, public geolocation: Geolocation, public navCtrl: NavController, private alertCtrl: AlertController, public navParams: NavParams, public restApiProvider: RestApiProvider) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
   
  }

  vEmployee() {
    this.http.get(this.apiUrl + '/users/' + this.itemId)
      .subscribe(
        (res: Response) => {
          const employeeDetail = res;
          console.log(employeeDetail);
          // console.log(employeeDetail[4].address[4]);
          this.empId = (<any>employeeDetail).id;
          this.empName = (<any>employeeDetail).name;
          this.empUsername = (<any>employeeDetail).username;
          this.empEmail = (<any>employeeDetail).email;
          this.empLat = (<any>employeeDetail).address.geo.lat;
          this.empLng = (<any>employeeDetail).address.geo.lng;
          console.log(this.empLat);
          console.log(this.empLng);
          this.loadMap();
        }, err => {
          let alert = this.alertCtrl.create({
            title: 'Error',
            message: 'No Detail found for that ID',
            buttons: ['OK']
          });
          alert.present();
          this.navCtrl.setRoot(this.navCtrl.getActive().component);
        })


  }

  loadMap() {

    var la = parseFloat(this.empLat);
    var lo = parseFloat(this.empLng);

    var point = { lat: la, lng: lo };
    let divMap = (<HTMLInputElement>document.getElementById('map'));
    this.map = new google.maps.Map(divMap, {
      center: point,
      zoom: 15,
      disableDefaultUI: true,
      draggable: true,
      zoomControl: true
    });

    this.createMapMarker(point);

    console.log(point);
  }

  private createMapMarker(place: any): void {
    var marker = new google.maps.Marker({
      map: this.map,
      position: place
    });
    this.markers.push(marker);
  }


  viewEmployee() {
    this.navCtrl.push(HomePage);
  }

}
