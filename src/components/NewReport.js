import React, { useEffect, useState } from 'react';
import styled from 'styled-components'
import { useNewValue } from '../context/providers/NewProvider';
import { getData } from '../data';
import Text from './Text';

function NewReport() {

    const [state, dispatch] = useNewValue()

    const [optionList, setOptionList] = useState([])
    const [cat, setCat] = useState('')
    const [itm, setItm] = useState('')
    const [price, setPrice] = useState(0)
    const [chk, setChk] = useState('')
    const [qty, setQty] = useState(0)
    const [disa, setDisa] = useState(true)
    const [units, setUnits] = useState()
    const [unit, setUnit] = useState()
    const [total, setTotal] = useState(0)

    useEffect(() => {
        getData('labels-4.0', dispatch)
        getData('expenses-4.0', dispatch)
        console.log("Data Retrived")
      },[])

    // Wipes context state
    const clearContext = () => {
        
        dispatch({
            type: 'RESET',
        })
        setTotal(0)
        document.getElementById("heading").reset()
    }

    const validate = () => {
        if ((cat && itm && chk !== '') && (qty && price > 0)) {
            console.log("validated => true")
            if (disa) {
                setDisa(false)
            }
        } else {
            if (!disa) {
                setDisa(true)
            }
        }
    }

    const clear = (ele) => {
        document.getElementById(ele).reset()
        setCat('')
        setItm('')
        setPrice(0)
        setQty(0)
        setDisa(true)
    }

    const handleChange = (e) => {
        setCat(e.target.value)
        setItm('')
        setUnit()
        setUnits()
  
        state["expenses-4.0"].map((item) => {
        if(item.id === e.target.value) {
            setOptionList(item.options)

            if(item.units && item.units.length === 1) {
                // auto selects unit if only one option exists
                setUnit(item.units[0])
                setChk(item.units[0])
            } else if (item.units && item.units.length > 1){
                setUnits(item.units)  
            }
        }})
    }

    const addExpense = (e) => {
    e.preventDefault()
    let obj = {
        id: Date.now(),
        name: itm,
        price,
        qty,
        unit: chk,
        arr: cat,
    }
    let t = total + (qty * price)
    setTotal(t)
    
    dispatch({
        type: "ADD-OBJ",
        name: cat,
        load: obj,
        
    })
    
    clear('expense')
    }

    const removeItem = (arr, attr, value) => {
        // console.log(attr)
        let a = state[arr]
        let i = a.length;
        let array = []
        while(i--){
            if(a[i] && a[i].hasOwnProperty(attr) && a[i][attr] === value){
                //  remove quantity * price from total
                let q = a[i]["qty"]
                let p = a[i]["price"]
                let t = total - (q * p)
                setTotal(t)
            }else{
            // new array with target obj removed
            array.splice(0, 0, a[i])
            console.log(array)
            }      
        }
        // update context store
        dispatch({
            type: 'UPDATE',
            name: arr,
            load: array,
        })
    }

    useEffect(() => {
        validate()
    })

    return (
        <Main>
        <Container>
            <form action="" id="heading">

            {
            state["labels-4.0"] &&
            state["labels-4.0"].map((obj) => (
                <Select>
                <label htmlFor={obj.label}>{obj.label}</label>
                <select className="form-select" name={obj.id} onChange={(e) => dispatch({type: "ADD-STRING", name: e.target.name, load: e.target.value})}>
                <option value="" defaultValue hidden >Choose here</option>
                    {
                    obj.options && 
                    obj.options.map((option) => (
                        <option value={option}>{option}</option>
                        ))
                    }
                </select>
                </Select>
            ))
            }
            </form>
            <form id="expense" action="add" >
            <Select>
            <label htmlFor="Expense">Add Expense</label>
            <select className="form-select" name="expense"  onChange={(e) => handleChange(e)}>
            <option value="" defaultValue hidden>Choose here</option>

            {
               state["expenses-4.0"] &&
               state["expenses-4.0"].map((obj) => (
                <option key={obj.label} value={obj.id}> {obj.label} </option>
                ))
            }
            </select>
            {
                optionList.length > 0 &&
                 cat !== '' ?  
                
                // <label for="expense">Add Expense</label>
                <select className="form-select" name={cat} onChange={(e) => setItm(e.target.value)}>
                        <option value="" defaultValue hidden>Choose here</option>
                    {        
                        
                        optionList.map((o) => (
                            <option key={o} value={o} >{o}</option>
                        ))
                        
                    }
                </select>
                  :
                  ''
            }

            {
                units && cat?
                <Check>    
                    <label htmlFor="qty">Unit of Measure</label>
                    <ul>
                    {
                        units.map((uni) => (
                            <li>
                                <label for={uni}> {uni} </label>
                                <input name={uni} type="checkbox" value={uni} onChange={(e) => setChk(e.target.value)} />
                            </li>
                        ))
                    }
                    </ul>
                </Check>
                :
                ''
            }
            {
                unit && cat ?
                <Check>
                    <label htmlFor="qty">Unit of Measure</label>
                    <div>
                        <label for={unit}>{unit}</label>
                        <input name={unit} type="checkbox" checked={true} value={unit}/>
                    </div>
                </Check>
                    :
                    ''
            }

            <label htmlFor="qty">Quantity</label>
            <input className="form-control" placeholder="QTY" name="qty" type="number" onChange={(e) => setQty(e.target.value)}/>
            <label htmlFor="price">Price Per Unit</label>
            <input className="form-control" placeholder="Price" name="price" type="number" onChange={(e) => setPrice(e.target.value)}/>
            <button class="btn btn-outline-primary" disabled={disa} type="submit" onClick={(e) => addExpense(e)}>ADD</button>
            </Select>
            </form>
        </Container>
        <Text
            head={{ll: state.landLord,
                yr: state.year,
                cp: state.crop,}}
            body={{
            seed: state.seedList,
            chemicals: state.chemList,
            fertilizer: state.fertList,
            fuel: state.fuelList,
            trucking: state.truckingList,
            insurance: state.insList,
            misc: state.misc}}
            total={total}
            removeItem= {removeItem}
            clearContext= {clearContext}
        />
        </Main>
    );
}

const Main = styled.div`
    width: 95%;
    display: flex;
    justify-content: space-around;
`

const Container = styled.div`
    max-width: 200px;
    min-width: 150px;
    padding: 0px;

    form {
        margin-top: 20px;
    }
    @media print {
        display: none;
    }
`
const Select = styled.div`
    display: flex;
    flex-direction: column;

    select {
        margin-top: 10px;
    }
    button {
        margin-top: 10px;
    }
    button:disabled {
        display: none;
    }
`
const Check = styled.div`
    display: flex;
    flex-direction: column;
    label {
        margin-top: 10px;
    }
    ul {
        margin: 0;
        padding:0;
        display: flex;
        justify-content: center;
        align-items: center;
        list-style-type: none;
        li {
            margin: 10px;
            input {
                margin-left: 10px;
            }
        }
        
    }
    div {
        display: flex;
        align-items: center;
        justify-content: center;

        input {
            margin-top: 10px;
            margin-left: 10px;
            
        }
        
    }
`

export default NewReport;