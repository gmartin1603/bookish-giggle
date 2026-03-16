import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useEditValue } from '../context/providers/EditProvider';
import { getReports } from '../data';

function ReportSelect({ setTotal, setHide }) {
  const [state, dispatch] = useEditValue();

  useEffect(() => {
    getReports(dispatch);
  }, [dispatch]);

  const clearContext = () => {
    dispatch({
      type: 'RESET',
    });
    setTotal(0);
  };

  const handleChange = (event) => {
    clearContext();

    const selectedReport = (state.reports || []).find((report) => report.id === event.target.value);

    if (!selectedReport) {
      return;
    }

    Object.keys(selectedReport).forEach((key) => {
      switch (typeof selectedReport[key]) {
        case 'string':
          dispatch({
            type: 'ADD-STRING',
            name: key,
            load: selectedReport[key],
          });
          break;
        case 'object':
          dispatch({
            type: 'ADD-ARR',
            name: key,
            load: selectedReport[key],
          });
          break;
        case 'number':
          setTotal(selectedReport[key]);
          break;
        default:
          break;
      }
    });

    setHide(false);
  };

  return (
    <Container>
      <Content>
        <Header>
          <div>
            <Tag>Saved Reports</Tag>
            <h3>Choose a report to review</h3>
          </div>
          <Count>{(state.reports || []).length} saved</Count>
        </Header>

        <select onChange={handleChange} defaultValue="">
          <option value="" disabled>
            Choose a report to view
          </option>
          {(state.reports || []).map((report) => (
            <option key={report.id} value={report.id}>
              {report.landLord} - {report.crop} ({report.year})
            </option>
          ))}
        </select>
      </Content>
    </Container>
  );
}

const Container = styled.section`
  @media print {
    display: none;
  }
`;

const Content = styled.div`
  padding: 16px 18px;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: var(--paper);
  box-shadow: var(--shadow);
  display: grid;
  gap: 10px;

  select {
    width: 100%;
    padding: 11px 12px;
    border: 1px solid rgba(52, 88, 66, 0.18);
    border-radius: var(--radius-sm);
    background: rgba(255, 255, 255, 0.84);
  }

  select:focus {
    outline: none;
    border-color: rgba(52, 88, 66, 0.42);
    box-shadow: 0 0 0 4px rgba(52, 88, 66, 0.08);
  }

  @media (min-width: 768px) and (max-width: 834px) and (orientation: portrait) {
    padding: 14px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;

  h3 {
    font-size: 1.3rem;
  }

  @media (min-width: 768px) and (max-width: 834px) and (orientation: portrait) {
    h3 {
      font-size: 1.12rem;
    }
  }
`;

const Tag = styled.p`
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.74rem;
  font-weight: 700;
  color: var(--accent);
`;

const Count = styled.span`
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(52, 88, 66, 0.08);
  color: var(--brand-strong);
  font-weight: 700;
`;

export default ReportSelect;
