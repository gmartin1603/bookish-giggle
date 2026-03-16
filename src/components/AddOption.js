import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useAddValue } from '../context/providers/AddProvider';
import { getData, writeData } from '../data';

const units = ['Gal', 'Lb', 'Oz', 'Ton', 'Bu', 'Mile', 'Bag', 'Acre'];

const modeContent = {
  head: {
    title: 'Add Heading Option',
    description: 'Extend dropdowns like landlord, crop, or year without touching the code.',
  },
  exp: {
    title: 'Add Expense Option',
    description: 'Add new selectable items to an existing expense category.',
  },
  units: {
    title: 'Assign Units',
    description: 'Choose which units should be available for a specific expense category.',
  },
};

function AddOption() {
  const [state, dispatch] = useAddValue();
  const [mode, setMode] = useState('head');
  const [optionList, setOptionList] = useState([]);
  const [text, setText] = useState('');
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [selectedId, setSelectedId] = useState('');

  useEffect(() => {
    getData('labels-4.0', dispatch);
    getData('expenses-4.0', dispatch);
  }, [dispatch]);

  const collection = mode === 'head' ? 'labels-4.0' : 'expenses-4.0';
  const records = useMemo(() => state[collection] || [], [collection, state]);
  const selectedRecord = useMemo(
    () => records.find((item) => item.id === selectedId),
    [records, selectedId]
  );
  const content = modeContent[mode];

  useEffect(() => {
    setSelectedId('');
    setText('');
    setSelectedUnits([]);
    setOptionList([]);
  }, [mode]);

  const formatText = (value) => {
    if (!value.length) {
      setText('');
      return;
    }

    const first = value.charAt(0).toUpperCase();
    const rest = value.substring(1);
    setText(`${first}${rest}`);
  };

  const handleCollectionChange = (event) => {
    const nextId = event.target.value;
    const nextRecord = records.find((item) => item.id === nextId);

    setSelectedId(nextId);
    setOptionList(nextRecord?.options || []);
    setSelectedUnits(nextRecord?.units || []);
    setText('');
  };

  const handleUnitToggle = (event) => {
    if (event.target.checked) {
      setSelectedUnits((current) => [...current, event.target.value]);
      return;
    }

    setSelectedUnits((current) => current.filter((item) => item !== event.target.value));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedRecord) {
      return;
    }

    if (mode === 'units') {
      writeData(collection, selectedId, 'units', selectedUnits);
      return;
    }

    const load = text.trim();
    const nextOptions = [...(selectedRecord.options || [])];

    if (nextOptions.includes(load)) {
      alert('Option already exists in the database');
      setText('');
      return;
    }

    nextOptions.push(load);
    writeData(collection, selectedId, 'options', nextOptions);
    setOptionList(nextOptions);
    setText('');
  };

  const canSubmit = mode === 'units' ? Boolean(selectedId && selectedUnits.length) : Boolean(selectedId && text.trim());

  return (
    <Page>
      <PageHeader>
        <Eyebrow>Data maintenance</Eyebrow>
        <Title>Keep report options organized.</Title>
        <Description>
          Add new heading values, expand expense picklists, or update which units belong to each category.
        </Description>
      </PageHeader>

      <Layout>
        <Card>
          <ModeGrid>
            <ModeButton type="button" $active={mode === 'head'} onClick={() => setMode('head')}>
              Heading Option
            </ModeButton>
            <ModeButton type="button" $active={mode === 'exp'} onClick={() => setMode('exp')}>
              Expense Option
            </ModeButton>
            <ModeButton type="button" $active={mode === 'units'} onClick={() => setMode('units')}>
              Assign Units
            </ModeButton>
          </ModeGrid>

          <Form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>{content.title}</CardTitle>
              <CardText>{content.description}</CardText>
            </CardHeader>

            <Field $span={1}>
              <label htmlFor="option-target">Choose a category</label>
              <select id="option-target" onChange={handleCollectionChange} value={selectedId}>
                <option value="" disabled>
                  Choose here
                </option>
                {records.map((obj) => (
                  <option key={obj.id} value={obj.id}>
                    {obj.label}
                  </option>
                ))}
              </select>
            </Field>

            {mode !== 'units' ? (
              <Field $span={1}>
                <label htmlFor="option-text">New option</label>
                <input
                  id="option-text"
                  type="text"
                  value={text}
                  onChange={(event) => formatText(event.target.value)}
                  placeholder="Type the new option"
                  disabled={!selectedId}
                />
              </Field>
            ) : (
              <Field $span={2}>
                <label>Units available for this category</label>
                <UnitGrid>
                  {units.map((unit) => {
                    const inputId = `unit-${unit}`;

                    return (
                      <UnitLabel key={unit} htmlFor={inputId}>
                        <input
                          id={inputId}
                          type="checkbox"
                          value={unit}
                          checked={selectedUnits.includes(unit)}
                          onChange={handleUnitToggle}
                          disabled={!selectedId}
                        />
                        <span>{unit}</span>
                      </UnitLabel>
                    );
                  })}
                </UnitGrid>
              </Field>
            )}

            <SubmitButton type="submit" disabled={!canSubmit}>
              Save Changes
            </SubmitButton>
          </Form>
        </Card>

        <SideCard>
          <CardHeader>
            <CardTitle>Current Options</CardTitle>
            <CardText>
              Review what's already available before adding duplicates or changing unit selections.
            </CardText>
          </CardHeader>

          {mode === 'units' ? (
            <ChipGrid>
              {(selectedUnits.length ? selectedUnits : selectedRecord?.units || []).map((item) => (
                <Chip key={item}>{item}</Chip>
              ))}
              {!selectedId && <EmptyText>Select a category to see assigned units.</EmptyText>}
            </ChipGrid>
          ) : (
            <ChipGrid>
              {optionList.map((item) => (
                <Chip key={item}>{item}</Chip>
              ))}
              {!selectedId && <EmptyText>Select a category to see existing options.</EmptyText>}
            </ChipGrid>
          )}
        </SideCard>
      </Layout>
    </Page>
  );
}

const Page = styled.section`
  display: grid;
  gap: 16px;
`;

const PageHeader = styled.header`
  display: grid;
  gap: 4px;
  padding: 4px 4px 0;
`;

const Eyebrow = styled.p`
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.74rem;
  font-weight: 700;
  color: var(--accent);
`;

const Title = styled.h2`
  font-size: clamp(2rem, 3.1vw, 3rem);
  line-height: 1;
`;

const Description = styled.p`
  max-width: 52rem;
  color: var(--muted);
  font-size: 0.98rem;
`;

const Layout = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: minmax(0, 1.1fr) minmax(280px, 360px);
  align-items: start;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.section`
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: var(--paper);
  box-shadow: var(--shadow);
  backdrop-filter: blur(12px);
`;

const SideCard = styled(Card)`
  @media print {
    display: none;
  }
`;

const ModeGrid = styled.div`
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-bottom: 12px;

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

const ModeButton = styled.button`
  padding: 11px 12px;
  border-radius: var(--radius-md);
  border: 1px solid ${(props) => (props.$active ? 'transparent' : 'rgba(52, 88, 66, 0.14)')};
  background: ${(props) =>
    props.$active
      ? 'linear-gradient(135deg, var(--brand), var(--brand-strong))'
      : 'rgba(255, 255, 255, 0.6)'};
  color: ${(props) => (props.$active ? 'white' : 'var(--ink)')};
  font-weight: 700;
  box-shadow: ${(props) => (props.$active ? '0 14px 28px rgba(52, 88, 66, 0.22)' : 'none')};
`;

const Form = styled.form`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: end;

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`;

const CardHeader = styled.div`
  display: grid;
  gap: 4px;
  grid-column: 1 / -1;
`;

const CardTitle = styled.h3`
  font-size: 1.4rem;
`;

const CardText = styled.p`
  color: var(--muted);
`;

const Field = styled.div`
  display: grid;
  gap: 6px;
  grid-column: span ${(props) => props.$span || 1};

  label {
    color: var(--brand-strong);
    font-weight: 700;
    font-size: 0.92rem;
  }

  input,
  select {
    width: 100%;
    padding: 11px 12px;
    border: 1px solid rgba(52, 88, 66, 0.18);
    border-radius: var(--radius-sm);
    background: rgba(255, 255, 255, 0.86);
    color: var(--ink);
  }

  input:focus,
  select:focus {
    outline: none;
    border-color: rgba(52, 88, 66, 0.42);
    box-shadow: 0 0 0 4px rgba(52, 88, 66, 0.08);
  }

  @media (max-width: 680px) {
    grid-column: span 1;
  }
`;

const UnitGrid = styled.div`
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(auto-fit, minmax(92px, 1fr));
`;

const UnitLabel = styled.label`
  position: relative;
  cursor: pointer;

  input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  span {
    display: block;
    padding: 9px 10px;
    border-radius: 999px;
    border: 1px solid rgba(52, 88, 66, 0.16);
    background: rgba(255, 255, 255, 0.75);
    text-align: center;
    font-weight: 700;
    color: var(--muted);
    transition: 160ms ease;
  }

  input:checked + span {
    color: white;
    border-color: transparent;
    background: linear-gradient(135deg, var(--brand), var(--brand-strong));
    box-shadow: 0 10px 20px rgba(52, 88, 66, 0.24);
  }

  input:disabled + span {
    opacity: 0.45;
  }
`;

const SubmitButton = styled.button`
  padding: 12px 16px;
  border: none;
  border-radius: 999px;
  color: white;
  background: linear-gradient(135deg, var(--accent), #db8c4d);
  font-weight: 700;
  box-shadow: 0 16px 28px rgba(199, 115, 47, 0.24);
  grid-column: 1 / -1;

  @media (min-width: 681px) {
    justify-self: start;
    min-width: 180px;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const ChipGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 6px;
`;

const Chip = styled.span`
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(52, 88, 66, 0.08);
  color: var(--brand-strong);
  font-weight: 700;
`;

const EmptyText = styled.p`
  color: var(--muted);
`;

export default AddOption;
