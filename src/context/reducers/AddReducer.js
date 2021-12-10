export const addState = {
    expenses: [

    ],
    labels: [

    ],
}

const addReducer = (state, action) => {
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

export default addReducer