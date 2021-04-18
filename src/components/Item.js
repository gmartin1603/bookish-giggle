import React from 'react';
import styled from 'styled-components'

function Item({obj, list, state, removeItem}) {
    return (
        <Container>
            <p>{obj.name}</p>
            {
                obj.qty > 1 ?
                <p>{obj.qty} <b>{obj.unit + "s"}</b></p>
                :
                <p>{obj.qty} <b>{obj.unit}</b></p>
            }
            <p>@ ${obj.price} <b>per {obj.unit}</b></p>
            <p><b>Total:</b> ${obj.price * obj.qty}</p>
            <button onClick={() => removeItem(list, 'id', obj.id, state)}>Delete</button>
        </Container>
    );
}

export default Item;

const Container = styled.div`
    display: flex;
    p {
        margin: 0 10px;
    }
    button {
        @media print {
            display: none;
        }
    }
`