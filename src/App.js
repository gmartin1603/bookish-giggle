import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import NewReport from "./components/NewReport";
import Header from "./components/Header";
import { useEffect, useState } from "react";
import {getData, writeData, writeReport} from './data'
import Text from "./components/Text";
import styled from 'styled-components'
import ReportSelect from "./components/ReportSelect";
import EditReport from "./components/EditReport";


function App() {
  const [labels, setLabels] = useState('')
  const [expenses, setExpenses] = useState('')
  const [newOption, setNewOption] = useState('')
  const [seed, setSeed] = useState('')
  const [qty, setQty] = useState('')
  const [price, setPrice] = useState('')
  const [year, setYear] = useState('')
  const [landLord, setLandLord] = useState('')
  const [crop, setCrop] = useState('')
  const [chemical, setChemical] = useState('')
  const [fuel, setFuel] = useState('')
  const [trucking, setTrucking] = useState('')
  const [fertilizer, setFertilizer] = useState('')
  const [seedList, setSeedList] = useState([])
  const [chemList, setChemList] = useState([])
  const [fuelList, setFuelList] = useState([])
  const [fertList, setFertList] = useState([])
  const [truckingList, setTruckingList] = useState([])
  const [optionList, setOptionList] = useState([])
  const [expense, setExpense] = useState('')
  const [id, setId] = useState(1)
  const [add, setAdd] = useState(false)
  const [addLabel, setAddLabel] = useState(false)
  const [newExpense, setNewExpense] = useState('')
  const [newLabel, setNewLabel] = useState('')
  const [label, setLabel] = useState('')
  const [report, setReport] = useState('')

  useEffect(() => {
    getData('labels', setLabels)
    getData('expenses', setExpenses)
  },[])

  const removeItem = (arr, attr, value, fun) => {
    console.log(arr)
    let i = arr.length;
    let array = []
    while(i--){
        if(arr[i] 
           && arr[i].hasOwnProperty(attr) 
           && arr[i][attr] === value){ 
          }else{
            array.splice(0, 0, arr[i])
          }      
    }
    fun(array)
  }

  const handleChange = (e) => {
    
    switch (e.target.name) {
      case ("Land Lord") :
        setLandLord(e.target.value)
        break
      case ("Crop") :
        setCrop(e.target.value)
        break
      case ("Year") :
        setYear(e.target.value)
        break
      case ("Seed") :
        setSeed(e.target.value)
        break
      case ("Chemical Liquid") :
        setChemical(e.target.value)
        break
      case ("Chemical Dry") :
        setChemical(e.target.value)
        break
      case ("Fertilizer Dry") :
        setFertilizer(e.target.value)
        break
      case ("Fertilizer Liquid") :
        setFertilizer(e.target.value)
        break
      case ("Fuel") :
        setFuel(e.target.value)
        break
      case ("Trucking") :
        setTrucking(e.target.value)
        break
      case ("Expense") :
        setExpense(e.target.value)
        break
      case ("Add_Expense") :
        e.target.value === 'add' ?
        setAdd(true)
        :
        setExpense(e.target.value)
        break
      case ("Add_New_Label") :
        setAddLabel(true)
        setLabel(e.target.value)
        break
      case ("Price") :
        setPrice(e.target.value)
        break
      case ("Qty") :
        setQty(e.target.value)
        break
      default:
        return
    }
    expenses?.map((item) => {
      if(item.label === e.target.value) {
        let a = []
        item.options ?
        item.options.map((option) => {
          a.splice(0, 0, option)
          return(
            setOptionList(a)
          )
        })
        :
        setOptionList('')
      } else return null
    })
  }

  const addExpense = (e, exp) => {
    e.preventDefault()
    if (price > 0 && qty > 0) {
      let obj = {}
      let int = id + 1
      setId(int)
      switch (exp) {
        case ('Seed'):
          obj = {
            name: seed,
            price: price,
            qty: qty,
            unit: "Bag",
            id: int
            
          }
          setSeedList([...seedList, obj])
          break;
        case ('Chemical Dry'):
          obj = {
            name: chemical,
            price: price,
            qty: qty,
            unit: "lb",
            id: id
          }
          setChemList([...chemList, obj])
          break;
        case ('Chemical Liquid'):
          obj = {
            name: chemical,
            price: price,
            qty: qty,
            unit: "gal",
            id: id
          }
          setChemList([...chemList, obj])
          break;
        case ('Fertilizer Dry'):
          obj = {
            name: fertilizer,
            price: price,
            qty: qty,
            unit: "lb",
            id: id
          }
          setFertList([...fertList, obj])
          break;
        case ('Fertilizer Liquid'):
          obj = {
            name: fertilizer,
            price: price,
            qty: qty,
            unit: "gal",
            id: id
          }
          setFertList([...fertList, obj])
          break;
        case ('Fuel'):
          obj = {
            name: fuel,
            price: price,
            qty: qty,
            unit: "gal",
            id: id
          }
          setFuelList([...fuelList, obj])
          break;
        case ('Trucking'):
          obj = {
            name: trucking,
            price: price,
            qty: qty,
            unit: "bushel",
            id: id
          }
          setTruckingList([...truckingList, obj])
          break;
            default:
              return
      }
      document.getElementById("Expense").reset()
      setOptionList('')
      setExpense('')
    }
    else return
  }

  return (
    <Router>
      <Container className="app">
        <Header/>
          <Switch>
            <Route path="/View">
              <ReportSelect 
                setLandLord={setLandLord}
                setYear={setYear}
                setCrop={setCrop}
                setSeedList={setSeedList}
                setTruckingList={setTruckingList}
                setFertList={setFertList}
                setChemList={setChemList}
                setFuelList={setFuelList}
                />
              <Content>
              <EditReport
                labels={labels} 
                optionList={optionList}
                expenses={expenses}
                expense={expense}
                addExpense={addExpense}
                handleChange={handleChange}
                />
              <Text
                  landLord={landLord}
                  crop={crop}
                  year={year}
                  setSeedList={setSeedList}
                  seedList={seedList}
                  setChemList={setChemList}
                  chemList={chemList}
                  setFertList={setFertList}
                  fertList={fertList}
                  setTruckingList={setTruckingList}
                  truckingList={truckingList}
                  setFuelList={setFuelList}
                  fuelList={fuelList}
                  removeItem={removeItem}
                  />
              </Content>
            </Route>
            <Route path="/">
              <Content>
                <NewReport 
                labels={labels} 
                optionList={optionList}
                expenses={expenses}
                expense={expense}
                addExpense={addExpense}
                handleChange={handleChange}
                /> 
                <Text
                landLord={landLord}
                crop={crop}
                year={year}
                setSeedList={setSeedList}
                seedList={seedList}
                setChemList={setChemList}
                chemList={chemList}
                setFertList={setFertList}
                fertList={fertList}
                setTruckingList={setTruckingList}
                truckingList={truckingList}
                setFuelList={setFuelList}
                fuelList={fuelList}
                removeItem={removeItem}
                />
              </Content>
            </Route>
          </Switch>
      </Container>
    </Router>
  );
}

const Container = styled.div`
  width: 100vw;
`

const Content = styled.div`
  display: flex;
  justify-content: center;
`


export default App;
