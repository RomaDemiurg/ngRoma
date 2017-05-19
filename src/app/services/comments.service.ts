/**
 * PostComments
 */
class PostComments {
    first: Object
    last: Object
    next_: number[]
    page_size: number
    profileCommentsRef: any
    // profileRef: firebase.database().ref("profile").orderByKey()
    // profileCommentsRef: firebase.database().ref("profile_comments")

    constructor(postId: string, limit: number) { }

    getCommentsForPostFirstLast(postId) {
        // markerCommentsForPostFirstLast[postId] = true
    }

    fetchFirst(postId: string) {
        this.profileCommentsRef.child(postId).limitToFirst(1).on('value', s => {
            this.first[postId] = s.val()
            this.next_[postId] = s.key
        })
    }

    fetchLast(postId: string) {
        this.profileCommentsRef.child(postId).limitToLast(1).on('value', snap => {
            this.last[postId] = snap.val()
        })
    }

    nextPage() {

    }
}
