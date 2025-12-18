import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useExpensesPageVM } from "./ExpensesPageVM";
import styles from "./ExpensesPage.module.scss";
import BackToWelcomeButton from "../../components/BackToWelcomeButton/BackToWelcomeButton";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A65EEA", "#FF6699", "#2E8B57"];

const ExpensesPage: React.FC = () => {
  const vm = useExpensesPageVM();

  return (
    <div className={styles.container}>
      <BackToWelcomeButton />

      {/* צד שמאל: סיכום */}
      <section className={styles.leftPane}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>סיכום חודשי</h2>

          <div className={styles.summaryGrid}>
            <div>
              <p className={styles.summaryLabel}>הכנסות</p>
              <p>₪{vm.totalIncome.toFixed(2)}</p>
            </div>
            <div>
              <p className={styles.summaryLabel}>הוצאות</p>
              <p>₪{vm.totalSpent.toFixed(2)}</p>
            </div>
            <div>
              <p className={styles.summaryLabel}>חיסכון</p>
              <p
                className={
                  vm.totalSaved >= 0 ? styles.savedPositive : styles.savedNegative
                }
              >
                ₪{vm.totalSaved.toFixed(2)}
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
                    return [`₪${amount.toFixed(2)} (${(pct * 100).toFixed(1)}%)`, name];
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* צד ימין: הכנסה + הוצאות */}
      <section className={styles.rightPane}>
        {/* הכנסה */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>הכנסה</h2>
          <div className={styles.cardContent}>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={vm.isHourly}
                onChange={(e) => vm.setIsHourly(e.target.checked)}
              />
              שכר לפי שעה?
            </label>

            {vm.isHourly ? (
              <div className={styles.inputGrid}>
                <input
                  type="number"
                  placeholder="שכר לשעה"
                  value={vm.hourlyRate}
                  onChange={(e) => vm.setHourlyRate(Number(e.target.value))}
                  className={styles.input}
                />
                <input
                  type="number"
                  placeholder="שעות עבודה החודש"
                  value={vm.hoursWorked}
                  onChange={(e) => vm.setHoursWorked(Number(e.target.value))}
                  className={styles.input}
                />
              </div>
            ) : (
              <input
                type="number"
                placeholder="שכר חודשי"
                value={vm.monthlySalary}
                onChange={(e) => vm.setMonthlySalary(Number(e.target.value))}
                className={styles.input}
              />
            )}
          </div>
        </div>

        {/* הוצאות */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>הוצאות</h2>
          <div className={styles.cardContent}>
            <button onClick={vm.handleAddExpense} className={styles.button}>
              + הוסף הוצאה
            </button>

            {vm.expenses.map((expense, index) => (
              <div key={index} className={styles.expenseRow}>
                <input
                  type="number"
                  placeholder="סכום"
                  value={expense.amount}
                  onChange={(e) =>
                    vm.handleExpenseChange(index, "amount", Number(e.target.value))
                  }
                  className={styles.input}
                />
                <input
                  type="text"
                  placeholder="פירוט"
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
                placeholder="הוסף קטגוריה חדשה"
                value={vm.newCategory}
                onChange={(e) => vm.setNewCategory(e.target.value)}
                className={styles.input}
              />
              <button onClick={vm.handleAddCategory} className={styles.button}>
                הוסף קטגוריה
              </button>
            </div>
            <div className={styles.categoryList}>
  {vm.categories.map((cat) => (
    <div key={cat} className={styles.categoryItem}>
      <span>{cat}</span>
      {cat !== "אחר" && (
        <button
          onClick={() => vm.handleDeleteCategory(cat)}
          className={styles.deleteButton}
        >
          ✕
        </button>
      )}
    </div>
  ))}
</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExpensesPage;
