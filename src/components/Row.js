import React from 'react';
import styled from 'styled-components'
import Item from './Item';

function Row({head, arr, removeItem}) {

    return (
        <Main>
            <h5>{head.toUpperCase()}</h5>
            {
                arr.length > 0 &&
                arr.map((obj) => (
                    <Expense>
                        <Item 
                        obj={obj}
                        removeItem={removeItem}
                        />
                    </Expense>
                ))
            }
        </Main>
    );
}

export default Row;
const Main = styled.div`
    h5 {
        border-bottom: 1px, solid;
    }
`
const Expense = styled.div`
  display: flex;
  flex-direction: column;
`