import { Component } from '@angular/core';
import { /*FirebaseListObservable,*/ AngularFireDatabase } from 'angularfire2/database';
import { FirebaseListFactoryOpts } from 'angularfire2/interfaces';
// import { Operator } from 'rxjs/Operator';
// import { Observable } from 'rxjs/Observable';
import 'rxjs/observable/fromPromise';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase';

interface IProfile {
    comments?: Array<Object>
    key?:      string
    like:      string
    name:      string
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {
    FEED_LIST_LAST_KEY
    profiles
    // FEED_LIST
    FEED_DETAIL = {}
    startAt = '-KbH04Wc9fvC3Bhwd0DY'
    last
    last_feed
    last_comment = {}
    FEED_LIST_PAGE = 0
    KEYS
    FEED_KEYS
    page = 0
    feed_detail_keys = []
    feed_comments_keys = []
    FEED_COMMENTS = {}
    queryOptions: FirebaseListFactoryOpts = {
        query: {
            orderByKey: true,
            startAt: this.startAt,
            limitToFirst: 5
        }
    }

    nextFeed() {
        this.startAt =  this.last
        this.queryOptions.query.startAt = this.startAt
        this.FEED_LIST_PAGE++
        // console.log(this.startAt)
        this.fetchFeeds()
    }

    createFeed() {
        const keyCreated = this.afdb.list('FEED_DETAIL').push({NAME: 'Anita', AGE: 20, TEXT: 'hello', IMG: 'assets/images/space6.jpg'}).key
        this.afdb.object('FEED_LIST/' + keyCreated).set(1)
        this.afdb.list('FEED_COMMENTS/' + keyCreated).push({text: 'Comment 1'})
        // this.afdb.database.list('FEED_LIKES/' + keyCreated).push({likes: 1})
    }

    // deleteFeed(feed) {
    //     // this.afdb.object('FEED_DETAIL/' + key).remove()
    //     this.FEED_LIST[feed].remove()
    //     this.FEED_DETAIL[feed.$key].remove()
    // }

    fetchFeed() {
        // this.FEED_LIST.subscribe((snap) => {
        //     snap.forEach(feed => {
        //         this.FEED_DETAIL[feed.$key] = this.afdb.object('FEED_DETAIL/' + feed.$key)
        //     })
        //     console.log(this.FEED_DETAIL)
        // })
    }

    /*roughSizeOfObject(object) {
        const objectList = [];
        const stack = [object];
        let bytes = 0;

        while (stack.length) {
            const value = stack.pop();

            if      (typeof value === 'boolean') bytes += 4
            else if (typeof value === 'string') bytes += value.length
            else if (typeof value === 'number') bytes += 1
            else if (typeof value === 'object' && objectList.indexOf(value) === -1) {
                objectList.push(value)
                for (const i in value) stack.push(value[i])
            }
        }

        return bytes;
    }*/

    getFeedsByKey() {

        for (let i = 0; i < 2; i++) {
            const key = this.KEYS.shift()
            firebase.database().ref('FEED_DETAIL/' + key).on('value', snap => this.FEED_DETAIL[snap.key] = snap.val())
            console.log('Key Shifted:', key, 'Keys Remained:', this.KEYS)
        }

        // for (var key in this.KEYS) {
        //     firebase.database().ref('FEED_DETAIL/'+this.KEYS[key]).on('value', snap => this.FEED_DETAIL[snap.key] = snap.val())
        // }

        // this.KEYS.forEach(key => {
        //     firebase.database().ref('FEED_DETAIL/'+key).on('value', snap => this.FEED_DETAIL[snap.key] = snap.val())
        // })
    }

    getFeedsKeys(limit) {
        firebase.database().ref('FEED_LIST').limitToFirst(limit).once('value')
            .then(snap => {
                this.FEED_DETAIL = snap.val()
                this.KEYS = Object.keys(this.FEED_DETAIL)
                this.FEED_KEYS = Object.keys(this.FEED_DETAIL)
            })
    }

    fetchFeeds() {

        // this.getFeedsKeys(1000)

        // setTimeout(() => {
        //     this.getFeedsByKey()
        // }, 3000)

        // setTimeout(() => {
        //     this.getFeedsByKey()
        // }, 5000)

        // setTimeout(() => {
        //     this.getFeedsByKey()
        // }, 7000)

        // setTimeout(() => {
        //     this.getFeedsByKey()
        // }, 8000)




        // Observable.fromPromise(this.FEED_LIST)
        //     .map((snap) => {
        //         this.FEED_LIST = snap

        //     })
        //     .subscribe((val) => console.log(val))

        // let data = {
        //     "-KaywgmBRi9gXBb7zqmK": {
        //         "AGE": 23,
        //         "NAME": "Anita 3"
        //     }
        // }


        // this.fetchFeed()

        // setTimeout(() => {
        //     this.FEED_LIST.forEach(feed => {
        //         console.log(feed.$key)
        //     })


        //     // this.FEED_LIST.forEach(feed => {
        //     //     if (!this.FEED_DETAIL[feed.$key]) {
        //     //         this.afdb.object('FEED_DETAIL/' + feed.$key).subscribe(data => {
        //     //             this.FEED_DETAIL[feed.$key] = data
        //     //             // console.log('FEED_DETAIL:', data)
        //     //         })
        //     //     }
        //     // })
        // }, 2000)

        // this.afdb.database.list('FEED_LIST', {
        //     query: {
        //         orderByKey: true,
        //         startAt: this.last,
        //         limitToFirst: 5
        //     }
        // })
        // .subscribe(list => {
        //         this.FEED_LIST = list
        //         let len = this.FEED_LIST.length
        //         this.last = this.FEED_LIST[len-1].$key

        //         console.log(this.last)
        // })

        // this.afdb.database.list('FEED_DETAIL')
        //     .subscribe(feeds => {
        //         feeds.map(feed => {
        //             console.log(feed.$key)
        //         })
        //     })


        // .subscribe(data => {
        //     this.FEED_DETAIL[feed.$key] = data
        //     // console.log('FEED_DETAIL:', data)
        // })

    }

    // nextPage() {

    //     // this.afdb.database.list('FEED_LIST', {
    //     //     query: {
    //     //         orderByKey: true,
    //     //         startAt: this.last,
    //     //         limitToFirst: 5
    //     //     }
    //     // })
    //     // .subscribe(list => {
    //     //     this.FEED_LIST[this.page] = list
    //     // })

    //     // this.page += 1
    //     // this.last = '-KbH1PQMV4vgYzgBhk3v'


    //     this.afdb.database.list('FEED_LIST')
    //     .subscribe(list => {

    //         // list.forEach(item => {

    //         //     this.FEED_LIST.forEach(l => {
    //         //         if (l.$key != item.$key) {

    //         //         }
    //         //     })

    //         // })

    //         list.forEach(item => {

    //             this.FEED_LIST[item.$key] = item


    //             // if (this.feed_list_keys.indexOf(item.$key) == -1) {
    //             //     this.feed_list_keys.push(item.$key)
    //             //     this.FEED_LIST.push(item)
    //             // } else {
    //             //     let index = this.feed_list_keys.indexOf(item.$key)

    //             //     // this.feed_list_keys[index] = item.$key
    //             //     this.FEED_LIST[index] = item
    //             //     console.log(index, this.FEED_LIST)
    //             // }
    //         })

    //         this.feed_list_keys = Object.keys(this.FEED_LIST)
    //         console.log('Deleted:', this.FEED_LIST)

    //         // let len = this.FEED_LIST.length
    //         // this.last = this.FEED_LIST[len-1].$key
    //     })
    // }

    nextPage() {
        this.afdb.list('FEED_DETAIL', {
            query: {
                orderByKey: true,
                startAt: this.last,
                limitToFirst: 5
            }
        })
        .subscribe(list => {

            if (this.last_feed[0].$key !== this.last) {
                list.forEach(item => {
                    this.FEED_DETAIL[item.$key] = item

                    this.afdb.list('FEED_LIKES/' + item.$key)
                    .subscribe(feeds => {
                        if (this.FEED_DETAIL[item.$key]) {
                            this.FEED_DETAIL[item.$key]['likes'] = feeds.length
                            console.log('if', feeds)
                        } else {
                            console.log('else:', feeds)
                        }
                    })
                })
                this.feed_detail_keys = Object.keys(this.FEED_DETAIL)

                const len = this.feed_detail_keys.length
                const key = this.feed_detail_keys[len - 1]
                this.last = this.FEED_DETAIL[key].$key
            }
        })
    }

    comments(key) {
        this.afdb.list('FEED_COMMENTS/' + key, {
            query: {
                orderByKey: true,
                startAt: this.last_comment[key],
                limitToFirst: 3
            }
        })
        .subscribe(list => {
            if (! this.FEED_COMMENTS[key]) {
                this.FEED_COMMENTS[key] = {}
            }

            list.forEach(item => this.FEED_COMMENTS[key][item.$key] = item)
            this.feed_comments_keys[key] = Object.keys(this.FEED_COMMENTS[key])
            console.log(this.FEED_COMMENTS)

            const len = this.feed_comments_keys[key].length
            const comment_key = this.feed_comments_keys[key][len - 1]
            this.last_comment[key] = this.FEED_COMMENTS[key][comment_key].$key
        })
    }

    createComment(key) {
        this.afdb.list('FEED_COMMENTS/' + key).push({text: 'Comment 1'})
    }

    deleteComment(key, comment_key) {
        this.afdb.object('FEED_COMMENTS/' + key + '/' + comment_key).remove()
        delete this.FEED_COMMENTS[key][comment_key]
    }

    likeFeed(feed_key) {
        const user1 = 'Roma'
        this.afdb.object('FEED_LIKES/' + feed_key + '/' + user1).set(1)
    }

    test(key) {

        const test = {
            'comments': {
                'feedd_key_1': {}
            }
        }

        const item = {
            $key: 'comment_key_1',
            text: 'hello'
        }

        test['comments'][key][item.$key] = item
        console.log(test)
    }

    deleteFeed(feed_key) {
        this.afdb.object('FEED_DETAIL/' + feed_key).remove()
        this.afdb.object('FEED_LIST/' + feed_key).remove()

        delete this.FEED_DETAIL[feed_key]

        this.afdb.object('FEED_COMMENTS/' + feed_key).remove()
        delete this.FEED_COMMENTS[feed_key]

        this.afdb.object('FEED_LIKES/' + feed_key).remove()
        delete this.FEED_DETAIL[feed_key]


        // let index = this.feed_list_keys.indexOf(feed_key)
        // this.feed_list_keys.splice(index)

        // this.FEED_LIST[feed].remove()
        // this.FEED_DETAIL[feed.$key].remove()
    }

    constructor(private afdb: AngularFireDatabase) {
        // this.fetchFeeds()

        this.afdb.list('FEED_DETAIL', {query: {limitToLast: 1}})
        .subscribe(list => {
            if (list.length > 0) {
                this.last_feed = list
                console.log(this.last_feed)
            }

            // list.forEach(item => {
            //     this.FEED_DETAIL[item.$key] = item

            //     this.afdb.database.list('FEED_LIKES/' + item.$key)
            //     .subscribe(list => {
            //         if (this.FEED_DETAIL[item.$key]) {
            //             this.FEED_DETAIL[item.$key]['likes'] = list.length
            //             console.log('if', list)
            //         }
            //         else {
            //             console.log('else:', list)
            //         }
            //     })
            // })
            // this.feed_detail_keys = Object.keys(this.FEED_DETAIL)

            // let len = this.feed_detail_keys.length
            // let key = this.feed_detail_keys[len-1]
            // this.last = this.FEED_DETAIL[key].$key
        })
    }
}
