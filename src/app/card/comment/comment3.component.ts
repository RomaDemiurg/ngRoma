import { Component, Input } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
    selector: 'app-comment',
    templateUrl: './comment.component.html'
})
export class Comment3Component {
    @Input() feed
    last_comment
    comments
    commentsRef: firebase.database.Reference = firebase.database().ref('comments')
    startAtCommentKey
    start
    end

    constructor(private afdb: AngularFireDatabase) { }




    private getComments() {
        this.afdb.list('comments/' + this.feed.$key, {query: {orderByKey: true, startAt: this.last_comment, limitToFirst: 3}})
        .subscribe(comments => {
            comments.forEach(comment => {
                let commentFound = null

                for (let i = 0; i < this.comments.length; i++) {
                    const currentComment = this.comments[i]

                    if (currentComment.$key === comment.$key) {
                        this.comments[i] = comment
                        commentFound = currentComment
                        break
                    }
                }

                if (!commentFound) {
                    this.comments.push(comment)
                }

            })

            this.last_comment = this.comments[this.comments.length - 1].$key
        })
    }

    private getComments2() {
        this.commentsRef.child(this.feed.key).orderByKey().startAt(this.startAtCommentKey).limitToFirst(5).once('value', (snap) => {
            if (snap.exists()) {
                const comments = snap.val()
                const commentsKeys = Object.keys(comments).sort()
                this.startAtCommentKey = commentsKeys[commentsKeys.length - 1]

                commentsKeys.forEach(commentKey => {
                    const likes = comments[commentKey].likes
                    const text = comments[commentKey].text

                    this.comments.push({ commentKey, likes, text })
                })

                console.log('getComments2()', this.comments)
            }
        })
    }






    private getFeedsComments() {
        const id = '1'

        this.comments[id] = this.afdb.list('comments/' + this.feed.$key, {
            query: {
                orderByKey: true,
                startAt: this.start,
                endAt: this.end
            }
        })

    }




}
