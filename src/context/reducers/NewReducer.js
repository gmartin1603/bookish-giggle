export const newState = {
    labels: [
        {id: "landLord", label: "Land Lord", options: ['A', 'B', 'C']},
        {id: "crop", label: "Crop", options: ['Corn', 'Beans']},
        {id: "year", label: "Year", options: ['2019', '2020']},
    ],

    optionList: [
        
    ],

    expenses: [
        {label: "Seed", id: "seedList", options: ["pioneer"]},
        {label: "Chemical", id: "chemList", options: ["roundup"]},
        {label: "Fertilizer", id: "fertList", options: ["Manure", "0-0-50"]},
        {label: "Fuel", id: "fuelList", options: ["Diesel"]},
        {label: "Trucking", id: "truckingList", options: ["Trucking"]},
    ],
    landLord: "",
    crop: "",
    year: "",
    seedList: [],
    chemList: [],
    fertList: [],
    truckingList: [],
    fuelList: [],
}

export const textObj = {
    landLord: newState.landLord,
    year: newState.year,
    crop: newState.crop,
    seedList: newState.seedList,
    chemList: newState.chemList,
    fertList: newState.fertList,
    fuelList: newState.fuelList,
    truckingList: newState.truckingList,
} 

const newReducer = (state, action) => {
    // console.log(action, state)
    // console.log(action)
    switch(action.type) {

        case "ADD-STRING":
            console.log(action)
            return (
                {
                    ...state,
                    [action.name]: action.load
                }
            )
        case "ADD-OBJ":
            console.log(action)
            let arr = newState[action.name]
            arr.push(action.load)
            return (
                {
                    ...state,
                    [action.name]: arr 
                }
            )
        case "TOGGLE-CHECK":
            return (
                {
                    ...state,
                    [action.name]: action.checked,
                }
            )
        case "UPDATE":
            return (
                {
                    ...state,
                    [action.name]: action.load,
                }
            )
        
        case "RESET":
            return (
                action.load
            )
        default: 
            console.log("No Form State Change")
            return state;
    }
    
}

export default newReducer