import React, {createContext, useContext, useReducer} from 'react'

export const AddContext = createContext();

export const AddProvider = ({reducer, initialState, children, dispatch}) => (
    <AddContext.Provider value={useReducer(reducer, initialState, dispatch)}>
        {children}
    </AddContext.Provider>
)

export const useAddValue = () => useContext(AddContext)