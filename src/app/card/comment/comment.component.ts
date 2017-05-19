import { Component, OnInit, Input } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
    selector: 'comment',
    templateUrl: './comment.component.html'
})
export class CommentComponent implements OnInit {
    @Input() feed
    last_comment
    FEED_COMMENTS = []

    constructor(private afdb: AngularFireDatabase) { }

    ngOnInit() { }

    comments() {
        this.afdb.list('FEED_COMMENTS/' + this.feed.$key, {
            query: {
                orderByKey: true,
                startAt: this.last_comment,
                limitToFirst: 3
            }
        })
        .subscribe(comments => {

            comments.forEach(comment => {
                const updated = this.updateCommentByKey(comment)

                if (updated) {
                    console.log('comment updated:', updated)
                } else {
                    this.FEED_COMMENTS.push(comment)
                    console.log('comment pushed:', updated)
                }
            })

            this.last_comment = this.FEED_COMMENTS[this.FEED_COMMENTS.length-1].$key
            console.log('comment detail:', this.FEED_COMMENTS, 'last comment:', this.last_comment)
        })
    }

    updateCommentByKey(comment) {
        let commentFound = null

        for (let i = 0; i < this.FEED_COMMENTS.length; i++) {
            const currentComment = this.FEED_COMMENTS[i]

            if (currentComment.$key === comment.$key) {
                this.FEED_COMMENTS[i] = comment
                commentFound = currentComment
                break
            }
        }

        return commentFound
    }

}
