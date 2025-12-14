//import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useExpensesPageVM } from "./ExpensesPageVM";
import styles from "./ExpensesPage.module.scss";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A65EEA", "#FF6699", "#2E8B57"];

const ExpensesPage: React.FC = () => {
  const vm = useExpensesPageVM();

  return (
    <div className={styles.container}>
  {/* Left side: Summary */}
  <section className={styles.leftPane}>
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>Summary</h2>

      <div className={styles.summaryGrid}>
        <div>
          <p className={styles.summaryLabel}>Income</p>
          <p>${vm.totalIncome.toFixed(2)}</p>
        </div>
        <div>
          <p className={styles.summaryLabel}>Spent</p>
          <p>${vm.totalSpent.toFixed(2)}</p>
        </div>
        <div>
          <p className={styles.summaryLabel}>Saved</p>
          <p
            className={
              vm.totalSaved >= 0 ? styles.savedPositive : styles.savedNegative
            }
          >
            ${vm.totalSaved.toFixed(2)}
          </p>
        </div>
      </div>

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
                return `${name} ${(percent * 100).toFixed(1)}%`;
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
                return [`$${amount.toFixed(2)} (${(pct * 100).toFixed(1)}%)`, name];
              }}
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: "6px",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  </section>

  {/* Right side: Salary + Expenses */}
  <section className={styles.rightPane}>
    {/* Income Section */}
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>Income</h2>
      <div className={styles.cardContent}>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={vm.isHourly}
            onChange={(e) => vm.setIsHourly(e.target.checked)}
          />
          Hourly pay?
        </label>

        {vm.isHourly ? (
          <div className={styles.inputGrid}>
            <input
              type="number"
              placeholder="Hourly Rate"
              value={vm.hourlyRate}
              onChange={(e) => vm.setHourlyRate(Number(e.target.value))}
              className={styles.input}
            />
            <input
              type="number"
              placeholder="Hours Worked"
              value={vm.hoursWorked}
              onChange={(e) => vm.setHoursWorked(Number(e.target.value))}
              className={styles.input}
            />
          </div>
        ) : (
          <input
            type="number"
            placeholder="Monthly Salary"
            value={vm.monthlySalary}
            onChange={(e) => vm.setMonthlySalary(Number(e.target.value))}
            className={styles.input}
          />
        )}
      </div>
    </div>

    {/* Expenses Section */}
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>Expenses</h2>
      <div className={styles.cardContent}>
        <button onClick={vm.handleAddExpense} className={styles.button}>
          + Add Expense
        </button>

        {vm.expenses.map((expense, index) => (
          <div key={index} className={styles.expenseRow}>
            <input
              type="number"
              placeholder="Amount"
              value={expense.amount}
              onChange={(e) =>
                vm.handleExpenseChange(index, "amount", Number(e.target.value))
              }
              className={styles.input}
            />
            <input
              type="text"
              placeholder="Description"
              value={expense.description}
              onChange={(e) =>
                vm.handleExpenseChange(index, "description", e.target.value)
              }
              className={styles.input}
            />
            <select
              value={expense.category}
              onChange={(e) =>
                vm.handleExpenseChange(index, "category", e.target.value)
              }
              className={styles.select}
            >
              {vm.categories.map((cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        ))}

        <div className={styles.addCategoryRow}>
          <input
            type="text"
            placeholder="Add new category"
            value={vm.newCategory}
            onChange={(e) => vm.setNewCategory(e.target.value)}
            className={styles.input}
          />
          <button onClick={vm.handleAddCategory} className={styles.button}>
            Add
          </button>
        </div>
      </div>
    </div>
  </section>
</div>

  );
};

export default ExpensesPage;
