import { useState, useMemo } from "react";

export interface Expense {
  id: string;
  amount: number | "";
  description: string;
  category: string;
}

export interface CategoryData {
  name: string;
  value: number;
  percent?: number;
}

export interface ExpensesPageVM {
  // Income state
  isHourly: boolean;
  setIsHourly: (v: boolean) => void;
  hourlyRate: number | "";
  setHourlyRate: (v: number | "") => void;
  hoursWorked: number | "";
  setHoursWorked: (v: number | "") => void;
  monthlySalary: number | "";
  setMonthlySalary: (v: number | "") => void;

  // Categories
  categories: string[];
  newCategory: string;
  setNewCategory: (v: string) => void;
  handleAddCategory: () => void;
  handleDeleteCategory: (cat: string) => void;

  // Expenses
  expenses: Expense[];
  handleAddExpense: () => void;
  handleExpenseChange: (id: string, field: keyof Expense, value: any) => void;
  handleDeleteExpense: (id: string) => void;

  // Computed
  totalIncome: number;
  totalSpent: number;
  totalSaved: number;
  chartData: CategoryData[];
  savingsRate: number; // Percentage of income saved
}

export const useExpensesPageVM = (): ExpensesPageVM => {
  const [isHourly, setIsHourly] = useState(false);
  const [hourlyRate, setHourlyRate] = useState<number | "">("");
  const [hoursWorked, setHoursWorked] = useState<number | "">("");
  const [monthlySalary, setMonthlySalary] = useState<number | "">("");
  
  const [categories, setCategories] = useState<string[]>([
    "חשבונות",
    "משכנתא/שכירות",
    "ביטוח",
    "קניות",
    "דלק",
    "פנאי",
    "אחר",
  ]);
  
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newCategory, setNewCategory] = useState<string>("");

  // ── Income Calculation ────────────────────────────────────────────────────
  const totalIncome = useMemo(() => {
    if (isHourly) {
      return Number(hourlyRate || 0) * Number(hoursWorked || 0);
    }
    return Number(monthlySalary || 0);
  }, [isHourly, hourlyRate, hoursWorked, monthlySalary]);

  // ── Expense Calculations ──────────────────────────────────────────────────
  const totalSpent = useMemo(
    () => expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0),
    [expenses]
  );

  const totalSaved = totalIncome - totalSpent;

  const savingsRate = totalIncome > 0 ? (totalSaved / totalIncome) * 100 : 0;

  // ── Chart Data ────────────────────────────────────────────────────────────
  const chartData: CategoryData[] = useMemo(() => {
    const data = categories
      .map((cat) => {
        const total = expenses
          .filter((e) => e.category === cat)
          .reduce((sum, e) => sum + Number(e.amount || 0), 0);
        return { name: cat, value: total };
      })
      .filter((item) => item.value > 0); // Only show categories with expenses

    // Calculate percentages
    const total = data.reduce((sum, item) => sum + item.value, 0);
    return data.map((item) => ({
      ...item,
      percent: total > 0 ? item.value / total : 0,
    }));
  }, [categories, expenses]);

  // ── Expense Management ────────────────────────────────────────────────────
  const handleAddExpense = () => {
    const newExpense: Expense = {
      id: Date.now().toString(),
      amount: "",
      description: "",
      category: categories[0] || "אחר",
    };
    setExpenses((prev) => [...prev, newExpense]);
  };

  const handleExpenseChange = (id: string, field: keyof Expense, value: any) => {
    setExpenses((prev) =>
      prev.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    );
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  };

  // ── Category Management ───────────────────────────────────────────────────
  const handleAddCategory = () => {
    const trimmed = newCategory.trim();
    if (trimmed && !categories.includes(trimmed)) {
      setCategories((prev) => [...prev, trimmed]);
      setNewCategory("");
    }
  };

  const handleDeleteCategory = (categoryToDelete: string) => {
    if (categories.length <= 1) {
      alert("חייב להשאיר לפחות קטגוריה אחת");
      return;
    }

    const fallbackCategory = categories.find((c) => c !== categoryToDelete) || "אחר";

    // Move expenses from deleted category to fallback
    setExpenses((prev) =>
      prev.map((expense) =>
        expense.category === categoryToDelete
          ? { ...expense, category: fallbackCategory }
          : expense
      )
    );

    // Remove category
    setCategories((prev) => prev.filter((cat) => cat !== categoryToDelete));
  };

  return {
    // Income
    isHourly,
    setIsHourly,
    hourlyRate,
    setHourlyRate,
    hoursWorked,
    setHoursWorked,
    monthlySalary,
    setMonthlySalary,

    // Categories
    categories,
    newCategory,
    setNewCategory,
    handleAddCategory,
    handleDeleteCategory,

    // Expenses
    expenses,
    handleAddExpense,
    handleExpenseChange,
    handleDeleteExpense,

    // Computed
    totalIncome,
    totalSpent,
    totalSaved,
    chartData,
    savingsRate,
  };
};
