import { createBrowserRouter } from "react-router-dom";
import WelcomePage from "./view/pages/WelcomePage/WelcomePage";
import LoanCalculatorPage from "./view/pages/LoanReturnCalculatorPage/LoanCalculatorPage";
import SavingsCalculatorPage from "./view/pages/SavingsCalculatorPage/SavingsCalculatorPage";
import MortgageCalculatorPage from "./view/pages/MortgageCalculatorPage/MortgageCalculatorPage";
import ExpensesPage from "./view/pages/ExpensesPage/ExpensesPage";
import PrivacyPolicyPage from "./view/pages/PrivacyPolicyPage/PrivacyPolicyPage";
import TermsOfServicePage from "./view/pages/PrivacyPolicyPage/TermsOfServicePage";
import SNPPage from "./view/pages/S&PPage/SAndPPage";
import SalaryCalculator from "./view/pages/SalaryCalculatorPage/SalaryCalculator";
import LoginPage from "./view/pages/LoginPage/LoginPage";
import ResetPasswordPage from "./view/pages/LoginPage/ResetPasswordPage";
import ProtectedRoute from "./view/components/ProtectedRoute";

export const router = createBrowserRouter([
  // ── Public Routes (no login required) ──
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
  {
    path: "/privacy",
    element: <PrivacyPolicyPage />,
  },
  {
    path: "/Terms",
    element: <TermsOfServicePage />,
  },

  // ── Protected Routes (login required) ──
  {
    path: "/",
    element: <ProtectedRoute><WelcomePage /></ProtectedRoute>,
  },
  {
    path: "/loan",
    element: <ProtectedRoute><LoanCalculatorPage /></ProtectedRoute>,
  },
  {
    path: "/savings",
    element: <ProtectedRoute><SavingsCalculatorPage /></ProtectedRoute>,
  },
  {
    path: "/mortgage",
    element: <ProtectedRoute><MortgageCalculatorPage /></ProtectedRoute>,
  },
  {
    path: "/expenses",
    element: <ProtectedRoute><ExpensesPage /></ProtectedRoute>,
  },
  {
    path: "/SNP",
    element: <ProtectedRoute><SNPPage /></ProtectedRoute>,
  },
  {
    path: "/Salary",
    element: <ProtectedRoute><SalaryCalculator /></ProtectedRoute>,
  },
]);
