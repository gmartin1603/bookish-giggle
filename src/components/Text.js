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
                <h4>Seed</h4>
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
                <h4>Chemicals</h4>
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
                <h4>Fertilizer</h4>
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
                <h4>Fuel</h4>
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
                <h4>Trucking</h4>
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