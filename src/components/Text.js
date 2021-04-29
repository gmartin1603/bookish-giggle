import React from 'react';
import styled from 'styled-components'
import { writeReport } from '../data';
import Item from './Item'

function Text({total, landLord, crop, year, setSeedList, seedList, setChemList, chemList, setFertList, fertList, setTruckingList, truckingList, setFuelList, fuelList, removeItem}) {
    const saveReport = () => {
        //build report object
        let report = {
          landLord,
          crop,
          year,
          seedList,
          chemList,
          fertList,
          truckingList,
          fuelList,
          total,
        }
        //send obj to firebase
        writeReport(report)
      }
    return (
        <Container>
            <Header>
                <h2>{landLord} {crop} {year}</h2>
            </Header>
            {
                seedList.length > 0 ?
                <h3>Seed</h3>
                : ''
            }
            <Expense>
                {
                seedList &&
                seedList.map((obj) => (
                    <Item 
                    obj={obj}
                    list={seedList}
                    state={setSeedList} 
                    removeItem={removeItem} 
                    />
                ))
                }
            </Expense>
            {
                chemList.length > 0 ?
                <h3>Chemicals</h3>
                : ''
            }
            <Expense>
                {
                chemList &&
                chemList.map((obj) => (
                    <Item 
                    obj={obj}
                    list={chemList}
                    state={setChemList} 
                    removeItem={removeItem} 
                    />
                ))
                }
            </Expense>
            {
                fertList.length > 0 ?
                <h3>Fertilizer</h3>
                : ''
            }
            <Expense>
                {
                fertList &&
                fertList.map((obj) => (
                    <Item 
                    obj={obj}
                    list={fertList}
                    state={setFertList} 
                    removeItem={removeItem} 
                    />
                ))
                }
            </Expense>
            {
                fuelList.length > 0 ?
                <h3>Fuel</h3>
                : ''
            }
            <Expense>
                {
                fuelList &&
                fuelList.map((obj) => (
                    <Item 
                    obj={obj}
                    list={fuelList}
                    state={setFuelList} 
                    removeItem={removeItem} 
                    />
                ))
                }
            </Expense>
            {
                truckingList.length > 0 ?
                <h3>Trucking</h3>
                : ''
            }
            <Expense>
                {
                truckingList &&
                truckingList.map((obj) => (
                    <Item 
                    obj={obj}
                    list={truckingList}
                    state={setTruckingList} 
                    removeItem={removeItem} 
                    /> 
                ))
                }
            </Expense>
            {
                total > 0 ?
                <Total>
                <h3>Total Billed</h3>
                <p>${total}</p>
                </Total>
                : ''
            }
            {
                landLord && year !== '' ?
                <Buttons>
                    <button onClick={() => saveReport()}>Save</button>
                    <button onClick={() => window.print()}>Print</button>
                </Buttons>
                :
                ''
            }
        </Container>
    );
}

const Container = styled.div`
    h3 {
        text-align: center;
        padding: 10px;
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
    padding: 0 80px;
`

export default Text;