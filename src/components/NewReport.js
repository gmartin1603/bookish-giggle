import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNewValue } from '../context/providers/NewProvider';
import { getData } from '../data';
import Text from './Text';

function NewReport() {
  const [state, dispatch] = useNewValue();

  const [optionList, setOptionList] = useState([]);
  const [cat, setCat] = useState('');
  const [itm, setItm] = useState('');
  const [price, setPrice] = useState('');
  const [chk, setChk] = useState('');
  const [qty, setQty] = useState('');
  const [disa, setDisa] = useState(true);
  const [units, setUnits] = useState([]);
  const [unit, setUnit] = useState('');
  const [total, setTotal] = useState(0);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  useEffect(() => {
    getData('labels-4.0', dispatch);
    getData('expenses-4.0', dispatch);
  }, [dispatch]);

  useEffect(() => {
    const canAdd = Boolean(cat && itm && chk && Number(qty) > 0 && Number(price) > 0);
    setDisa(!canAdd);
  }, [cat, itm, chk, qty, price]);

  const clearLocalExpenseState = () => {
    setOptionList([]);
    setCat('');
    setItm('');
    setPrice('');
    setQty('');
    setChk('');
    setUnits([]);
    setUnit('');
    setDisa(true);
  };

  const clearContext = () => {
    dispatch({
      type: 'RESET',
    });
    setTotal(0);
    setIsExpenseModalOpen(false);
    clearLocalExpenseState();

    const headingForm = document.getElementById('heading');
    const expenseForm = document.getElementById('expense');

    if (headingForm) {
      headingForm.reset();
    }

    if (expenseForm) {
      expenseForm.reset();
    }
  };

  const clearExpenseForm = () => {
    const expenseForm = document.getElementById('expense');

    if (expenseForm) {
      expenseForm.reset();
    }

    clearLocalExpenseState();
  };

  const handleChange = (event) => {
    const value = event.target.value;
    const selectedExpense = (state['expenses-4.0'] || []).find((item) => item.id === value);

    setCat(value);
    setItm('');
    setChk('');
    setUnit('');
    setUnits([]);
    setOptionList(selectedExpense?.options || []);

    if (selectedExpense?.units?.length === 1) {
      setUnit(selectedExpense.units[0]);
      setChk(selectedExpense.units[0]);
      return;
    }

    if (selectedExpense?.units?.length > 1) {
      setUnits(selectedExpense.units);
    }
  };

  const addExpense = (event) => {
    event.preventDefault();

    const numericPrice = Number(price);
    const numericQty = Number(qty);
    const obj = {
      id: Date.now(),
      name: itm,
      price: numericPrice,
      qty: numericQty,
      unit: chk,
      arr: cat,
    };

    setTotal((currentTotal) => currentTotal + numericQty * numericPrice);

    dispatch({
      type: 'ADD-OBJ',
      name: cat,
      load: obj,
    });

    clearExpenseForm();
    setIsExpenseModalOpen(false);
  };

  const removeItem = (arr, attr, value) => {
    const source = state[arr] || [];
    let nextTotal = total;
    const nextArray = [];

    for (let index = source.length - 1; index >= 0; index -= 1) {
      const item = source[index];

      if (item && Object.prototype.hasOwnProperty.call(item, attr) && item[attr] === value) {
        nextTotal -= Number(item.qty) * Number(item.price);
      } else {
        nextArray.splice(0, 0, item);
      }
    }

    setTotal(nextTotal);
    dispatch({
      type: 'UPDATE',
      name: arr,
      load: nextArray,
    });
  };

  return (
    <Page>
      <PageHeader>
        <Eyebrow>Create a report</Eyebrow>
        <Title>Build this season's expense summary.</Title>
        <Description>
          Fill in the heading, add expense lines, and keep a live preview ready for printing or saving.
        </Description>
      </PageHeader>

      <Layout>
        <Sidebar>
          <Card>
            <CardHeader>
              <CardTitle>Report Details</CardTitle>
              <CardText>Choose the landlord, crop, and year before you save the report.</CardText>
            </CardHeader>

            <Form id="heading">
              {(state['labels-4.0'] || []).map((obj) => (
                <Field key={obj.id} $span={1}>
                  <label htmlFor={obj.id}>{obj.label}</label>
                  <select
                    id={obj.id}
                    name={obj.id}
                    onChange={(event) =>
                      dispatch({
                        type: 'ADD-STRING',
                        name: event.target.name,
                        load: event.target.value,
                      })
                    }
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Choose here
                    </option>
                    {(obj.options || []).map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </Field>
              ))}
            </Form>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add Expense</CardTitle>
              <CardText>Pick a category, select the item, then enter units, quantity, and price.</CardText>
            </CardHeader>

            <CompactRow>
              <TriggerButton type="button" onClick={() => setIsExpenseModalOpen(true)}>
                Add Expense Line
              </TriggerButton>
              <CompactHint>
                Open a focused form for category, unit, quantity, and price.
              </CompactHint>
            </CompactRow>
          </Card>
        </Sidebar>

        <PreviewColumn>
          <Text
            head={{
              ll: state.landLord,
              yr: state.year,
              cp: state.crop,
            }}
            body={{
              seed: state.seedList,
              chemicals: state.chemList,
              fertilizer: state.fertList,
              fuel: state.fuelList,
              trucking: state.truckingList,
              insurance: state.insList,
              misc: state.misc,
            }}
            total={total}
            removeItem={removeItem}
            clearContext={clearContext}
          />
        </PreviewColumn>
      </Layout>

      {isExpenseModalOpen ? (
        <ModalOverlay role="presentation" onClick={() => setIsExpenseModalOpen(false)}>
          <ModalCard role="dialog" aria-modal="true" aria-labelledby="new-expense-modal" onClick={(event) => event.stopPropagation()}>
            <ModalHeader>
              <div>
                <ModalTitle id="new-expense-modal">Add Expense</ModalTitle>
                <ModalText>Choose the category, item, unit, quantity, and rate for this line.</ModalText>
              </div>
              <CloseButton type="button" onClick={() => setIsExpenseModalOpen(false)}>
                Close
              </CloseButton>
            </ModalHeader>

            <Form id="expense" onSubmit={addExpense}>
              <Field $span={1}>
                <label htmlFor="expense-category">Expense Category</label>
                <select id="expense-category" name="expense" onChange={handleChange} defaultValue="">
                  <option value="" disabled>
                    Choose here
                  </option>
                  {(state['expenses-4.0'] || []).map((obj) => (
                    <option key={obj.id} value={obj.id}>
                      {obj.label}
                    </option>
                  ))}
                </select>
              </Field>

              {optionList.length > 0 && cat ? (
                <Field $span={1}>
                  <label htmlFor="expense-item">Expense Item</label>
                  <select
                    id="expense-item"
                    name={cat}
                    onChange={(event) => setItm(event.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Choose here
                    </option>
                    {optionList.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </Field>
              ) : null}

              {units.length > 0 && cat ? (
                <Field $span={2}>
                  <label>Unit of Measure</label>
                  <ChoiceGrid>
                    {units.map((nextUnit) => {
                      const inputId = `new-unit-${nextUnit}`;

                      return (
                        <ChoiceLabel key={nextUnit} htmlFor={inputId}>
                          <input
                            id={inputId}
                            type="radio"
                            name="expense-unit"
                            value={nextUnit}
                            checked={chk === nextUnit}
                            onChange={(event) => setChk(event.target.value)}
                          />
                          <span>{nextUnit}</span>
                        </ChoiceLabel>
                      );
                    })}
                  </ChoiceGrid>
                </Field>
              ) : null}

              {unit && cat ? (
                <Field $span={2}>
                  <label>Unit of Measure</label>
                  <StaticChoice>{unit}</StaticChoice>
                </Field>
              ) : null}

              <InlineFields>
                <Field>
                  <label htmlFor="qty">Quantity</label>
                  <input
                    id="qty"
                    placeholder="QTY"
                    name="qty"
                    type="number"
                    min="0"
                    step="any"
                    value={qty}
                    onChange={(event) => setQty(event.target.value)}
                  />
                </Field>

                <Field>
                  <label htmlFor="price">Price Per Unit</label>
                  <input
                    id="price"
                    placeholder="Price"
                    name="price"
                    type="number"
                    min="0"
                    step="any"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                  />
                </Field>
              </InlineFields>

              <SubmitButton type="submit" disabled={disa}>
                Add Expense Line
              </SubmitButton>
            </Form>
          </ModalCard>
        </ModalOverlay>
      ) : null}
    </Page>
  );
}

const iPadLandscapeMedia = '@media (min-width: 835px) and (max-width: 1180px)';
const iPadPortraitMedia = '@media (min-width: 768px) and (max-width: 834px) and (orientation: portrait)';

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
  grid-template-columns: 1fr;
  align-items: start;

  @media (min-width: 1024px) {
    grid-template-columns: minmax(360px, 420px) minmax(0, 1fr);
  }

  @media (min-width: 1180px) {
    grid-template-columns: minmax(390px, 460px) minmax(0, 1fr);
  }

  @media print {
    display: block;
  }
`;

const Sidebar = styled.div`
  display: grid;
  gap: 14px;
  align-self: start;

  ${iPadLandscapeMedia} {
    grid-template-columns: minmax(250px, 0.85fr) minmax(320px, 1.15fr);
    align-items: start;
  }

  ${iPadPortraitMedia} {
    grid-template-columns: minmax(200px, 228px) minmax(0, 1fr);
    align-items: start;
  }

  @media (min-width: 1024px) {
    position: sticky;
    top: 14px;
    max-height: calc(100vh - 28px);
    overflow: auto;
    padding-right: 4px;
  }

  @media print {
    display: none;
  }
`;

const PreviewColumn = styled.div`
  min-width: 0;
`;

const Card = styled.section`
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: var(--paper);
  box-shadow: var(--shadow);
  backdrop-filter: blur(12px);

  ${iPadPortraitMedia} {
    padding: 14px;
  }
`;

const CardHeader = styled.div`
  display: grid;
  gap: 4px;
  margin-bottom: 12px;
`;

const CardTitle = styled.h3`
  font-size: 1.4rem;

  ${iPadPortraitMedia} {
    font-size: 1.16rem;
  }
`;

const CardText = styled.p`
  color: var(--muted);

  ${iPadPortraitMedia} {
    font-size: 0.9rem;
  }
`;

const Form = styled.form`
  display: grid;
  gap: 12px;

  &#heading {
    grid-template-columns: 1fr;
    align-items: end;
  }

  &#expense {
    grid-template-columns: 1fr;
    align-items: end;
  }

  ${iPadLandscapeMedia} {
    &#heading {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    &#expense {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  ${iPadPortraitMedia} {
    &#heading {
      grid-template-columns: 1fr;
    }

    &#expense {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    &#expense > *:first-child {
      grid-column: 1 / -1;
    }
  }

  @media (min-width: 1024px) {
    &#expense {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 680px) {
    &#heading,
    &#expense {
      grid-template-columns: 1fr;
    }
  }
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
    transition: border-color 160ms ease, box-shadow 160ms ease;
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

  ${iPadPortraitMedia} {
    label {
      font-size: 0.84rem;
    }

    input,
    select {
      padding: 10px 11px;
      font-size: 0.92rem;
    }
  }
`;

const InlineFields = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-column: 1 / -1;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const ChoiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(92px, 1fr));
  gap: 8px;

  ${iPadPortraitMedia} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const ChoiceLabel = styled.label`
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

  ${iPadPortraitMedia} {
    span {
      font-size: 0.84rem;
    }
  }

  input:checked + span {
    color: white;
    border-color: transparent;
    background: linear-gradient(135deg, var(--brand), var(--brand-strong));
    box-shadow: 0 10px 20px rgba(52, 88, 66, 0.24);
  }
`;

const StaticChoice = styled.div`
  padding: 9px 12px;
  border-radius: 999px;
  background: rgba(52, 88, 66, 0.09);
  color: var(--brand-strong);
  font-weight: 700;
  text-align: center;
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

  ${iPadPortraitMedia} {
    width: 100%;
    min-width: 0;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const CompactRow = styled.div`
  display: grid;
  gap: 10px;
`;

const TriggerButton = styled.button`
  padding: 12px 16px;
  border: none;
  border-radius: 999px;
  color: white;
  background: linear-gradient(135deg, var(--accent), #db8c4d);
  font-weight: 700;
  box-shadow: 0 16px 28px rgba(199, 115, 47, 0.24);
  justify-self: start;
`;

const CompactHint = styled.p`
  color: var(--muted);
  font-size: 0.92rem;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 30;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(28, 35, 29, 0.42);
  backdrop-filter: blur(8px);

  @media print {
    display: none;
  }
`;

const ModalCard = styled.section`
  width: min(760px, 100%);
  max-height: min(88vh, 920px);
  overflow: auto;
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: rgba(255, 251, 245, 0.98);
  box-shadow: 0 28px 60px rgba(28, 35, 29, 0.28);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const ModalTitle = styled.h3`
  font-size: 1.4rem;
`;

const ModalText = styled.p`
  margin-top: 4px;
  color: var(--muted);
`;

const CloseButton = styled.button`
  padding: 10px 14px;
  border-radius: 999px;
  border: 1px solid rgba(52, 88, 66, 0.16);
  background: rgba(255, 255, 255, 0.9);
  color: var(--ink);
  font-weight: 700;
`;

export default NewReport;
