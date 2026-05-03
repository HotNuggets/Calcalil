import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import * as XLSX from 'xlsx';
import PageHeader from "../../../components/HeaderComponent/PageHeader/PageHeader";
import styles from "./PeriodicSummaryPage.module.scss";

// Mock data - replace with actual Supabase data
interface MonthlyData {
  month: string;
  year: number;
  income: number;
  expenses: number;
  savings: number;
}

const PeriodicSummaryPage = () => {
  const navigate = useNavigate();
  const [summaryType, setSummaryType] = useState<'ytd' | 'custom'>('ytd');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Mock data - fetch from Supabase in real implementation
  const mockMonthlyData: MonthlyData[] = [
    { month: 'ינואר', year: 2026, income: 15000, expenses: 12000, savings: 3000 },
    { month: 'פברואר', year: 2026, income: 15000, expenses: 11500, savings: 3500 },
    { month: 'מרץ', year: 2026, income: 15500, expenses: 13000, savings: 2500 },
    { month: 'אפריל', year: 2026, income: 15500, expenses: 12500, savings: 3000 },
  ];

  const filteredData = useMemo(() => {
    if (summaryType === 'ytd') {
      const currentYear = new Date().getFullYear();
      return mockMonthlyData.filter(d => d.year === currentYear);
    }

    if (startDate && endDate) {
      // Filter by date range
      return mockMonthlyData; // Simplified - implement actual date filtering
    }

    return mockMonthlyData;
  }, [summaryType, startDate, endDate]);

  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, curr) => ({
        income: acc.income + curr.income,
        expenses: acc.expenses + curr.expenses,
        savings: acc.savings + curr.savings,
      }),
      { income: 0, expenses: 0, savings: 0 }
    );
  }, [filteredData]);

  const savingsRate = totals.income > 0 
    ? ((totals.savings / totals.income) * 100).toFixed(1)
    : '0';

  const handleExportSummary = () => {
    // Prepare summary data
    const summaryData = [{
      'תקופה': summaryType === 'ytd' ? 'שנה עד היום' : `${startDate} - ${endDate}`,
      'סה"כ הכנסות': totals.income,
      'סה"כ הוצאות': totals.expenses,
      'סה"כ חיסכון': totals.savings,
      'אחוז חיסכון': `${savingsRate}%`,
    }];

    // Prepare monthly breakdown
    const monthlyBreakdown = filteredData.map(d => ({
      'חודש': d.month,
      'שנה': d.year,
      'הכנסות': d.income,
      'הוצאות': d.expenses,
      'חיסכון': d.savings,
      'אחוז חיסכון': d.income > 0 ? `${((d.savings / d.income) * 100).toFixed(1)}%` : '0%',
    }));

    // Create workbook
    const wb = XLSX.utils.book_new();
    const wsSummary = XLSX.utils.json_to_sheet(summaryData);
    const wsMonthly = XLSX.utils.json_to_sheet(monthlyBreakdown);

    XLSX.utils.book_append_sheet(wb, wsSummary, 'סיכום');
    XLSX.utils.book_append_sheet(wb, wsMonthly, 'פירוט חודשי');

    // Generate filename
    const date = new Date().toLocaleDateString('he-IL').replace(/\//g, '-');
    const filename = `סיכום_תקופתי_${date}.xlsx`;

    XLSX.writeFile(wb, filename);
  };

  return (
    <div className={styles.container}>
      <PageHeader showBackButton={false} />
      <button
            className={styles.backButton}
            onClick={() => navigate("/expenses")}
          >
            ← חזור למעקב הוצאות
          </button>

      <div className={styles.content}>
        <h1 className={styles.title}>📊 סיכום תקופתי</h1>

        <div className={styles.controls}>
          <div className={styles.toggleSection}>
            <button
              className={`${styles.toggleBtn} ${summaryType === 'ytd' ? styles.active : ''}`}
              onClick={() => setSummaryType('ytd')}
            >
              שנה עד היום
            </button>
            <button
              className={`${styles.toggleBtn} ${summaryType === 'custom' ? styles.active : ''}`}
              onClick={() => setSummaryType('custom')}
            >
              תקופה מותאמת
            </button>
          </div>

          {summaryType === 'custom' && (
            <div className={styles.dateRange}>
              <div className={styles.inputGroup}>
                <label>מתאריך</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>עד תאריך</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          )}

          <button className={styles.exportBtn} onClick={handleExportSummary}>
            📥 ייצא לאקסל
          </button>
        </div>

        {/* Summary Cards */}
        <div className={styles.summaryCards}>
          <div className={`${styles.summaryCard} ${styles.income}`}>
            <span className={styles.cardIcon}>💰</span>
            <span className={styles.cardLabel}>סה"כ הכנסות</span>
            <span className={styles.cardValue}>{totals.income.toLocaleString()} ₪</span>
          </div>
          <div className={`${styles.summaryCard} ${styles.expenses}`}>
            <span className={styles.cardIcon}>💸</span>
            <span className={styles.cardLabel}>סה"כ הוצאות</span>
            <span className={styles.cardValue}>{totals.expenses.toLocaleString()} ₪</span>
          </div>
          <div className={`${styles.summaryCard} ${styles.savings}`}>
            <span className={styles.cardIcon}>💎</span>
            <span className={styles.cardLabel}>סה"כ חיסכון</span>
            <span className={styles.cardValue}>{totals.savings.toLocaleString()} ₪</span>
            <span className={styles.cardPercentage}>{savingsRate}%</span>
          </div>
        </div>

        {/* Charts */}
        <div className={styles.chartSection}>
          <h2 className={styles.sectionTitle}>התפלגות חודשית</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" fill="#059669" name="הכנסות" />
              <Bar dataKey="expenses" fill="#DC2626" name="הוצאות" />
              <Bar dataKey="savings" fill="#4F46E5" name="חיסכון" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartSection}>
          <h2 className={styles.sectionTitle}>מגמת חיסכון</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="savings" 
                stroke="#4F46E5" 
                strokeWidth={3}
                name="חיסכון חודשי"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Table */}
        <div className={styles.tableSection}>
          <h2 className={styles.sectionTitle}>פירוט חודשי</h2>
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span>חודש</span>
              <span>הכנסות</span>
              <span>הוצאות</span>
              <span>חיסכון</span>
              <span>%</span>
            </div>
            {filteredData.map((data, i) => (
              <div key={i} className={styles.tableRow}>
                <span>{data.month} {data.year}</span>
                <span className={styles.income}>{data.income.toLocaleString()} ₪</span>
                <span className={styles.expenses}>{data.expenses.toLocaleString()} ₪</span>
                <span className={styles.savings}>{data.savings.toLocaleString()} ₪</span>
                <span>
                  {data.income > 0 ? ((data.savings / data.income) * 100).toFixed(1) : '0'}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeriodicSummaryPage;
