import React from 'react';
import styled from 'styled-components'
function EditReport({expenses, optionList, expense, addExpense, handleChange}) {
    return (
        <Container>
            <form id="Expense" action="add seed" >
                <Select>
                <label htmlFor="Expense">Add Expense</label>
                <select className="form-select" name="Expense"  onChange={(e) => handleChange(e)}>
                <option value="" defaultValue hidden>Choose here</option>

                {
                    expenses &&
                    expenses.map((obj) => (
                    <option key={obj.label}value={obj.label}> {obj.label} </option>
                    ))
                }
                </select>
                {
                optionList.length > 0 ?  
                
                // <label for="expense">Add Expense</label>
                <select className="form-select" name={expense} onChange={(e) => handleChange(e)}>
                    <option value="" defaulfValue hidden>Choose here</option>
                    
                    {        
                    optionList &&
                    optionList.map((obj) => (
                        <option key={obj} >{obj}</option>
                    ))         
                    }
                </select>
                :
                ''
                }
                <label htmlFor="qty">Quantity</label>
                <input className="form-control" placeholder="QTY" name="Qty"type="number" onChange={(e) => handleChange(e)}/>
                <label htmlFor="price">Price Per Unit</label>
                <input className="form-control" placeholder="Price" name="Price"type="number" onChange={(e) => handleChange(e)}/>
                <button class="btn btn-outline-primary" type="submit" onClick={(e) => addExpense(e, expense)}>ADD</button>
                </Select>
            </form>
        </Container>
    );
}

const Container = styled.div`
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
`

export default EditReport;