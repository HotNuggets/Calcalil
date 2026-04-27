import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useExpensesPageVM } from "./ExpensesPageVM";
import styles from "./ExpensesPage.module.scss";
import PageHeader from "../../../../src/view/components/HeaderComponent/PageHeader/PageHeader";
import Footer from "../../components/Footer/Footer";

const COLORS = [
  "#4F46E5", // indigo
  "#0EA5E9", // blue
  "#7C3AED", // violet
  "#059669", // green
  "#EA580C", // orange
  "#EC4899", // pink
  "#F59E0B", // amber
  "#10B981", // emerald
];

const MONTHS = [
  "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
  "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"
];

const ExpensesPage: React.FC = () => {
  const vm = useExpensesPageVM();

  if (vm.loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>טוען נתונים...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <PageHeader showBackButton={true} />

      <div className={styles.content}>
        {/* Header with Month/Year Selector */}
        <div className={styles.header}>
          <h1 className={styles.title}>מעקב הוצאות והכנסות</h1>
          
          <div className={styles.headerActions}>
            <div className={styles.monthSelector}>
              <button
                onClick={() => {
                  if (vm.currentMonth === 1) {
                    vm.setCurrentMonth(12);
                    vm.setCurrentYear(vm.currentYear - 1);
                  } else {
                    vm.setCurrentMonth(vm.currentMonth - 1);
                  }
                }}
                className={styles.monthBtn}
              >
                ←
              </button>

              <div className={styles.monthDisplay}>
                <select
                  value={vm.currentMonth}
                  onChange={(e) => vm.setCurrentMonth(Number(e.target.value))}
                  className={styles.monthSelect}
                >
                  {MONTHS.map((month, idx) => (
                    <option key={idx} value={idx + 1}>
                      {month}
                    </option>
                  ))}
                </select>

                <select
                  value={vm.currentYear}
                  onChange={(e) => vm.setCurrentYear(Number(e.target.value))}
                  className={styles.yearSelect}
                >
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  if (vm.currentMonth === 12) {
                    vm.setCurrentMonth(1);
                    vm.setCurrentYear(vm.currentYear + 1);
                  } else {
                    vm.setCurrentMonth(vm.currentMonth + 1);
                  }
                }}
                className={styles.monthBtn}
              >
                →
              </button>
            </div>

            <button 
              onClick={vm.saveAll} 
              disabled={vm.saving}
              className={styles.saveButton}
            >
              {vm.saving ? '💾 שומר...' : '💾 שמור נתונים'}
            </button>
          </div>

          {vm.saving && (
            <div className={styles.savingIndicator}>
              <div className={styles.savingSpinner}></div>
              <span>שומר...</span>
            </div>
          )}
        </div>

        <div className={styles.grid}>
          {/* ── Left Column: Summary & Chart ── */}
          <div>
            {/* Summary Cards */}
            <div className={styles.summaryGrid}>
              <div className={`${styles.summaryCard} ${styles.income}`}>
                <div className={styles.summaryLabel}>הכנסות</div>
                <div className={styles.summaryValue} style={{ color: "#059669" }}>
                  ₪{vm.totalIncome.toLocaleString()}
                </div>
              </div>

              <div className={`${styles.summaryCard} ${styles.expense}`}>
                <div className={styles.summaryLabel}>הוצאות</div>
                <div className={styles.summaryValue} style={{ color: "#DC2626" }}>
                  ₪{vm.totalSpent.toLocaleString()}
                </div>
              </div>

              <div className={`${styles.summaryCard} ${styles.savings}`}>
                <div className={styles.summaryLabel}>חיסכון</div>
                <div
                  className={`${styles.summaryValue} ${
                    vm.totalSaved >= 0 ? styles.savedPositive : styles.savedNegative
                  }`}
                >
                  ₪{vm.totalSaved.toLocaleString()}
                </div>
                <div style={{ fontSize: "12px", marginTop: "8px", color: "#7B83A8" }}>
                  {vm.savingsRate.toFixed(1)}% מההכנסות
                </div>
              </div>
            </div>

            {/* Pie Chart */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>פילוח הוצאות לפי קטגוריה</h2>
              {vm.chartData.length > 0 ? (
                <div className={styles.chartContainer}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={vm.chartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        nameKey="name"
                        labelLine={false}
                        label={(entry: any) => {
                          const name = String(entry?.name ?? "");
                          const percent = Number(entry?.percent ?? 0);
                          return `${name} ${(percent * 100).toFixed(0)}%`;
                        }}
                      >
                        {vm.chartData.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>

                      <Tooltip
                        formatter={(value: any, name: any, props: any) => {
                          const amount = Number(value ?? 0);
                          const pct = Number(props?.payload?.percent ?? 0);
                          return [`₪${amount.toLocaleString()} (${(pct * 100).toFixed(1)}%)`, name];
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>📊</div>
                  <div className={styles.emptyText}>אין עדיין הוצאות</div>
                  <div className={styles.emptySubtext}>
                    התחל להוסיף הוצאות כדי לראות את הפילוח
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Right Column: Income & Expenses ── */}
          <div>
            {/* Income Section */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>💰 הכנסה חודשית</h2>
              <div className={styles.cardContent}>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={vm.isHourly}
                    onChange={(e) => vm.setIsHourly(e.target.checked)}
                  />
                  שכר לפי שעה
                </label>

                {vm.isHourly ? (
                  <div className={styles.inputGrid}>
                    <input
                      type="number"
                      placeholder="שכר לשעה (₪)"
                      value={vm.hourlyRate}
                      onChange={(e) => vm.setHourlyRate(Number(e.target.value) || "")}
                      className={styles.input}
                    />
                    <input
                      type="number"
                      placeholder="שעות עבודה החודש"
                      value={vm.hoursWorked}
                      onChange={(e) => vm.setHoursWorked(Number(e.target.value) || "")}
                      className={styles.input}
                    />
                  </div>
                ) : (
                  <input
                    type="number"
                    placeholder="שכר חודשי (₪)"
                    value={vm.monthlySalary}
                    onChange={(e) => vm.setMonthlySalary(Number(e.target.value) || "")}
                    className={styles.input}
                  />
                )}
              </div>
            </div>

            {/* Expenses Section */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>💸 הוצאות חודשיות</h2>
              <div className={styles.cardContent}>
                <button onClick={vm.handleAddExpense} className={styles.button}>
                  + הוסף הוצאה
                </button>

                {vm.expenses.length === 0 ? (
                  <div className={styles.emptyState} style={{ padding: "40px 20px" }}>
                    <div className={styles.emptyIcon}>🧾</div>
                    <div className={styles.emptyText}>אין עדיין הוצאות</div>
                    <div className={styles.emptySubtext}>
                      לחץ על "הוסף הוצאה" כדי להתחיל
                    </div>
                  </div>
                ) : (
                  vm.expenses.map((expense) => (
                    <div key={expense.id} className={styles.expenseRow}>
                      <input
                        type="number"
                        placeholder="סכום (₪)"
                        value={expense.amount}
                        onChange={(e) =>
                          vm.handleExpenseChange(expense.id, "amount", Number(e.target.value) || "")
                        }
                        className={styles.input}
                      />
                      <input
                        type="text"
                        placeholder="תיאור (לדוגמה: חשמל, קניות)"
                        value={expense.description}
                        onChange={(e) =>
                          vm.handleExpenseChange(expense.id, "description", e.target.value)
                        }
                        className={styles.input}
                      />
                      <select
                        value={expense.category}
                        onChange={(e) =>
                          vm.handleExpenseChange(expense.id, "category", e.target.value)
                        }
                        className={styles.select}
                      >
                        {vm.categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => vm.handleDeleteExpense(expense.id)}
                        className={styles.deleteExpenseBtn}
                        title="מחק הוצאה"
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Category Management */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>🏷️ ניהול קטגוריות</h2>
              <div className={styles.cardContent}>
                <div className={styles.addCategoryRow}>
                  <input
                    type="text"
                    placeholder="הוסף קטגוריה חדשה"
                    value={vm.newCategory}
                    onChange={(e) => vm.setNewCategory(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && vm.handleAddCategory()}
                    className={styles.input}
                  />
                  <button onClick={vm.handleAddCategory} className={`${styles.button} ${styles.secondary}`}>
                    הוסף
                  </button>
                </div>

                <div className={styles.categoryList}>
                  {vm.categories.map((cat) => (
                    <div key={cat} className={styles.categoryItem}>
                      <span>{cat}</span>
                      {vm.categories.length > 1 && (
                        <button
                          onClick={() => vm.handleDeleteCategory(cat)}
                          className={styles.deleteButton}
                          title={`מחק קטגוריה: ${cat}`}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ExpensesPage;
