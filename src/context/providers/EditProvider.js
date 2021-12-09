import React, {createContext, useContext, useReducer} from 'react'

export const EditContext = createContext();

export const EditProvider = ({reducer, initialState, children, dispatch}) => (
    <EditContext.Provider value={useReducer(reducer, initialState, dispatch)}>
        {children}
    </EditContext.Provider>
)

export const useEditValue = () => useContext(EditContext)