import { Routes, Route } from 'react-router-dom';
import LandingPage from './layout/layout'; 
import Home from './pages/Home';

import LandingpageTravel from './layout/layoutTravel';

function App() {
  return (
    <div className="overflow-hidden w-full">
      <Routes>
        {/* Layout sebagai wrapper */}
        <Route element={<LandingPage />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
      <Routes>
        {/* Layout sebagai wrapper */}
        <Route element={<LandingpageTravel />}>
          <Route path="/Travel" element={<Travel />} /> 
          <Route path="/TrainslList" element={<TrainsList />} /> 
        </Route>
      </Routes>
    </div>
  );
}

export default App;
