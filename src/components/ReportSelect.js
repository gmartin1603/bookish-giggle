import React, { useEffect } from 'react';
import styled from 'styled-components'
import { useEditValue } from '../context/providers/EditProvider';
import { getReports } from '../data';

function ReportSelect({setTotal, setHide}) {
    
    const [state, dispatch] = useEditValue()

    useEffect(() => {
        getReports(dispatch)
        // console.log(state)
    },[])

    const clearContext = () => {
        
        dispatch({
            type: 'RESET',
        })
        setTotal(0)
    }

    const handleChange = (e) => {
        e.preventDefault()
        clearContext()
        let arr = state.reports
        let attr = "id"
        let i = arr.length
        while (i--) {
            if(arr[i] && arr[i].hasOwnProperty(attr) && arr[i][attr] === e.target.value){ 
                // console.log(arr[i])
                Object.keys(arr[i]).forEach(key => {
                    // console.log(typeof arr[i][key])
                    switch (typeof arr[i][key]) {
                        case 'string':
                            dispatch({
                                type: "ADD-STRING",
                                name: key,
                                load: arr[i][key]
                            })
                        break;
                        case 'object':
                            dispatch({ 
                                type: 'ADD-ARR',
                                name: key,
                                load: arr[i][key]
                            })
                        break;
                        case 'number':
                            setTotal(arr[i][key])
                        break;
                        default:
                            return
                    }
                })
            }
        }
        setHide(false)
    }

    return (
        <Container> 
            {/* <button onClick={clearContext}>Clear Context</button> */}
            <select className="form-select" onChange={(e) => handleChange(e)} >
                <option value="" defaultValue hidden>Choose a report to view</option>
                {
                    state.reports.length > 0 &&
                    state.reports.map((report) => {
                        // console.log(report)
                        return (
                        <option value={report.id}>{report.landLord} {report.year} {report.crop}</option>
                    )})
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