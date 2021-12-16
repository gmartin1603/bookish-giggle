import React, { useEffect } from 'react';
import styled from 'styled-components'

function Item({obj, removeItem}) {

    

    // useEffect(() => {
    //    console.log(obj)
    // })

    return (
        <Container className="row justify-content-center">
            <div className="col-2">
                <p>{obj.name}</p>
            </div>
            <div className="col-2">
                {
                    obj.qty > 1 ?
                    <p>{obj.qty} <b>{obj.unit + "s"}</b></p>
                    :
                    <p>{obj.qty} <b>{obj.unit}</b></p>
                }
            </div>
            <div className="col">
                <p>@ ${obj.price} <b>per {obj.unit}</b></p>
            </div>
            <div className="col">
                <p><b>Total:</b> ${(obj.price * obj.qty).toFixed(2)}</p>
            </div>
            <div id="button" className="col">
            <button className="btn btn-outline-danger" onClick={() => removeItem(obj.arr, 'id', obj.id)}>Delete</button>
            </div>
        </Container>
    );
}

export default Item;

const Container = styled.div`
    
    #button {
        @media print {
            display: none;
        }
    }
    button {
        @media print {
            display: none;
        }
    }
`