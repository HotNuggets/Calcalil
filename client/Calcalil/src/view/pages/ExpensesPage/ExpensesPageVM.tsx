import { useState, useMemo, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../contexts/AuthContext";

export interface Expense {
  id: string;
  amount: number | "";
  description: string;
  category: string;
  date: string; // YYYY-MM-DD format
}

export interface CategoryData {
  name: string;
  value: number;
  percent?: number;
}

export interface MonthlyIncome {
  amount: number;
  is_hourly: boolean;
  hourly_rate?: number;
  hours_worked?: number;
  month: number;
  year: number;
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

  // Current month/year
  currentMonth: number;
  currentYear: number;
  setCurrentMonth: (m: number) => void;
  setCurrentYear: (y: number) => void;

  // Categories
  categories: string[];
  newCategory: string;
  setNewCategory: (v: string) => void;
  handleAddCategory: () => Promise<void>;
  handleDeleteCategory: (cat: string) => Promise<void>;

  // Expenses
  expenses: Expense[];
  handleAddExpense: () => void;
  handleExpenseChange: (id: string, field: keyof Expense, value: any) => void;
  handleDeleteExpense: (id: string) => Promise<void>;
  saveExpenses: () => Promise<void>;
  saveIncome: () => Promise<void>;
  saveAll: () => Promise<void>; // NEW: Save everything at once

  // Computed
  totalIncome: number;
  totalSpent: number;
  totalSaved: number;
  chartData: CategoryData[];
  savingsRate: number;

  // Loading states
  loading: boolean;
  saving: boolean;
}

export const useExpensesPageVM = (): ExpensesPageVM => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Current month/year
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1); // 1-12
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // Income state
  const [isHourly, setIsHourly] = useState(false);
  const [hourlyRate, setHourlyRate] = useState<number | "">("");
  const [hoursWorked, setHoursWorked] = useState<number | "">("");
  const [monthlySalary, setMonthlySalary] = useState<number | "">("");

  // Categories
  const [categories, setCategories] = useState<string[]>([
    "חשבונות",
    "משכנתא/שכירות",
    "ביטוח",
    "קניות",
    "דלק",
    "פנאי",
    "אחר",
  ]);
  const [newCategory, setNewCategory] = useState<string>("");

  // Expenses
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // ── Load data on mount and when month/year changes ────────────────────────
  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, currentMonth, currentYear]);

  const loadData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      await Promise.all([
        loadCategories(),
        loadExpenses(),
        loadIncome(),
      ]);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  // ── Load Categories ────────────────────────────────────────────────────
  const loadCategories = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("categories")
      .select("name")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error loading categories:", error);
      return;
    }

    if (data && data.length > 0) {
      setCategories(data.map((c) => c.name));
    } else {
      // First time user - insert default categories
      const defaultCategories = [
        "חשבונות",
        "משכנתא/שכירות",
        "ביטוח",
        "קניות",
        "דלק",
        "פנאי",
        "אחר",
      ];

      const { error: insertError } = await supabase.from("categories").insert(
        defaultCategories.map((name) => ({
          user_id: user.id,
          name,
        }))
      );

      if (!insertError) {
        setCategories(defaultCategories);
      }
    }
  };

  // ── Load Expenses ──────────────────────────────────────────────────────
  const loadExpenses = async () => {
    if (!user) return;

    // Get first and last day of current month
    const startDate = `${currentYear}-${String(currentMonth).padStart(2, "0")}-01`;
    const lastDay = new Date(currentYear, currentMonth, 0).getDate();
    const endDate = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${lastDay}`;

    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", user.id)
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: false });

    if (error) {
      console.error("Error loading expenses:", error);
      return;
    }

    if (data) {
      setExpenses(
        data.map((exp) => ({
          id: exp.id,
          amount: exp.amount,
          description: exp.description || "",
          category: exp.category,
          date: exp.date,
        }))
      );
    }
  };

  // ── Load Income ────────────────────────────────────────────────────────
  const loadIncome = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("income")
      .select("*")
      .eq("user_id", user.id)
      .eq("month", currentMonth)
      .eq("year", currentYear)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows found (not an error)
      console.error("Error loading income:", error);
      return;
    }

    if (data) {
      setIsHourly(data.is_hourly);
      if (data.is_hourly) {
        setHourlyRate(data.hourly_rate || "");
        setHoursWorked(data.hours_worked || "");
        setMonthlySalary("");
      } else {
        setMonthlySalary(data.amount);
        setHourlyRate("");
        setHoursWorked("");
      }
    }
  };

  // ── Save Income ────────────────────────────────────────────────────────
  const saveIncome = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const amount = isHourly
        ? Number(hourlyRate || 0) * Number(hoursWorked || 0)
        : Number(monthlySalary || 0);

      const incomeData = {
        user_id: user.id,
        amount,
        is_hourly: isHourly,
        hourly_rate: isHourly ? Number(hourlyRate || 0) : null,
        hours_worked: isHourly ? Number(hoursWorked || 0) : null,
        month: currentMonth,
        year: currentYear,
      };

      const { error } = await supabase
        .from("income")
        .upsert(incomeData, {
          onConflict: "user_id,month,year",
        });

      if (error) throw error;
    } catch (error) {
      console.error("Error saving income:", error);
      alert("שגיאה בשמירת ההכנסה");
    } finally {
      setSaving(false);
    }
  };

  // ── Save Expenses ──────────────────────────────────────────────────────
  const saveExpenses = async () => {
    if (!user) return;

    setSaving(true);
    try {
      // Filter out expenses with no amount
      const validExpenses = expenses.filter((exp) => Number(exp.amount || 0) > 0);

      if (validExpenses.length === 0) {
        setSaving(false);
        return;
      }

      // Upsert each expense
      for (const exp of validExpenses) {
        const expenseData = {
          user_id: user.id,
          amount: Number(exp.amount),
          description: exp.description,
          category: exp.category,
          date: exp.date,
        };

        // If it has a temp ID, insert new. Otherwise update existing.
        if (exp.id.startsWith("temp-")) {
          await supabase.from("expenses").insert(expenseData);
        } else {
          await supabase.from("expenses").update(expenseData).eq("id", exp.id);
        }
      }

      // Reload expenses to get proper IDs
      await loadExpenses();
    } catch (error) {
      console.error("Error saving expenses:", error);
      alert("שגיאה בשמירת ההוצאות");
    } finally {
      setSaving(false);
    }
  };

  // ── Income Calculation ─────────────────────────────────────────────────
  const totalIncome = useMemo(() => {
    if (isHourly) {
      return Number(hourlyRate || 0) * Number(hoursWorked || 0);
    }
    return Number(monthlySalary || 0);
  }, [isHourly, hourlyRate, hoursWorked, monthlySalary]);

  // ── Expense Calculations ───────────────────────────────────────────────
  const totalSpent = useMemo(
    () => expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0),
    [expenses]
  );

  const totalSaved = totalIncome - totalSpent;
  const savingsRate = totalIncome > 0 ? (totalSaved / totalIncome) * 100 : 0;

  // ── Chart Data ─────────────────────────────────────────────────────────
  const chartData: CategoryData[] = useMemo(() => {
    const data = categories
      .map((cat) => {
        const total = expenses
          .filter((e) => e.category === cat)
          .reduce((sum, e) => sum + Number(e.amount || 0), 0);
        return { name: cat, value: total };
      })
      .filter((item) => item.value > 0);

    const total = data.reduce((sum, item) => sum + item.value, 0);
    return data.map((item) => ({
      ...item,
      percent: total > 0 ? item.value / total : 0,
    }));
  }, [categories, expenses]);

  // ── Expense Management ─────────────────────────────────────────────────
  const handleAddExpense = () => {
    const today = new Date();
    const dateStr = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    
    const newExpense: Expense = {
      id: `temp-${Date.now()}`, // Temporary ID
      amount: "",
      description: "",
      category: categories[0] || "אחר",
      date: dateStr,
    };
    setExpenses((prev) => [...prev, newExpense]);
  };

  const handleExpenseChange = (id: string, field: keyof Expense, value: any) => {
    setExpenses((prev) =>
      prev.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    );
  };

  const handleDeleteExpense = async (id: string) => {
    if (!user) return;

    // If it's a temp ID, just remove from state
    if (id.startsWith("temp-")) {
      setExpenses((prev) => prev.filter((exp) => exp.id !== id));
      return;
    }

    // Delete from database
    setSaving(true);
    try {
      const { error } = await supabase.from("expenses").delete().eq("id", id);

      if (error) throw error;

      setExpenses((prev) => prev.filter((exp) => exp.id !== id));
    } catch (error) {
      console.error("Error deleting expense:", error);
      alert("שגיאה במחיקת ההוצאה");
    } finally {
      setSaving(false);
    }
  };

  // ── Category Management ────────────────────────────────────────────────
  const handleAddCategory = async () => {
    if (!user) return;

    const trimmed = newCategory.trim();
    if (!trimmed || categories.includes(trimmed)) {
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from("categories").insert({
        user_id: user.id,
        name: trimmed,
      });

      if (error) throw error;

      setCategories((prev) => [...prev, trimmed]);
      setNewCategory("");
    } catch (error) {
      console.error("Error adding category:", error);
      alert("שגיאה בהוספת הקטגוריה");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (categoryToDelete: string) => {
    if (!user) return;

    if (categories.length <= 1) {
      alert("חייב להשאיר לפחות קטגוריה אחת");
      return;
    }

    const fallbackCategory = categories.find((c) => c !== categoryToDelete) || "אחר";

    setSaving(true);
    try {
      // Update expenses to use fallback category
      const expensesToUpdate = expenses.filter((e) => e.category === categoryToDelete);
      if (expensesToUpdate.length > 0) {
        const { error: updateError } = await supabase
          .from("expenses")
          .update({ category: fallbackCategory })
          .eq("user_id", user.id)
          .eq("category", categoryToDelete);

        if (updateError) throw updateError;
      }

      // Delete category
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("user_id", user.id)
        .eq("name", categoryToDelete);

      if (error) throw error;

      // Update local state
      setExpenses((prev) =>
        prev.map((expense) =>
          expense.category === categoryToDelete
            ? { ...expense, category: fallbackCategory }
            : expense
        )
      );
      setCategories((prev) => prev.filter((cat) => cat !== categoryToDelete));
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("שגיאה במחיקת הקטגוריה");
    } finally {
      setSaving(false);
    }
  };

  // Auto-save income when it changes - DISABLED FOR MANUAL SAVE
  // useEffect(() => {
  //   if (!loading && user) {
  //     const timeoutId = setTimeout(() => {
  //       saveIncome();
  //     }, 1000);
  //     return () => clearTimeout(timeoutId);
  //   }
  // }, [isHourly, hourlyRate, hoursWorked, monthlySalary]);

  // Auto-save expenses when they change - DISABLED FOR MANUAL SAVE
  // useEffect(() => {
  //   if (!loading && user && expenses.length > 0) {
  //     const timeoutId = setTimeout(() => {
  //       saveExpenses();
  //     }, 2000);
  //     return () => clearTimeout(timeoutId);
  //   }
  // }, [expenses]);

  // Manual save function that saves both income and expenses
  const saveAll = async () => {
    setSaving(true);
    try {
      await Promise.all([saveIncome(), saveExpenses()]);
      alert('✅ הנתונים נשמרו בהצלחה!');
    } catch (error) {
      console.error('Error saving all data:', error);
      alert('❌ שגיאה בשמירת הנתונים');
    } finally {
      setSaving(false);
    }
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

    // Month/Year
    currentMonth,
    currentYear,
    setCurrentMonth,
    setCurrentYear,

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
    saveExpenses,
    saveIncome,
    saveAll,

    // Computed
    totalIncome,
    totalSpent,
    totalSaved,
    chartData,
    savingsRate,

    // Loading
    loading,
    saving,
  };
};
