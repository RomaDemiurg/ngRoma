const firebaseFunctions = require('firebase-functions');
const Datastore = require('@google-cloud/datastore');
const admin = require("firebase-admin");
const cors = require('cors')({ origin: true });

const serviceAccount = require("./ngfire1-92729-firebase-adminsdk-avii5-89c984d0fe.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ngfire1-92729.firebaseio.com"
});


// Instantiates a client
const datastore = Datastore();


exports.createUser = firebaseFunctions.https.onRequest((req, res) => {
    cors(req, res, () => {
        // admin.database.Reference.child()
        // admin.auth.Auth.createUser({}).then((res) => {})
        // email-already-exists

        let email =         req.body.email
        let emailVerified = false
        let password =      req.body.password
        let displayName =   req.body.displayName
        let photoURL =      "http://www.example.com/12345678/photo.png"
        let disabled =      false

        let user = admin.auth().createUser({
            email:          email,
            emailVerified:  emailVerified,
            password:       password,
            displayName:    displayName,
            photoURL:       photoURL,
            disabled:       disabled
        })

        user.then(function(userRecord) {
                console.log("Successfully created new user:", userRecord.uid)
                res.status(200).send(`User '${userRecord.displayName}' created.`)
            })
            .catch(function(err) {
                console.log("Error creating new user:", err.message)
                // let error = res.status(500)
                // error.statusText = "error in UserCreation"
                res.send(500, `Error in createUser() - ${err}`)
            })



        /*const key = datastore.key([req.body.kind, req.body.key]);
        // const key = datastore.key(req.body.kind);
        const entity = {
            key: key,
            data: req.body.value
        };

        return datastore.save(entity)
            .then(() => res.status(200).send(`Entity ${key.path.join('/')} saved.`))
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error in createFeed()', err);
                return Promise.reject(err);
            });*/
    });
});

exports.createFeed = firebaseFunctions.https.onRequest((req, res) => {
    cors(req, res, () => {
        if (!req.body.value) { throw new Error('Value not provided. Make sure you have a "value" property in your request'); }
        if (!req.body.key) { throw new Error('Key not provided. Make sure you have a "key" property in your request'); }
        if (!req.body.kind) { throw new Error('Kind not provided. Make sure you have a "kind" property in your request'); }

        const key = datastore.key([req.body.kind, req.body.key]);
        // const key = datastore.key(req.body.kind);
        const entity = {
            key: key,
            data: req.body.value
        };

        return datastore.save(entity)
            .then(() => res.status(200).send(`Entity ${key.path.join('/')} saved.`))
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error in createFeed()', err);
                return Promise.reject(err);
            });
    });
});

exports.helloWorld = firebaseFunctions.https.onRequest((req, res) => {
    res.send("Hello from Me");
    console.log("helloWorld function triggered.");
});

/**
 * Gets a Datastore key from the kind/key pair in the request.
 *
 * @param {object} requestData Cloud Function request data.
 * @param {string} requestData.key Datastore key string.
 * @param {string} requestData.kind Datastore kind.
 * @returns {object} Datastore key object.
 */
function getKeyFromRequestData(requestData) {
    if (!requestData.key) {
        throw new Error('Key not provided. Make sure you have a "key" property in your request');
    }

    if (!requestData.kind) {
        throw new Error('Kind not provided. Make sure you have a "kind" property in your request');
    }

    return datastore.key([requestData.kind, requestData.key]);
}

/**
 * Creates and/or updates a record.
 *
 * @example
 * gcloud alpha functions call set --data '{"kind":"Task","key":"sampletask1","value":{"description": "Buy milk"}}'
 *
 * @param {object} req Cloud Function request context.
 * @param {object} req.body The request body.
 * @param {string} req.body.kind The Datastore kind of the data to save, e.g. "Task".
 * @param {string} req.body.key Key at which to save the data, e.g. "sampletask1".
 * @param {object} req.body.value Value to save to Cloud Datastore, e.g. {"description":"Buy milk"}
 * @param {object} res Cloud Function response context.
 */
exports.set = firebaseFunctions.https.onRequest((req, res) => {
    // The value contains a JSON document representing the entity we want to save
    if (!req.body.value) {
        throw new Error('Value not provided. Make sure you have a "value" property in your request');
    }

    const key = getKeyFromRequestData(req.body);
    const entity = {
        key: key,
        data: req.body.value
    };

    return datastore.save(entity)
        .then(() => res.status(200).send(`Entity ${key.path.join('/')} saved.`))
        .catch((err) => {
            console.error(err);
            res.status(500).send(err);
            return Promise.reject(err);
        });
});

/**
 * Retrieves a record.
 *
 * @example
 * gcloud alpha functions call get --data '{"kind":"Task","key":"sampletask1"}'
 *
 * @param {object} req Cloud Function request context.
 * @param {object} req.body The request body.
 * @param {string} req.body.kind The Datastore kind of the data to retrieve, e.g. "Task".
 * @param {string} req.body.key Key at which to retrieve the data, e.g. "sampletask1".
 * @param {object} res Cloud Function response context.
 */
exports.get = firebaseFunctions.https.onRequest((req, res) => {
    const key = getKeyFromRequestData(req.body);

    return datastore.get(key)
        .then(([entity]) => {
            // The get operation will not fail for a non-existent entity, it just returns null.
            if (!entity) {
                throw new Error(`No entity found for key ${key.path.join('/')}.`);
            }

            res.status(200).send(entity);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send(err);
            return Promise.reject(err);
        });
});

/**
 * Deletes a record.
 *
 * @example
 * gcloud alpha functions call del --data '{"kind":"Task","key":"sampletask1"}'
 *
 * @param {object} req Cloud Function request context.
 * @param {object} req.body The request body.
 * @param {string} req.body.kind The Datastore kind of the data to delete, e.g. "Task".
 * @param {string} req.body.key Key at which to delete data, e.g. "sampletask1".
 * @param {object} res Cloud Function response context.
 */
exports.del = firebaseFunctions.https.onRequest((req, res) => {
    const key = getKeyFromRequestData(req.body);

    // Deletes the entity
    return datastore.delete(key)
        .then(() => res.status(200).send(`Entity ${key.path.join('/')} deleted.`))
        .catch((err) => {
            console.error(err);
            res.status(500).send(err);
            return Promise.reject(err);
        });
});










exports.getByDescription = firebaseFunctions.https.onRequest((req, res) => {

    const query = datastore.createQuery('Task').filter('description', '=', req.body.description);

    return datastore.runQuery(query)
        .then((results) => {
            const tasks = results[0]; // Task entities found.

            res.status(200).send(tasks);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send(err);
            return Promise.reject(err);
        });
});


exports.getFeedCommentsByFeedID = firebaseFunctions.https.onRequest((req, res) => {

    const query = datastore.createQuery('FeedComments').filter('feed_id', '=', req.body.feed_id);

    return datastore.runQuery(query)
        .then((results) => {
            const tasks = results[0];

            res.status(200).send(tasks);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send(err);
            return Promise.reject(err);
        });
});


exports.getAllFeeds = firebaseFunctions.https.onRequest((request, response) => {
    cors(request, response, () => {

        const query = datastore.createQuery('Feed');

        return datastore.runQuery(query)
            .then((feeds) => response.status(200).send(feeds[0]))
            .catch((err) => {
                console.error(err);
                response.status(500).send(err);
                return Promise.reject(err);
            });
    });
});


function mergeFeedsWithComments(feeds) {

    let feedComments = [];

    feeds.forEach((feed) => {
        let q = datastore.createQuery('FeedComments').filter('feed_id', '=', feed.id);
        datastore.runQuery(q).then((comments) => {
            let feedCommentsMerged = feed;
            feedCommentsMerged["comments"] = comments[0];
            feedComments.push(feedCommentsMerged);
        });
    });

    return feedComments;
}


exports.getAllFeedsAndRelatedComments = firebaseFunctions.https.onRequest((req, res) => {

    let feedComments = [];

    const query = datastore.createQuery('Feed');
    datastore.runQuery(query).then((result) => {
        let feeds = result[0];

        feedComments = mergeFeedsWithComments(feeds);
    });

    setTimeout(() => {
        res.status(200).send(feedComments)
    }, 1000);

});

exports.getFeeds = firebaseFunctions.https.onRequest((request, response) => {
    cors(request, response, () => {

        // const query = datastore.createQuery('Feeds').order('id').offset(3).limit(3);
        const query = datastore.createQuery('Feeds');

        datastore.runQuery(query).then((feeds) => {
            response.status(200).send(feeds[0])
        })

    });
});




/*

fc = [
  [
    {
      "feed_id": "feed3",
      "user_id": 658,
      "user_avatar_url": "658/01.jpg",
      "text": "Nice is Cute",
      "user_name": "Anna"
    },
    {
      "feed_id": "feed3",
      "user_id": 124,
      "user_avatar_url": "124/01.jpg",
      "text": "Wonderful alse",
      "user_name": "Maxim"
    },
    {
      "user_avatar_url": "524/01.jpg",
      "text": "Wonderful Life",
      "user_name": "Artur",
      "feed_id": "feed3",
      "user_id": 524
    }
  ],
  [
    {
      "media": "feed1/image_01.jpg",
      "id": "feed1",
      "likes": 1,
      "title": "Ferrari"
    }
  ]
]

*/

/*

[
  [
    {
      "text": "She is Cute",
      "user_name": "Vova",
      "feed_id": "feed4",
      "user_id": 233,
      "user_avatar_url": "233/01.jpg"
    },
    {
      "user_id": 624,
      "user_avatar_url": "624/01.jpg",
      "text": "secret Life",
      "user_name": "Veniamin",
      "feed_id": "feed4"
    }
  ],
  {
    "likes": 1,
    "title": "Ferrari",
    "media": "feed1/image_01.jpg",
    "id": "feed1"
  }
]

*/

/*

{
    "likes": 1,
    "title": "Ferrari",
    "media": "feed1/image_01.jpg",
    "id": {
    	[
		    { "feed_id": "feed4",
		      "user_id": 233,
		      "user_avatar_url": "233/01.jpg",
		      "text": "She is Cute",
		      "user_name": "Vova" },

		    { "text": "secret Life",
		      "user_name": "Veniamin",
		      "feed_id": "feed4",
		      "user_id": 624,
		      "user_avatar_url": "624/01.jpg" }
		]
	}
}

*/

/*

exports.getAllFeedsAndRelatedComments = functions.https.onRequest((req, res) => {

	var comments = [];

	for (var i = 2; i >= 0; i--) {

		var queryFeedComments = datastore.createQuery('FeedComments').filter('feed_id', '=', "feed"+i);
		datastore.runQuery(queryFeedComments).then((com) => {
			comments.push(com);
		});

	}

	res.status(200).send(comments);

});

*/
