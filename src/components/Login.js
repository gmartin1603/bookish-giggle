import React, { useState } from 'react';
import styled from 'styled-components';
import { auth, googleProvider } from '../data';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const login = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setError('');
    setGoogleLoading(true);

    try {
      await auth.signInWithPopup(googleProvider);
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <Shell>
      <Backdrop />
      <Layout>
        <IntroCard>
          <Eyebrow>Farm Report 3.0</Eyebrow>
          <HeroTitle>Organize the season without fighting the screen.</HeroTitle>
          <HeroText>
            Sign in to build polished year-end expense summaries, reopen saved reports, and keep your categories tidy.
          </HeroText>
          <FeatureList>
            <li>Create printable landlord and crop reports</li>
            <li>Review older reports before making updates</li>
            <li>Manage headings, expense options, and units</li>
          </FeatureList>
        </IntroCard>

        <Card>
          <CardHeader>
            <CardEyebrow>Welcome back</CardEyebrow>
            <CardTitle>Sign in to continue</CardTitle>
            <CardText>Use your Farm Report account credentials to open the dashboard.</CardText>
          </CardHeader>

          <Form onSubmit={login}>
            <Field>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="farmer@example.com"
                autoComplete="username"
              />
            </Field>

            <Field>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </Field>

            {error ? <ErrorMessage>{error}</ErrorMessage> : null}

            <SubmitButton type="submit" disabled={!email || !password || loading}>
              {loading ? 'Signing In...' : 'Login'}
            </SubmitButton>

            <Divider>
              <span>or</span>
            </Divider>

            <GoogleButton type="button" onClick={loginWithGoogle} disabled={googleLoading || loading}>
              <GoogleMark aria-hidden="true">G</GoogleMark>
              {googleLoading ? 'Opening Google...' : 'Continue with Google'}
            </GoogleButton>
          </Form>
        </Card>
      </Layout>
    </Shell>
  );
}

const Shell = styled.div`
  position: relative;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 28px 16px;
`;

const Backdrop = styled.div`
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at top left, rgba(199, 115, 47, 0.22), transparent 34%),
    radial-gradient(circle at bottom right, rgba(52, 88, 66, 0.24), transparent 30%);
  pointer-events: none;
`;

const Layout = styled.div`
  position: relative;
  z-index: 1;
  width: min(1120px, 100%);
  display: grid;
  gap: 24px;
  grid-template-columns: 1.1fr minmax(320px, 420px);

  @media (max-width: 880px) {
    grid-template-columns: 1fr;
  }
`;

const IntroCard = styled.section`
  padding: 36px;
  border-radius: calc(var(--radius-lg) + 4px);
  background: linear-gradient(145deg, rgba(38, 66, 50, 0.95), rgba(60, 95, 73, 0.92));
  color: #f7f2e9;
  box-shadow: var(--shadow);
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    width: 220px;
    height: 220px;
    right: -40px;
    bottom: -80px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.06);
  }

  @media (max-width: 720px) {
    padding: 24px;
  }
`;

const Eyebrow = styled.p`
  margin-bottom: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-size: 0.75rem;
  font-weight: 700;
  color: #f4ca9a;
`;

const HeroTitle = styled.h1`
  font-size: clamp(2.2rem, 4vw, 4rem);
  line-height: 0.98;
  max-width: 12ch;
`;

const HeroText = styled.p`
  margin-top: 16px;
  max-width: 34rem;
  font-size: 1.05rem;
  line-height: 1.6;
  color: rgba(247, 242, 233, 0.82);
`;

const FeatureList = styled.ul`
  margin: 28px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 12px;

  li {
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: 600;
  }

  li::before {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: #f4ca9a;
    box-shadow: 0 0 0 6px rgba(244, 202, 154, 0.14);
  }
`;

const Card = styled.section`
  padding: 28px;
  border: 1px solid var(--line);
  border-radius: calc(var(--radius-lg) + 4px);
  background: linear-gradient(180deg, rgba(255, 253, 249, 0.96), rgba(249, 244, 233, 0.94));
  box-shadow: var(--shadow);
  backdrop-filter: blur(18px);
`;

const CardHeader = styled.div`
  display: grid;
  gap: 6px;
  margin-bottom: 20px;
`;

const CardEyebrow = styled.p`
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.74rem;
  font-weight: 700;
  color: var(--accent);
`;

const CardTitle = styled.h2`
  font-size: 2rem;
`;

const CardText = styled.p`
  color: var(--muted);
`;

const Form = styled.form`
  display: grid;
  gap: 16px;
`;

const Field = styled.div`
  display: grid;
  gap: 8px;

  label {
    font-weight: 700;
    color: var(--brand-strong);
  }

  input {
    width: 100%;
    padding: 14px 16px;
    border: 1px solid rgba(52, 88, 66, 0.18);
    border-radius: var(--radius-sm);
    background: rgba(255, 255, 255, 0.85);
    transition: border-color 160ms ease, box-shadow 160ms ease;
  }

  input:focus {
    outline: none;
    border-color: rgba(52, 88, 66, 0.45);
    box-shadow: 0 0 0 4px rgba(52, 88, 66, 0.1);
  }
`;

const ErrorMessage = styled.p`
  padding: 12px 14px;
  border-radius: var(--radius-sm);
  background: rgba(173, 76, 57, 0.1);
  color: var(--danger);
  font-weight: 600;
`;

const SubmitButton = styled.button`
  margin-top: 6px;
  padding: 14px 18px;
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--accent), #db8c4d);
  color: white;
  font-weight: 700;
  font-size: 1rem;
  box-shadow: 0 18px 30px rgba(199, 115, 47, 0.26);
  transition: transform 160ms ease, opacity 160ms ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const Divider = styled.div`
  position: relative;
  text-align: center;
  margin: 2px 0;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    border-top: 1px solid rgba(52, 88, 66, 0.14);
  }

  span {
    position: relative;
    padding: 0 12px;
    background: linear-gradient(180deg, rgba(255, 253, 249, 0.96), rgba(249, 244, 233, 0.94));
    color: var(--muted);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-size: 0.72rem;
  }
`;

const GoogleButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 18px;
  border-radius: 999px;
  border: 1px solid rgba(52, 88, 66, 0.14);
  background: rgba(255, 255, 255, 0.88);
  color: var(--ink);
  font-weight: 700;
  transition: transform 160ms ease, border-color 160ms ease, box-shadow 160ms ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    border-color: rgba(52, 88, 66, 0.28);
    box-shadow: 0 12px 24px rgba(52, 88, 66, 0.12);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const GoogleMark = styled.span`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: inline-grid;
  place-items: center;
  background: linear-gradient(135deg, #4285f4, #34a853);
  color: white;
  font-weight: 800;
  font-size: 0.95rem;
`;

export default Login;
