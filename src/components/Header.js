import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components'
import { auth } from '../data';

function Header(props) {
    const signOut = () => {
        auth.signOut()
        props.setUser('')
    }

    return (
        <Container>
            <Nav className="nav nav-tabs">
                <Link className="nav-link" to="/">Create New Report</Link>
                <Link className="nav-link" to="/View">View and Edit Reports</Link>
                <Link className="nav-link" to="Add">Add New Option</Link>
            </Nav>
                <button className="btn btn-danger" onClick={() => signOut()}>Logout</button>
        </Container>
    );
}

const Container = styled.div`
    height: 100px;
    width: 100vw;
    border-bottom: 3px solid black;
    display: flex;
    align-items: flex-end;
    justify-content: center;

    @media print {
        display: none;
    }
`

const Nav = styled.nav`
    a {
        text-decoration: none;
        color: black;
    }
`


export default Header;