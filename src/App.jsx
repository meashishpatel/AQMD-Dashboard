import React from "react";
import Dashboard from "./components/Dashboard";
import ErrorBoundary from "./components/ErrorBoundary";

const App = () => {
  return (
    <div>
      <ErrorBoundary>
        <Dashboard />
      </ErrorBoundary>
    </div>
  );
};

export default App;
