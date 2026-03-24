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
import ProtectedRoute from "./../src/view/components/ProtectedRoute";

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
    path: "/",
    element: <WelcomePage />,
  },
  {
    path: "/loan",
    element: <LoanCalculatorPage />,
  },
  {
    path: "/savings",
    element: <SavingsCalculatorPage />,
  },
  {
    path: "/mortgage",
    element: <MortgageCalculatorPage />,
  },
  {
    path: "/SNP",
    element: <SNPPage />,
  },
  {
    path: "/Salary",
    element: <SalaryCalculator />,
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
    path: "/expenses",
    element: <ProtectedRoute><ExpensesPage /></ProtectedRoute>,
  },
]);
