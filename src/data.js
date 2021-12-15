import firebase from "firebase"

const firebaseConfig = {
    apiKey: "AIzaSyCelAccvshw9mbBgJ_T55yao6tBuy7zLVo",
    authDomain: "farm-report-86ac2.firebaseapp.com",
    projectId: "farm-report-86ac2",
    storageBucket: "farm-report-86ac2.appspot.com",
    messagingSenderId: "1035453646204",
    appId: "1:1035453646204:web:0afc537ef2d4c3e36410f9",
    measurementId: "G-2MB2WPLY00"
  };

firebase.initializeApp(firebaseConfig)

export const db = firebase.firestore();
export const auth = firebase.auth();

export const getData = (coll, func) => {
    let arr = []
    db.collection(coll).get()
    .then((snapshot) => {
        snapshot.forEach((doc) => {
            // console.log(doc.data())
            arr.push(doc.data())
            return (
                func({
                    type: "ADD-ARR",
                    name: coll,
                    load: arr,
                })
            )
        })
    })
}

export const buildDoc = (coll, doc, label, options ) => {
    db.collection(coll).doc(doc).set({
        id: doc,
        label: label,
        options: options          
    }, {merge: true})
}

export const writeData = (coll, doc, key, load) => {
    
        db.collection(coll).doc(doc).set({
            [key]: load            
        }, {merge: true})
    
}

export const writeReport = (report) => {
    db.collection("reports").doc(`${report.landLord} ${report.crop} ${report.year}`).set(report)
    .then(() => {
        alert("Report saved to database")
    })
}

export const getReports = (dispatch) => {
    let arr = []
    db.collection("reports").get().then((snapshot) => {
        snapshot.forEach((doc) => {
            // console.log(doc.data())
            arr.push(doc.data())
            return (
                dispatch({
                    type: "ADD-ARR",
                    name: "reports",
                    load: arr,
                })
            )
        })
    })
}
