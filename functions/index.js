const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();

const cors = require("cors")({
  origin: true,
});

async function deleteRoom(cryptedKey) {
  const querySnapshot = admin.firestore().collection("rooms").doc(cryptedKey);
  await admin.firestore().recursiveDelete(querySnapshot);
}

const deleteAllFiles = async (id) => {
  await admin
    .storage()
    .bucket("rooms-saklani-dev.appspot.com")
    .deleteFiles({
      prefix: `${id}/`,
    });
};

exports.deleteData = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const querySnapshot = await admin.firestore().collection("rooms").get();

    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ _id: doc.id, ...doc.data() });
    });

    documents.forEach(async (e) => {
      const dateBefore15Min = new Date().getTime() - 15 * 60000;
      const docDate = e.timestamp;

      if (docDate < dateBefore15Min) {
        await deleteRoom(e._id);
        await deleteAllFiles(e._id);
      }
    });

    res.send("Done");
  });
});
