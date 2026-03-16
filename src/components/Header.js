import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { auth } from '../data';

function Header({ setUser, user }) {
  const signOut = () => {
    auth.signOut();
    setUser('');
  };

  return (
    <Wrap>
      <Container>
        <BrandBlock>
          <Eyebrow>Farm Report 3.0</Eyebrow>
          <BrandTitle>Year-end expense summaries with a cleaner workspace.</BrandTitle>
          <BrandText>
            Build a report, reopen a past season, or maintain your expense options from one place.
          </BrandText>
        </BrandBlock>

        <Nav>
          <NavItem exact to="/">
            New Report
          </NavItem>
          <NavItem to="/View">View Reports</NavItem>
          <NavItem to="/Add">Manage Options</NavItem>
        </Nav>

        <UserBlock>
          <UserBadge>{user}</UserBadge>
          <LogoutButton type="button" onClick={signOut}>
            Logout
          </LogoutButton>
        </UserBlock>
      </Container>
    </Wrap>
  );
}

const Wrap = styled.header`
  position: relative;
  z-index: 1;
  padding: 14px 16px 0;

  @media print {
    display: none;
  }
`;

const Container = styled.div`
  width: min(1240px, calc(100vw - 32px));
  margin: 0 auto;
  padding: 18px 20px;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, rgba(255, 250, 242, 0.94), rgba(249, 243, 228, 0.92));
  box-shadow: var(--shadow);
  backdrop-filter: blur(14px);
  display: grid;
  gap: 14px;
  align-items: center;
  grid-template-columns: 1.4fr 1fr auto;

  @media (max-width: 1024px) {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 720px) {
    width: min(100vw - 20px, 1240px);
    padding: 16px;
  }
`;

const BrandBlock = styled.div`
  display: grid;
  gap: 4px;

  @media (max-width: 1024px) {
    gap: 2px;
  }
`;

const Eyebrow = styled.p`
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-size: 0.73rem;
  font-weight: 700;
  color: var(--accent);
`;

const BrandTitle = styled.h1`
  font-size: clamp(1.5rem, 2.2vw, 2.15rem);
  line-height: 1.05;

  @media (max-width: 1024px) {
    font-size: clamp(1.35rem, 2vw, 1.8rem);
  }
`;

const BrandText = styled.p`
  max-width: 44rem;
  color: var(--muted);
  font-size: 1rem;

  @media (max-width: 1024px) {
    font-size: 0.94rem;
  }

  @media (max-width: 820px) {
    display: none;
  }
`;

const Nav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  @media (max-width: 1024px) {
    grid-column: 1 / -1;
  }
`;

const NavItem = styled(NavLink)`
  padding: 10px 14px;
  border-radius: 999px;
  text-decoration: none;
  color: var(--muted);
  font-weight: 700;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid transparent;
  transition: 180ms ease;

  &:hover {
    color: var(--ink);
    border-color: rgba(52, 88, 66, 0.14);
  }

  &.active {
    color: white;
    background: linear-gradient(135deg, var(--brand), var(--brand-strong));
    box-shadow: 0 10px 24px rgba(52, 88, 66, 0.28);
  }
`;

const UserBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 820px) {
    justify-content: flex-start;
  }
`;

const UserBadge = styled.span`
  padding: 9px 12px;
  border-radius: 999px;
  background: rgba(52, 88, 66, 0.08);
  color: var(--brand-strong);
  font-weight: 700;
`;

const LogoutButton = styled.button`
  padding: 10px 16px;
  border: none;
  border-radius: 999px;
  color: white;
  background: linear-gradient(135deg, #bb6245, var(--danger));
  font-weight: 700;
  box-shadow: 0 14px 24px rgba(173, 76, 57, 0.24);
`;

export default Header;
