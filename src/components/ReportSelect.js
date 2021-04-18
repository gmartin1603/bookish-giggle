import React, { useEffect, useState } from 'react';
import styled from 'styled-components'
import { getReport, getReports } from '../data';

function ReportSelect({setChemList, setCrop, setFertList, setFuelList, setLandLord,setYear, setSeedList, setTruckingList}) {
    const [reports, setReports] = useState([])

    const handleChange = (value) => {
        getReport(value, setChemList, setCrop, setFertList, setFuelList, setLandLord,setYear, setSeedList, setTruckingList)
        
    }

    useEffect(() => {
        getReports(setReports, reports)
    }, [])
    return (
        <Container> 
            <select onChange={(e) => handleChange(e.target.value)} >
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

    @media print {
        display: none;
    }
`

export default ReportSelect;