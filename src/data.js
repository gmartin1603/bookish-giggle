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
        snapshot.forEach((docs) => {
            switch (coll) {
                case "labels":
                    func({
                        type: "ADD-ARR",
                        name: 'labels',
                        load: docs.data().expenses,
                    })
                    break
                case "expenses":
                    func({
                        type: "ADD-ARR",
                        name: 'expenses',
                        load: docs.data().expenses,
                    })
                    break
                default:
                    return
            }
        })
    })
}

export const writeData = (coll, exp, expenses) => {
    
    if (coll === 'expenses') {
        if (exp) {
            let array = expenses
            array.push(exp)
        }
        db.collection(coll).doc('8CJ5sBDg05YAVjow0HUW').set({
            expenses
            
        })
    } else {
        db.collection(coll).doc('4awrazQ0r23HC8hoEUfO').set({
            expenses
            
        })
    }
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
