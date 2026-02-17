import { createBrowserRouter } from "react-router-dom";
import WelcomePage from "./view/pages/WelcomePage/WelcomePage";
import LoanCalculatorPage from "./view/pages/LoanReturnCalculatorPage/LoanCalculatorPage";
import SavingsCalculatorPage from "./view/pages/SavingsCalculatorPage/SavingsCalculatorPage";
import MortgageCalculatorPage from "./view/pages/MortgageCalculatorPage/MortgageCalculatorPage";
import ExpensesPage from "./view/pages/ExpensesPage/ExpensesPage";
import PrivacyPolicyPage from "./view/pages/PrivacyPolicyPage/PrivacyPolicyPage";
import TermsOfServicePage from "./view/pages/PrivacyPolicyPage/TermsOfServicePage";
import SNPPage from "./view/pages/S&PPage/S&PPage";

export const router = createBrowserRouter([
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
    path: "/expenses",
    element: <ExpensesPage />,
  },
  {
    path: "/privacy",
    element: <PrivacyPolicyPage />,
  },
  {
    path: "/Terms",
    element: <TermsOfServicePage />,
  },
  {
    path: "/SNP",
    element: <SNPPage />,
  },
]);
