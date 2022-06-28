import {Component, OnInit} from '@angular/core';
import firebase from "firebase/compat";
import initializeApp = firebase.initializeApp;
import {environment} from "../environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'BankdataLinks';

  ngOnInit(): void {
    // Initialize Firebase
    const app = initializeApp(environment.firebaseConfig);
  }
}
