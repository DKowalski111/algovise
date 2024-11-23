import { Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/layout/navbar/Navbar';
import Login from './pages/login/Login';
import Registration from './pages/registration/Registration';
import { useEffect } from 'react';
import ProtectedRoute from './router/ProtectedRouter';
import Dashboard from './pages/dashboard/Dashboard';
import Tutorials from './pages/tutorials/Tutorials';
import FundamentalsOfGraphTheory from './pages/tutorials/fundamentals-of-graph-theory/FundamentalsOfGraphTheory';
import AdvancedGraphAlgorithms from './pages/tutorials/advanced-graph-algorithms/AdvancedGraphAlgorithms';
import AlgorithmsForDirectedGraphs from './pages/tutorials/algorithms-for-directed-graphs/AlgorithmsForDirectedGraphs';
import BasicGraphAlgorithms from './pages/tutorials/basic-graph-algorithms/BasicGraphAlgorithms';
import ClassicProblems from './pages/tutorials/classic-problems/ClassicProblems';
import RealWorldGraphAlgorithms from './pages/tutorials/real-world-graph-algorithms/RealWorldGraphAlgorithms';

const RouteElement = ({ element }: any) => {
  useEffect(() => {
    console.log(localStorage.getItem("token"));
  }, [])

  return element;
}

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/login" element={<RouteElement element={<Login />} />} />
        <Route path="/registration" element={<RouteElement element={<Registration />} />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tutorials" element={<Tutorials />} />
          <Route path="/tutorials/fundamentals-of-graph-theory" element={<FundamentalsOfGraphTheory />} />
          <Route path="/tutorials/advanced-graph-algorithms" element={<AdvancedGraphAlgorithms />} />
          <Route path="/tutorials/algorithms-for-directed-graphs" element={<AlgorithmsForDirectedGraphs />} />
          <Route path="/tutorials/basic-graph-algorithms" element={<BasicGraphAlgorithms />} />
          <Route path="/tutorials/classic-problems" element={<ClassicProblems />} />
          <Route path="/tutorials/real-world-graph-algorithms" element={<RealWorldGraphAlgorithms />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App;
