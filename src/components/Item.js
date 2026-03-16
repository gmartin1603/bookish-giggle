import React from 'react';
import styled from 'styled-components';

function Item({ obj, removeItem }) {
  const quantityLabel = Number(obj.qty) > 1 ? `${obj.unit}s` : obj.unit;
  const printLine = `${obj.name}, ${obj.qty} @ $${Number(obj.price).toFixed(2)}/${obj.unit}`;

  return (
    <Container>
      <PrintLine>{printLine}</PrintLine>

      <Details>
        <Detail>
          <span>Item</span>
          <strong>{obj.name}</strong>
        </Detail>
        <Detail>
          <span>Quantity</span>
          <strong>
            {obj.qty} {quantityLabel}
          </strong>
        </Detail>
        <Detail>
          <span>Rate</span>
          <strong>
            ${Number(obj.price).toFixed(2)} per {obj.unit}
          </strong>
        </Detail>
        <Detail>
          <span>Total</span>
          <strong>${(Number(obj.price) * Number(obj.qty)).toFixed(2)}</strong>
        </Detail>
      </Details>

      <DeleteButton type="button" onClick={() => removeItem(obj.arr, 'id', obj.id)}>
        Delete
      </DeleteButton>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 14px 16px;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(52, 88, 66, 0.08);

  @media (max-width: 760px) {
    flex-direction: column;
    align-items: stretch;
  }

  @media print {
    padding: 8px 0;
    border: none;
    border-radius: 0;
    background: transparent;
  }
`;

const Details = styled.div`
  flex: 1;
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(4, minmax(0, 1fr));

  @media (max-width: 920px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }

  @media print {
    display: none;
  }
`;

const Detail = styled.div`
  display: grid;
  gap: 2px;

  span {
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--muted);
    font-weight: 700;
  }

  strong {
    font-size: 1rem;
  }
`;

const PrintLine = styled.p`
  display: none;

  @media print {
    display: block;
    flex: 1;
    font-size: 0.95rem;
    line-height: 1.3;
  }
`;

const DeleteButton = styled.button`
  padding: 10px 15px;
  border-radius: 999px;
  border: 1px solid rgba(173, 76, 57, 0.2);
  background: rgba(173, 76, 57, 0.08);
  color: var(--danger);
  font-weight: 700;

  @media print {
    display: none;
  }
`;

export default Item;
