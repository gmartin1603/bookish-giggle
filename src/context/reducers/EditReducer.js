export const editState = {
    reports: [
        // {id: "landLord", label: "Land Lord", options: ['A', 'B', 'C']},
        // {id: "crop", label: "Crop", options: ['Corn', 'Beans']},
        // {id: "year", label: "Year", options: ['2019', '2020']},
    ],

    optionList: [
        
    ],

    expenses: [
        // {label: "Seed", id: "seedList", options: ["pioneer"], units: ["Bag"]},
        // {label: "Chemical", id: "chemList", options: ["roundup"], units: ["Lb", "Gal"]},
        // {label: "Fertilizer", id: "fertList", options: ["Manure", "0-0-50"], units: ["LB", "Gal", "Ton"]},
        // {label: "Fuel", id: "fuelList", options: ["Diesel"], units: ["Gal"]},
        // {label: "Trucking", id: "truckingList", options: ["Corn", "Soy Beans"], units: ["Bu"]},
        // {label: "Crop Insurance", id: "insList", options: ["Corn", "Soy Beans"], units: ["Acre"]},
    ],
    landLord: "",
    crop: "",
    year: "",
    seedList: [],
    chemList: [],
    fertList: [],
    truckingList: [],
    fuelList: [],
    insList: [],
    misc: [],
} 

const editReducer = (state, action) => {
    // console.log(action, state)
    // console.log(action)
    switch(action.type) {

        case "ADD-STRING":
            // console.log(action)
            return (
                {
                    ...state,
                    [action.name]: action.load
                }
            )
        case "ADD-OBJ":
            // console.log(action)
            let arr = state[action.name]
            arr.push(action.load)
            return (
                {
                    ...state,
                    [action.name]: arr 
                }
            )
        case "ADD-ARR":
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

export default editReducer