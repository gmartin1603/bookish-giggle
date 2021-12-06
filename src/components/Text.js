import React, { useEffect, useState } from 'react';
import styled from 'styled-components'
import { writeReport } from '../data';
import Item from './Item'

function Text({removeItem, landLord, seedList, crop, year, chemList, fertList, fuelList, truckingList}) {
    

    const [total, setTotal] = useState(0)
    
    const saveReport = () => {
        //build report object
        let obj = {
            landLord, 
            seedList, 
            crop, 
            year, 
            chemList, 
            fertList, 
            fuelList, 
            truckingList
        }
        writeReport(obj)
    }

    useEffect(() => {
        let t = 0
        seedList.length > 0 &&
        seedList.map((obj) => (
            t = t + (obj.price * obj.qty)
        ))
        fertList.length > 0 &&
        fertList.map((obj) => (
            t = t + (obj.price * obj.qty)
        ))
        chemList.length > 0 &&
        chemList.map((obj) => (
            t = t + (obj.price * obj.qty)
        ))
        fuelList.length > 0 &&
        fuelList.map((obj) => (
            t = t + (obj.price * obj.qty)
        ))
        truckingList.length > 0 &&
        truckingList.map((obj) => (
            t = t + (obj.price * obj.qty)
        ))
        setTotal(t)
        
    })

    return (
        <Container>
            <Header>
                <h2>{landLord} {crop} {year}</h2>
            </Header>
            {
                seedList.length > 0 ?
                <h4>Seed</h4>
                : ''
            }
            <Expense>
                {
                seedList &&
                seedList.map((obj) => (
                    <Item 
                    obj={obj}
                    removeItem={removeItem}
                    />
                ))
                }
            </Expense>
            {
                chemList.length > 0 ?
                <h4>Chemicals</h4>
                : ''
            }
            <Expense>
                {
                chemList &&
                chemList.map((obj) => (
                    <Item 
                    removeItem={removeItem}
                    obj={obj}
                    />
                ))
                }
            </Expense>
            {
                fertList.length > 0 ?
                <h4>Fertilizer</h4>
                : ''
            }
            <Expense>
                {
               fertList &&
               fertList.map((obj) => (
                    <Item 
                    removeItem={removeItem}
                    obj={obj}
                    />
                ))
                }
            </Expense>
            {
                fuelList.length > 0 ?
                <h4>Fuel</h4>
                : ''
            }
            <Expense>
                {
                fuelList &&
                fuelList.map((obj) => (
                    <Item 
                    removeItem={removeItem}
                    obj={obj}
                    />
                ))
                }
            </Expense>
            {
                truckingList.length > 0 ?
                <h4>Trucking</h4>
                : ''
            }
            <Expense>
                {
                truckingList &&
                truckingList.map((obj) => (
                    <Item 
                    removeItem={removeItem}
                    obj={obj}
                    /> 
                ))
                }
            </Expense>
            {
                total > 0 ?
                <Total className="row justify-content-end">
                    <div className="col-3">
                        <h5>Total Billed</h5>
                    </div>
                    <div className="col-2">
                        <p>${total}</p>
                    </div>
                </Total>
                : ''
            }
            {
                landLord && year !== '' ?
                <Buttons>
                    <button class="btn btn-outline-success" onClick={() => saveReport()}>Save</button>
                    <button class="btn btn-outline-primary" onClick={() => window.print()}>Print</button>
                </Buttons>
                :
                ''
            }
        </Container>
    );
}

const Container = styled.div`
    width: 50%;

    h4, h5 {
        text-align: center;
        padding: 5px;
    }
    @media print {
        width: 100%;
    }
`

const Header = styled.div`
  text-align: center;
`
const Expense = styled.div`
  display: flex;
  flex-direction: column;
`
const Buttons = styled.div`
    @media print {
        display: none;
    }
`
const Total = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-right: 150px;

    p {
        font-size: 20px;
    }
`

export default Text;