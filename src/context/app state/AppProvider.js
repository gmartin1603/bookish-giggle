import React, {createContext, useContext, useReducer} from 'react'

export const AppContext = createContext();

export const AppProvider = ({reducer, initialState, children, dispatch}) => (
    <AppContext.Provider value={useReducer(reducer, initialState, dispatch)}>
        {children}
    </AppContext.Provider>
)

export const useAppState = () => useContext(AppContext)