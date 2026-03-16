import React from 'react';
import styled from 'styled-components';
import { writeReport } from '../data';
import Row from './Row';

function Text({ clearContext, removeItem, body, total, head }) {
  const hasHeader = Boolean(head.ll && head.cp && head.yr);
  const sections = Object.keys(body || {}).filter((key) => body[key] && body[key].length > 0);

  const saveReport = () => {
    const obj = {
      id: Date.now().toString(),
      landLord: head.ll,
      seedList: body.seed,
      crop: head.cp,
      year: head.yr,
      chemList: body.chemicals,
      fertList: body.fertilizer,
      fuelList: body.fuel,
      truckingList: body.trucking,
      insList: body.insurance,
      misc: body.misc,
      total,
    };

    writeReport(obj);
  };

  return (
    <Container>
      <HeaderCard>
        <PreviewTag>Live Preview</PreviewTag>
        <Title>{hasHeader ? `${head.ll} ${head.cp} ${head.yr}` : 'Start with the report details.'}</Title>
        <SummaryGrid>
          <SummaryTile>
            <span>Landlord</span>
            <strong>{head.ll || 'Not selected'}</strong>
          </SummaryTile>
          <SummaryTile>
            <span>Crop</span>
            <strong>{head.cp || 'Not selected'}</strong>
          </SummaryTile>
          <SummaryTile>
            <span>Year</span>
            <strong>{head.yr || 'Not selected'}</strong>
          </SummaryTile>
        </SummaryGrid>
      </HeaderCard>

      {sections.length ? (
        <Body>
          {sections.map((key) => (
            <Row key={key} head={key} arr={body[key]} removeItem={removeItem} />
          ))}
        </Body>
      ) : (
        <EmptyState>
          <h4>No expense lines yet</h4>
          <p>Add expenses from the control panel to build the printable summary.</p>
        </EmptyState>
      )}

      <FooterCard>
        <TotalBlock>
          <span>Total Billed</span>
          <strong>${total.toFixed(2)}</strong>
        </TotalBlock>

        {hasHeader ? (
          <Actions>
            <ActionButton type="button" onClick={saveReport}>
              Save
            </ActionButton>
            <SecondaryButton type="button" onClick={() => window.print()}>
              Print
            </SecondaryButton>
            {clearContext ? (
              <DangerButton type="button" onClick={clearContext}>
                Clear Sheet
              </DangerButton>
            ) : null}
          </Actions>
        ) : (
          <ActionHint>Choose landlord, crop, and year before saving the report.</ActionHint>
        )}
      </FooterCard>
    </Container>
  );
}

const iPadLandscapeMedia = '@media (min-width: 835px) and (max-width: 1180px)';
const iPadPortraitMedia = '@media (min-width: 768px) and (max-width: 834px) and (orientation: portrait)';

const Container = styled.section`
  display: grid;
  gap: 14px;
  width: 100%;

  @media print {
    gap: 12px;
  }
`;

const HeaderCard = styled.section`
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: linear-gradient(145deg, rgba(255, 253, 249, 0.98), rgba(247, 239, 225, 0.92));
  box-shadow: var(--shadow);

  @media print {
    padding: 0 0 10px;
    border: none;
    border-radius: 0;
    box-shadow: none;
    background: transparent;
  }

  ${iPadLandscapeMedia} {
    display: grid;
    gap: 14px;
    grid-template-columns: minmax(0, 1.2fr) minmax(260px, 0.8fr);
    align-items: start;
  }
`;

const PreviewTag = styled.p`
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.74rem;
  font-weight: 700;
  color: var(--accent);

  @media print {
    display: none;
  }
`;

const Title = styled.h2`
  font-size: clamp(1.8rem, 2.8vw, 2.5rem);
  line-height: 1;

  ${iPadLandscapeMedia} {
    margin-right: 16px;
  }

  ${iPadPortraitMedia} {
    font-size: 1.55rem;
  }
`;

const SummaryGrid = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: 14px;

  ${iPadLandscapeMedia} {
    grid-template-columns: 1fr;
    margin-top: 0;
  }

  ${iPadPortraitMedia} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }

  @media print {
    margin-top: 12px;
  }
`;

const SummaryTile = styled.div`
  padding: 12px 14px;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(52, 88, 66, 0.1);
  display: grid;
  gap: 4px;

  span {
    font-size: 0.82rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--muted);
    font-weight: 700;
  }

  strong {
    font-size: 1.05rem;
  }

  @media print {
    padding: 8px 0;
    border: none;
    background: transparent;
  }

  ${iPadPortraitMedia} {
    padding: 10px 12px;

    strong {
      font-size: 0.95rem;
    }
  }
`;

const Body = styled.div`
  display: grid;
  gap: 12px;

  ${iPadLandscapeMedia} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;
  }

  @media (min-width: 1180px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;
  }

  @media print {
    grid-template-columns: 1fr;
  }
`;

const EmptyState = styled.section`
  padding: 22px;
  border: 1px dashed rgba(52, 88, 66, 0.24);
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.4);
  text-align: center;

  h4 {
    margin-bottom: 8px;
    font-size: 1.45rem;
  }

  p {
    color: var(--muted);
  }

  @media print {
    display: none;
  }
`;

const FooterCard = styled.section`
  padding: 14px 18px;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: rgba(255, 253, 249, 0.92);
  box-shadow: var(--shadow);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;

  @media print {
    padding: 12px 0 0;
    border: none;
    border-top: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 0;
    background: transparent;
    box-shadow: none;
  }

  ${iPadPortraitMedia} {
    padding: 12px 14px;
  }
`;

const TotalBlock = styled.div`
  display: grid;
  gap: 4px;

  span {
    color: var(--muted);
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 700;
  }

  strong {
    font-size: clamp(1.5rem, 2vw, 2.1rem);
    color: var(--brand-strong);
  }
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  ${iPadPortraitMedia} {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media print {
    display: none;
  }
`;

const ActionButton = styled.button`
  padding: 10px 16px;
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--brand), var(--brand-strong));
  color: white;
  font-weight: 700;
  box-shadow: 0 14px 24px rgba(52, 88, 66, 0.22);

  ${iPadPortraitMedia} {
    padding: 10px 12px;
    font-size: 0.9rem;
  }
`;

const SecondaryButton = styled(ActionButton)`
  background: linear-gradient(135deg, var(--accent), #db8c4d);
  box-shadow: 0 14px 24px rgba(199, 115, 47, 0.2);
`;

const DangerButton = styled(ActionButton)`
  background: linear-gradient(135deg, #bb6245, var(--danger));
  box-shadow: 0 14px 24px rgba(173, 76, 57, 0.2);
`;

const ActionHint = styled.p`
  color: var(--muted);
  font-weight: 600;

  @media print {
    display: none;
  }
`;

export default Text;
