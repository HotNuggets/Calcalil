import { useState, useMemo } from "react";

export interface Expense {
  amount: number | "";
  description: string;
  category: string;
}

export interface CategoryData {
  name: string;
  value: number;
  [key: string]: string | number; // Fix for Recharts typing
}


export const useExpensesPageVM = () => {
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
  ]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newCategory, setNewCategory] = useState<string>("");

  const handleAddExpense = () => {
    setExpenses((prev) => [
      ...prev,
      { amount: "", description: "", category: categories[0] },
    ]);
  };

  const handleExpenseChange = (index: number, field: keyof Expense, value: any) => {
    setExpenses((prev) =>
      prev.map((exp, i) => (i === index ? { ...exp, [field]: value } : exp))
    );
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory)) {
      setCategories((prev) => [...prev, newCategory]);
      setNewCategory("");
    }
  };

  const totalIncome = useMemo(() => {
    if (isHourly)
      return Number(hourlyRate || 0) * Number(hoursWorked || 0);
    return Number(monthlySalary || 0);
  }, [isHourly, hourlyRate, hoursWorked, monthlySalary]);

  const totalSpent = useMemo(
    () => expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0),
    [expenses]
  );

  const totalSaved = totalIncome - totalSpent;

  const chartData: CategoryData[] = useMemo(() => {
    return categories.map((cat) => {
      const total = expenses
        .filter((e) => e.category === cat)
        .reduce((sum, e) => sum + Number(e.amount || 0), 0);
      return { name: cat, value: total };
    });
  }, [categories, expenses]);

  return {
    // state
    isHourly, setIsHourly,
    hourlyRate, setHourlyRate,
    hoursWorked, setHoursWorked,
    monthlySalary, setMonthlySalary,
    categories, newCategory, setNewCategory,
    expenses,

    // computed
    totalIncome, totalSpent, totalSaved, chartData,

    // actions
    handleAddExpense,
    handleExpenseChange,
    handleAddCategory,
  };
};
