import React, {createContext, useContext, useReducer} from 'react'

export const NewContext = createContext();

export const NewProvider = ({reducer, initialState, children, dispatch}) => (
    <NewContext.Provider value={useReducer(reducer, initialState, dispatch)}>
        {children}
    </NewContext.Provider>
)

export const useNewValue = () => useContext(NewContext)