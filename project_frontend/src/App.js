import './App.css';

import HomePage from './pages/Homepage/HomePage'
import LoginPage from './pages/Login/LoginPage'
import RegisterPage from './pages/RegisterPage'
import UserProfile from './pages/UserProfile'
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Header from './components/Header'
import {AuthProvider} from "./context/AuthContext";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import EditUserProfile from "./pages/EditUserProfile";
import SortStudio from "./pages/SortStudio";
import StudioPage from "./pages/StudioPage";
import ClassesPage from "./pages/ClassesPage";
import SchedulePage from "./pages/SchedulePage";
import HistoryPage from "./pages/HistoryPage";
import FilterStudiosPage from "./pages/FilterStudiosPage";
import FilterClassesPage from "./pages/FilterClassesPage";
import SortStudioPostCode from "./pages/SortStudioPostCode";
import CreditCardPage from "./pages/CreditCardPage";
import SortStudioMap from "./pages/SortStudioMap";
import SubscriptionsPage from './pages/SubscriptionsPage';
import PaymentsPage from './pages/PaymentsPage';
import FuturePayments2 from './pages/FuturePayments2';
import EditCardPage from './pages/EditCardPage';
import EditSubscriptionPage from './pages/EditSubscriptionPage';

function App() {
  return (
    <div className="App">
        <Router>
            <Header/>
            <AuthProvider>
            <Routes>
                <Route element={<HomePage />} path="/" exact/>
                <Route element={<LoginPage />} path="/login"/>
                <Route element={<RegisterPage />} path="/register"/>
                <Route element={<UserProfile />} path="/profile/view"/>
                <Route element={<EditUserProfile />} path="/profile/edit"/>
                <Route element={<SortStudio />} path="/studio/sortby/currlocation"/>
                <Route element={<SortStudioPostCode />} path="/studio/postcode/"/>
                <Route element={<SortStudioMap />} path="/studio/map"/>
                <Route element={<StudioPage />} path="/studio/:id/details"/>
                <Route element={<ClassesPage />} path="/studio/:id/classes"/>
                <Route element={<SchedulePage />} path="/class/schedule"/>
                <Route element={<HistoryPage />} path="/class/history"/>
                <Route element={<FilterStudiosPage />} path="/studio/filter"/>
                <Route element={<FilterClassesPage />} path="/studio/:id/classes/filter"/>
                <Route element={<SubscriptionsPage />} path="/subscriptions"/>
                <Route element={<EditSubscriptionPage />} path="/subscriptions/edit/"/>
                <Route element={<CreditCardPage />} path="/subscriptions/:id/subscribe/"/>
                <Route element={<PaymentsPage />} path="/subscriptions/payments/history/"/>
                <Route element={<EditCardPage />} path="/subscriptions/card/edit/"/>
                <Route element={<FuturePayments2 />} path="/subscriptions/payments/future/"/>


            </Routes>
            </AuthProvider>
        </Router>

    </div>
  );
}

export default App;
