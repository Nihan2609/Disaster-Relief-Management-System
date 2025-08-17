import { BrowserRouter, Routes, Route}
  from "react-router-dom";
import DisasterZones from "./pages/Zone/DisasterZones";
import AddZone from "./pages/Zone/AddZone";
import UpdateZone from "./pages/Zone/UpdateZone";

import Volunteers from "./pages/Volunteer/Volunteers";
import AddVolunteer from "./pages/Volunteer/AddVolunteer";
import UpdateVolunteer from "./pages/Volunteer/UpdateVolunteer";

import Requests from "./pages/Request/Requests";
import AddRequest from "./pages/Request/AddRequest";

import Resources from "./pages/Resource-/Resources";
import AddResource from "./pages/Resource-/AddResource";

import Login from "./pages/Login";
import Register from "./pages/Register";

import VolunteerDashboard from "./pages/VolunteerDashboard";
import Profile from "./pages/Profile";
import MakeDonation from "./pages/MakeDonation";
import UserProfile from "./pages/UserProfile";
import AssignZoneInfo from "./pages/AssignZoneInfo";




import "./style.css"
import "./Home.css"
import Home from "./pages/Home";
import UserDashboard from "./pages/UserDashboard";
import Center from "./pages/center/Center";
import AddCenter from "./pages/center/AddCenter";
import UpdateCenter from "./pages/center/UpdateCenter";
import ZoneInfo from "./pages/ZoneInfo";
import DistributionForm from "./pages/DistributionForm";
import UnifiedZoneManagement from "./pages/UnifiedZoneManagement";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/disasterZone" element={<DisasterZones />} />
          <Route path="/addZone" element={<AddZone />} />
          <Route path="/updateZone/:Zone_ID" element={<UpdateZone />} />

          <Route path="/volunteer" element={<Volunteers />} />
          <Route path="/addVolunteer" element={<AddVolunteer />} />
          <Route path="/updateVolunteer/:Volunteer_ID" element={<UpdateVolunteer />} />

          <Route path="/request" element={<Requests />} />
          <Route path="/addRequest" element={<AddRequest />} />

          <Route path="/resource" element={<Resources />} />
          <Route path="/addResource" element={<AddResource />} />


          <Route path="/admin/home" element={<Home />} />
          <Route path="/volunteer/dashboard" element={<VolunteerDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/donor" element={<UserProfile />} />

          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/register" element={<Register />} />

          <Route path="/donate" element={<MakeDonation />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/assign-zone" element={<AssignZoneInfo />} />

          <Route path="/center" element={<Center />} />
          <Route path="/addcenter" element={<AddCenter />} />
          <Route path="/updatecenter" element={<UpdateCenter />} />
          <Route path="/zone-info" element={<ZoneInfo />} />
          <Route path="/distribute" element={<DistributionForm />} />
          <Route path="/unfiled" element={<UnifiedZoneManagement />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
