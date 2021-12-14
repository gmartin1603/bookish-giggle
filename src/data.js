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
    db.collection(coll).get()
    .then((snapshot) => {
        snapshot.forEach((doc) => {
            console.log(doc.id)
                func({
                    type: "ADD-ARR",
                    name: coll,
                    load: doc.data().expenses,
                })
        })
    })
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

export const getReport = (doc, setChemList, setCrop, setFertList, setFuelList, setLandLord,setYear, setSeedList, setTruckingList, setTotal) => {
    db.collection("reports").doc(doc).get()
    .then((snapshot) => {
        let obj = snapshot.data()
        setLandLord(obj.landLord)
        setYear(obj.year)
        setCrop(obj.crop)
        setSeedList(obj.seedList)
        setTruckingList(obj.truckingList)
        setFertList(obj.fertList)
        setChemList(obj.chemList)
        setFuelList(obj.fuelList)
        setTotal(obj.total)
    })
}
