import React from 'react';
import styled from 'styled-components'

function AddOption({handleChange, expenses, add, expense, labels, addLabel, setNewLabel, setNewExpense, setNewOption, addNewExpense, addNewLabel}) {
    return (
        <Container>
            <form id='add__new' action="add">
                <Select>
                <label htmlFor="Add_Expense">Add New Expense</label>
                <select className="form-select" name="Add_Expense"  onChange={(e) => handleChange(e)}>
                <option value="" defaultValue hidden>Choose here</option>

                {
                    expenses &&
                    expenses.map((obj) => (
                    <option key={obj.label}value={obj.label}> {obj.label} </option>
                    ))
                }
                </select>
                {
                add ?
                <input id='add__new__input' type="text"onChange= {(e) => setNewExpense(e.target.value)}/>
                :
                expense ? 
                <input type="text" onChange={(e) => setNewOption(e.target.value)}/>
                : ''
                }  
                <button class="btn btn-outline-primary" type="submit" onClick={(e) => addNewExpense(e)}>ADD</button>
                </Select>
            </form>
            <form id="add__new__label" action="add__new__label">
                <Select>
                <label htmlFor="Add_New_Label">Add Heading Option</label>
                <select className="form-select" name="Add_New_Label" onChange={(e) => handleChange(e)}>
                <option value="" defaultValue hidden>Choose here</option>
                {
                    labels &&
                    labels.map((obj) => (
                    <option value={obj.label}>{obj.label}</option>
                    ))
                }
                </select>
                {
                    addLabel ? 
                    <input type="text"onChange= {(e) => setNewLabel(e.target.value)}/>
                    :
                    ''
                }
                    <button class="btn btn-outline-primary" type="submit" onClick={(e) => addNewLabel(e)}>ADD</button>

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