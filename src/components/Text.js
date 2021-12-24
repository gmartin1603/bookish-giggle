import React from 'react';
import styled from 'styled-components'
import { writeReport } from '../data';
import Row from './Row';

function Text({clearContext, removeItem, body, total, head,}) {
    

    
    
    const saveReport = () => {
        let id = Date.now().toString()
        //build report object
        let obj = {
            id,
            landLord: head.ll, 
            seedList: body.seed, 
            crop: head.cp, 
            year: head.yr, 
            chemList: body.chemicals, 
            fertList: body.fertilizer, 
            fuelList: body.fuel, 
            truckingList: body.trucking,
            insList: body.insurance,
            misc: body.misc,
            total
        }
        writeReport(obj)
    }


    return (
        <Container>
            <Header>
                <h2>{head.ll} {head.cp} {head.yr}</h2>
            </Header>

            {
                body && 
                Object.keys(body).map((key) => {
                    
                    if (body[key] && body[key].length > 0) {
                        let arr = body[key]
                        return (
                            <Row
                            head={key}
                            arr={arr}
                            removeItem={removeItem}
                            />
                        )
                    }
                })
            }
            {
                total > 0 ?
                <Total className="row justify-content-end">
                    <div className="col-3">
                        <h5>Total Billed</h5>
                    </div>
                    <div className="col-2">
                        <p>${total.toFixed(2)}</p>
                    </div>
                </Total>
                : ''
            }
            {
                head.ll && head.cp && head.yr !== '' ?
                <Buttons>
                    <button class="btn btn-success" onClick={() => saveReport()}>Save</button>
                    <button class="btn btn-primary" onClick={() => window.print()}>Print</button>
                    <button class="btn btn-danger" onClick={() => clearContext()}>Clear Sheet</button>
                </Buttons>
                :
                ''
            }
        </Container>
    );
}

const Container = styled.div`
    width: 60%;

    h4, h5 {
        text-align: center;
        padding: 5px;
    }
    @media print {
        width: 100%;
        margin-left: 70px;
    }
`

const Header = styled.div`
  text-align: center;
`
const Buttons = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-around;
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