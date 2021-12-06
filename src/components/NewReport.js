import React, { useEffect, useState } from 'react';
import styled from 'styled-components'
import { useNewValue } from '../context/providers/NewProvider';
import Text from './Text';

function NewReport() {

    const [state, dispatch] = useNewValue()

    const [id, setId] = useState(1)
    const [optionList, setOptionList] = useState([])
    const [cat, setCat] = useState('')
    const [itm, setItm] = useState('')
    const [price, setPrice] = useState('')
    const [chk, setChk] = useState('')
    const [qty, setQty] = useState(0)
    const [disa, setDisa] = useState(true)
    
    const units = [
        "Lb", "Gal", "Mile", 'Bag', "Oz", "Acre", 
    ]

    const validate = () => {
        console.log("FLAG")
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
  
        state.expenses?.map((item) => {
          if(item.id === e.target.value) {
            setOptionList(item.options)
          } else return null
        })
      }

    const addExpense = (e) => {
    e.preventDefault()
    let obj = {
        id,
        name: itm,
        price,
        qty,
        unit: chk,
        arr: cat,
    }
    let int = id + 1
    
    dispatch({
        type: "ADD-OBJ",
        name: cat,
        load: obj,
        
    })
    setId(int)
    clear('expense')
    }

    const removeItem = (arr, attr, value) => {
        // console.log(attr)
        let a = state[arr]
        let i = a.length;
        let array = []
        while(i--){
            if(a[i] && a[i].hasOwnProperty(attr) && a[i][attr] === value){
                //  console.log("HIT")
            }else{
            array.splice(0, 0, a[i])
            // console.log(array)
            }      
        }
        dispatch({
            type: 'UPDATE',
            name: arr,
            load: array,
        })
    }

    return (
        <Main>
        <Container>
            <form action="">

            {
            state.labels &&
            state.labels.map((obj) => (
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
            <select className="form-select" name="expense"  onChange={(e) => {handleChange(e); validate()}}>
            <option value="" defaultValue hidden>Choose here</option>

            {
               state.expenses &&
               state.expenses.map((obj) => (
                <option key={obj.label} value={obj.id}> {obj.label} </option>
                ))
            }
            </select>
            {
                optionList.length > 0 &&
                 cat !== '' ?  
                
                // <label for="expense">Add Expense</label>
                <select className="form-select" name={cat} onChange={(e) => {setItm(e.target.value); validate()}}>
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

            {/* <label htmlFor="Expense">Unit of Measure</label>
            <select className="form-select" name="expense"  onChange={(e) => {setChk(e.target.value); validate()}}>
            <option value="" defaultValue hidden>Choose here</option> */}

            {
               units.map((uni) => (
                <checkbox key={uni} value={uni}> {uni} </checkbox>
                ))
            }
            {/* </select> */}

            <label htmlFor="qty">Quantity</label>
            <input className="form-control" placeholder="QTY" name="Qty"type="number" onChange={(e) => {setQty(e.target.value); validate()}}/>
            <label htmlFor="price">Price Per Unit</label>
            <input className="form-control" placeholder="Price" name="Price"type="number" onChange={(e) => {setPrice(e.target.value); validate()}}/>
            <button class="btn btn-outline-primary" disabled={disa} type="submit" onClick={(e) => addExpense(e)}>ADD</button>
            </Select>
            </form>
        </Container>
        <Text
            landLord={state.landLord}
            year= {state.year}
            crop= {state.crop}
            seedList= {state.seedList}
            chemList= {state.chemList}
            fertList= {state.fertList}
            fuelList= {state.fuelList}
            truckingList= {state.truckingList}
            removeItem= {removeItem}
        />
        </Main>
    );
}

const Main = styled.div`
    width: 90%;
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

export default NewReport;