import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { auth } from "./data";
import Header from "./components/Header";
import NewReport from "./components/NewReport";
import EditReport from "./components/EditReport";
import AddOption from "./components/AddOption";
import Login from "./components/Login";
import { NewProvider } from "./context/providers/NewProvider";
import newReducer, { newState } from "./context/reducers/NewReducer";
import { EditProvider } from "./context/providers/EditProvider";
import editReducer, { editState } from "./context/reducers/EditReducer";
import { AddProvider } from "./context/providers/AddProvider";
import addReducer, { addState } from "./context/reducers/AddReducer";

function App() {
  const [user, setUser] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((nextUser) => {
      setUser(nextUser ? nextUser.email : "");
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  return (
    <Router>
      {user ? (
        <Shell>
          <AmbientGlow />
          <Header setUser={setUser} user={user} />
          <MainContent>
            <Switch>
              <Route path="/Add">
                <AddProvider initialState={addState} reducer={addReducer}>
                  <AddOption />
                </AddProvider>
              </Route>
              <Route path="/View">
                <EditProvider initialState={editState} reducer={editReducer}>
                  <EditReport />
                </EditProvider>
              </Route>
              <Route path="/">
                <NewProvider initialState={newState} reducer={newReducer}>
                  <NewReport />
                </NewProvider>
              </Route>
            </Switch>
          </MainContent>
        </Shell>
      ) : (
        <Login />
      )}
    </Router>
  );
}

const Shell = styled.div`
  position: relative;
  min-height: 100vh;
  overflow: hidden;
`;

const AmbientGlow = styled.div`
  position: fixed;
  inset: 0;
  background:
    radial-gradient(circle at top left, rgba(232, 157, 83, 0.18), transparent 34%),
    radial-gradient(circle at top right, rgba(64, 107, 79, 0.16), transparent 28%),
    radial-gradient(circle at bottom center, rgba(211, 184, 136, 0.18), transparent 38%);
  pointer-events: none;
  z-index: 0;

  @media print {
    display: none;
  }
`;

const MainContent = styled.main`
  position: relative;
  z-index: 1;
  width: min(1240px, calc(100vw - 32px));
  margin: 0 auto;
  padding: 20px 0 32px;

  @media (max-width: 1100px) {
    padding: 16px 0 24px;
  }

  @media (max-width: 720px) {
    width: min(100vw - 20px, 1240px);
    padding: 14px 0 20px;
  }

  @media print {
    width: 100%;
    padding: 0;
  }
`;

export default App;
