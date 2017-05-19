import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http'
// import { MaterialModule } from '@angular/material';
// import { AngularFireModule, FirebaseAppConfig } from 'angularfire2';
// import 'hammerjs'

import { AppComponent } from './app.component';
// import { CardComponent } from './card/card.component';
import { LikeComponent } from './card/like/like.component';
import { Comment3Component } from './card/comment/comment3.component';
import { AddCommentComponent } from './card/add-comment/add-comment.component';
import { CardImageComponent } from './card/card-image/card-image.component';
import { HeaderComponent } from './card/header/header.component';
import { Card3Component } from './card/card3.component';
import { TestFeed } from './card/test-feed/test-feed';


// var config: FirebaseAppConfig = {
//     apiKey: "AIzaSyDkY7F3UkXivDJEwoR7CYuGcYwTHf8PkOs",
//     authDomain: "ngfire1-92729.firebaseapp.com",
//     databaseURL: "https://ngfire1-92729.firebaseio.com",
//     storageBucket: "ngfire1-92729.appspot.com",
//     messagingSenderId: "455211361884"
// }

@NgModule({
    declarations: [
        AppComponent,
        // CardComponent,
        LikeComponent,
        Comment3Component,
        AddCommentComponent,
        CardImageComponent,
        HeaderComponent,
        Card3Component,
        TestFeed
    ],
    imports: [
        FormsModule,
        HttpModule,
        BrowserModule,
        // AngularFireModule.initializeApp(config),
        // MaterialModule.forRoot()
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
