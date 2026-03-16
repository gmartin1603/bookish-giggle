import React from 'react';
import styled from 'styled-components';
import Item from './Item';

const labels = {
  seed: 'Seed',
  chemicals: 'Chemicals',
  fertilizer: 'Fertilizer',
  fuel: 'Fuel',
  trucking: 'Trucking',
  insurance: 'Insurance',
  misc: 'Miscellaneous',
};

function Row({ head, arr, removeItem }) {
  return (
    <Section>
      <SectionHeader>
        <h5>{labels[head] || head}</h5>
        <span>{arr.length} item{arr.length === 1 ? '' : 's'}</span>
      </SectionHeader>

      <Items>
        {arr.map((obj) => (
          <Item key={obj.id} obj={obj} removeItem={removeItem} />
        ))}
      </Items>
    </Section>
  );
}

const Section = styled.section`
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: rgba(255, 253, 248, 0.9);
  box-shadow: 0 14px 34px rgba(58, 46, 22, 0.08);

  @media print {
    padding: 14px 0;
    border: none;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    break-inside: avoid;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(52, 88, 66, 0.14);

  h5 {
    font-size: 1.35rem;
    text-transform: capitalize;
  }

  span {
    color: var(--muted);
    font-weight: 700;
    font-size: 0.92rem;
  }

  @media print {
    margin-bottom: 10px;
    padding-bottom: 6px;
  }
`;

const Items = styled.div`
  display: grid;
  gap: 10px;
`;

export default Row;
