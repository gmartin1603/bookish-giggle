import React from 'react';
import styled from 'styled-components'
import { getReport } from '../data';

function ReportSelect({reports, setChemList, setCrop, setFertList, setFuelList, setLandLord,setYear, setSeedList, setTruckingList, setTotal}) {
    

    const handleChange = (value) => {
        getReport(value, setChemList, setCrop, setFertList, setFuelList, setLandLord,setYear, setSeedList, setTruckingList, setTotal)
        
    }

    return (
        <Container> 
            <select className="form-select" onChange={(e) => handleChange(e.target.value)} >
                <option value="" defaultValue hidden>Choose a report to view</option>
                {
                    reports.length > 0 &&
                    reports.map((report) => (
                        <option value={`${report.landLord} ${report.year}`}>{report.landLord} {report.year}</option>
                    ))
                }
            </select>
        </Container>
    );
}

const Container = styled.div`
    width: 100vw;
    display: flex;
    justify-content: center;
    padding: 10px;

    select {
        width: 32%
    }

    @media print {
        display: none;
    }
`

export default ReportSelect;