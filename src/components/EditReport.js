import React, { useEffect, useState } from 'react';
import styled from 'styled-components'
import { useEditValue } from '../context/providers/EditProvider';
import { getData } from '../data';
import ReportSelect from './ReportSelect';
import Text from './Text';


function EditReport() {

    const [state, dispatch] = useEditValue()

    const [id, setId] = useState(1)
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

    const handleChange = (e) => {
        e.preventDefault()
        setCat(e.target.value)
        setItm('')
        setUnit()
        setUnits()
  
        state.expenses.map((item) => {
        if(item.id === e.target.value) {
            setOptionList(item.options)

            if(item.units.length === 1) {
                // auto selects unit if only one option exists
                setUnit(item.units[0])
                setChk(item.units[0])
            } else if (item.units.length > 1){
                setUnits(item.units)  
            }
        }})
    }

    useEffect(() => {
        getData('expenses', dispatch)
        console.log("Data Retrived")
      },[])

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
        let t = total + (qty * price)
        setTotal(t)
        
        dispatch({
            type: "ADD-OBJ",
            name: cat,
            load: obj,
            
        })
        setId(int)
        clear('expense')
        }

        const removeItem = (arr, attr, value) => {
            console.log(arr)
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
              <ReportSelect
                setTotal={setTotal}
              />
        <Content>
        <Container>
            <form id="Expense" action="add seed" >
            <Select>
            <label htmlFor="Expense">Add Expense</label>
            <select className="form-select" name="expense"  onChange={(e) => handleChange(e)}>
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
            insurance: state.insList,}}
            total={total}
            removeItem= {removeItem}
        />
        </Content>
        </Main>
    );
}

const Main = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`
const Content = styled.div`
    
    display: flex;
    justify-content: space-around;
`
const Container = styled.div`
    display: flex;

    @media print {
        display: none;
    }

`
const Select = styled.div`
    width: 200px;
    padding: 10px;
    display: flex;
    flex-direction: column;

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

export default EditReport;