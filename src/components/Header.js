import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components'

function Header(props) {
    return (
        <Container>
            <Nav>
                <Link to="/">Create New Report</Link> |
                <Link to="/View">View and Edit Reports</Link> | 
                <Link to="Add">Add New Option</Link>
            </Nav>
        </Container>
    );
}

const Container = styled.div`
    height: 100px;
    width: 100vw;
    border-bottom: 3px solid black;
    display: flex;
    align-items: center;
    justify-content: center;

    @media print {
        display: none;
    }
`

const Nav = styled.nav`
    a {
        padding: 10px;
        text-decoration: none;
        color: black;
    }
    a:active {
        color: red;
    }
`


export default Header;