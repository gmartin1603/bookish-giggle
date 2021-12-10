import React, { useEffect, useState } from 'react';
import styled from 'styled-components'
import { useAddValue } from '../context/providers/AddProvider';
import { getData } from '../data';

function AddOption(props) {

    const [state, dispatch] = useAddValue()

    const [optionList, setOptionList] = useState()
    const [edis, setEdis] = useState(true)
    const [ldis, setLdis] = useState(true)
    const [newLab, setNewLab] = useState('')
    const [newExp, setNewExp] = useState('')

    useEffect(() => {
        getData("labels", dispatch)
        getData("expenses", dispatch)
        // console.log(props.labels)
      },[])

    const handleChange = (e) => {
        
        state.expenses.map((item) => {
            if(item.id === e.target.value) {
                setOptionList(item.options)
            }})
        setEdis(false)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
    }

    return (
        <Container>
            <form id='add__new' action="add">
                <Select>
                <label htmlFor="Add_Expense">Add New Expense</label>
                <select className="form-select" name="Add_Expense"  onChange={(e) => handleChange(e)}>
                <option value="" defaultValue hidden>Choose here</option>

                {
                    state.expenses &&
                    state.expenses.map((obj) => (
                    <option key={obj.label}value={obj.label}> {obj.label} </option>
                    ))
                }
                </select>
                
                
                <input id='add__new__input' hidden={edis} type="text" value={newExp} onChange= {(e) => setNewExp(e)}/>
                 
                <button class="btn btn-outline-primary" type="submit" onClick={(e) => handleSubmit(e)}>ADD</button>
                </Select>
            </form>
            <form id="add__new__label" action="add__new__label">
                <Select>
                <label htmlFor="Add_New_Label">Add Heading Option</label>
                <select className="form-select" name="Add_New_Label" onChange={(e) => setLdis(!ldis)}>
                <option value="" defaultValue hidden>Choose here</option>
                {
                    state.labels &&
                    state.labels.map((obj) => (
                    <option value={obj.label}>{obj.label}</option>
                    ))
                }
                </select>   
                    <input type="text" hidden={ldis} value={newLab} onChange= {(e) => setNewLab(e.target.value)}/>
                    <button class="btn btn-outline-primary" type="submit" onClick={(e) => handleSubmit(e)}>ADD</button>

                </Select>
            </form>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    justify-content: center
`
const Select = styled.div`
  padding: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: 550;
  font-size: 30px;
    button {
        margin-top: 20px;
    }
`

export default AddOption;