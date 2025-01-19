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
import Quizzes from './pages/quizzes/Quizzes';
import Profile from './pages/profile/Profile';
import NewName from './pages/profile/NewName';
import NewEmail from './pages/profile/NewEmail';
import NewPassword from './pages/profile/NewPassword';
import GraphCreator from './pages/graph-creator/GraphCreator';
import AlgorithmChooser from './pages/graph-creator/AlgorithmChooser';
import BFS from './pages/algorithms/BFS';
import DFS from './pages/algorithms/DFS';
import Kruskal from './pages/algorithms/Kruskal';
import Dijkstra from './pages/algorithms/Dijkstra';
import BellmanFord from './pages/algorithms/BellmanFord';
import FloydWarshall from './pages/algorithms/FloydWarshall';
import AStar from './pages/algorithms/AStar';
import Prim from './pages/algorithms/Prim';
import SavedGraphs from './pages/savedGraphs/SavedGraphs';
import QuizCreator from './pages/quizzes/QuizCreator';
import QuizViewer from './pages/quizzes/QuizViewer';

const RouteElement = ({ element }: any) => {
  useEffect(() => {
    console.log(localStorage.getItem("token"));
    console.log(localStorage.getItem("id"));
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
          <Route path="/quizzes" element={<Quizzes />} />
          <Route path="/quizzes/:quizId" element={<QuizViewer />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/profile/update-name' element={<NewName />} />
          <Route path='/profile/update-email' element={<NewEmail />} />
          <Route path='/profile/update-password' element={<NewPassword />} />
          <Route path='/create-graph' element={<GraphCreator />} />
          <Route path='/choose-algorithm' element={<AlgorithmChooser />} />
          <Route path='/bfs-algorithm' element={<BFS />} />
          <Route path='/dfs-algorithm' element={<DFS />} />
          <Route path='/kruskal-algorithm' element={<Kruskal />} />
          <Route path='/dijkstra-algorithm' element={<Dijkstra />} />
          <Route path='/bellman-ford-algorithm' element={<BellmanFord />} />
          <Route path='/floyd-warshall-algorithm' element={<FloydWarshall />} />
          <Route path='/a-star-algorithm' element={<AStar />} />
          <Route path='/prim-algorithm' element={<Prim />} />
          <Route path='/saved-graphs' element={<SavedGraphs />} />
          <Route path='/quiz-creator' element={<QuizCreator />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App;
