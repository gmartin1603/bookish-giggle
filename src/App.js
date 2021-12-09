import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import NewReport from "./components/NewReport";
import Header from "./components/Header";
import { useEffect, useState } from "react";
import {getData, writeData, getReports, auth} from './data'
import Text from "./components/Text";
import styled from 'styled-components'
import ReportSelect from "./components/ReportSelect";
import EditReport from "./components/EditReport";
import AddOption from "./components/AddOption";
import Login from "./components/Login";
import { NewProvider } from "./context/providers/NewProvider";
import newReducer, { newState } from "./context/reducers/NewReducer";
import { EditProvider } from "./context/providers/EditProvider";
import editReducer, { editState } from "./context/reducers/EditReducer";


function App() {
  const [labels, setLabels] = useState('')
  const [expenses, setExpenses] = useState('')
  const [newOption, setNewOption] = useState('')
  const [expense, setExpense] = useState('')
  const [newExpense, setNewExpense] = useState('')
  const [newLabel, setNewLabel] = useState('')
  const [label, setLabel] = useState('')
  const [total, setTotal] = useState(0)
  const [reports, setReports] = useState([])
  const [user, setUser] = useState('')

  auth.onAuthStateChanged((user) => {
    user && setUser(user.email)
  })

  // useEffect(() => {
  //   getData('labels', setLabels)
  //   getData('expenses', setExpenses)
  //   getReports(setReports)
  // },[])

  const addOption = (arr, attr, value, additon, func) => {
    let i = arr.length
    while (i--) {
      if(arr[i] 
        && arr[i].hasOwnProperty(attr) 
        && arr[i][attr] === value){ 
         arr[i]["options"].push(additon)
         console.log(arr)
         return (
           func(arr)
         )
       }
    }
  } 

  const addNewLabel = (e) => {
    e.preventDefault()
    addOption(labels, 'label', label, newLabel, setLabels)
    writeData('labels', null, labels)
    document.getElementById('add__new__label').reset()
  } 

  const addNewExpense = (e) => {
    e.preventDefault()
    if (newExpense) {

      let obj = {
        label: newExpense,
        dispatch: 'SET_EXP',
        options: []
      }
      writeData('expenses', obj, expenses)
      document.getElementById('add__new').reset()
    } else {
      addOption(expenses, "label", expense, newOption, setExpenses)
      console.log(expense)
      writeData('expenses', null, expenses)
      document.getElementById('add__new').reset()
    }
  }

 

 

  return (
    <Router>
        {
          user? 
      <Container className="app">
        
        <Header setUser={setUser}/>
          <Switch>
            {/* <Route path="/Add">
              <AddOption/>
            </Route> */}
            <Route path="/View">
              <EditProvider initialState={editState} reducer={editReducer}>
              <EditReport/>
              </EditProvider>
            </Route>
            <Route path="/">
              <NewProvider initialState={newState} reducer={newReducer}>
                <NewReport/> 
              </NewProvider>
            </Route>
          </Switch>
      </Container>
          :
          <Login/>
        }
    </Router>
  );
}

const Container = styled.div`
  width: 100vw;
`




export default App;
