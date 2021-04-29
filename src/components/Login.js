import React, { useState } from 'react';
import styled from 'styled-components'
import { auth } from '../data';

function Login(props) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const login = (e) => {
        e.preventDefault()
        auth.signInWithEmailAndPassword(email, password)
        .then((user) => {
            console.log(user.email)
        })
        .catch((error) => {
            alert(error.message)
        })
    }

    return (
        <Container>
            <Form action="login">
                <label htmlFor="email">Email</label>
                <input type="email" onChange={(e) => setEmail(e.target.value)}/>
                <label htmlFor="password">Password</label>
                <input type="password" onChange={(e) => setPassword(e.target.value)}/>
                <button type="submit" onClick={(e) => login(e)}>Login</button>
            </Form>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    justify-content: center;
`

const Form = styled.form`
    margin-top: 100px;
    display: flex;
    flex-direction: column;
    border: 1px solid black;
    border-radius: 10px;
    padding: 20px;
`

export default Login;