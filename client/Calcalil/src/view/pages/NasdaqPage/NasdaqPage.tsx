import styles from "./NasdaqPage.module.scss";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { useNasdaqPageVM } from "./NasdaqPageVM";
import type { Period, ChartView } from "./NasdaqPageVM";
import PageHeader from "../../components/HeaderComponent/PageHeader/PageHeader";
import Footer from "../../components/Footer/Footer";

const NasdaqPage = () => {
  const vm = useNasdaqPageVM();

  if (vm.loading) {
    return (
      <div className={styles.container}>
        <p className={styles.loading}>טוען נתונים...</p>
      </div>
    );
  }

  if (vm.error) {
    return (
      <div className={styles.container}>
        <p className={styles.loading} style={{ color: '#DC2626' }}>
          {vm.error}
        </p>
      </div>
    );
  }

  const PERIODS: { value: Period; label: string }[] = [
    { value: 'YTD', label: 'מתחילת השנה' },
    { value: '1M',  label: 'חודש' },
    { value: '3M',  label: '3 חודשים' },
    { value: '6M',  label: '6 חודשים' },
    { value: '1Y',  label: 'שנה' },
  ];

  const CHART_VIEWS: { value: ChartView; label: string }[] = [
    { value: 'daily',   label: 'יומי' },
    { value: 'monthly', label: 'חודשי' },
    { value: 'ytd',     label: 'מתחילת השנה' },
  ];

  return (
    <div className={styles.container}>
      <PageHeader />

      <h2 className={styles.title}>Nasdaq 100 – מעקב ביצועים</h2>

      {/* ── Period selector ── */}
      <div className={styles.periodSelector}>
        {PERIODS.map(({ value, label }) => (
          <button
            key={value}
            className={`${styles.periodBtn} ${vm.period === value ? styles.active : ''}`}
            onClick={() => vm.setPeriod(value)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Summary cards ── */}
      <div className={styles.summary}>
        <div className={styles.usd}>
          <h3>בדולרים (USD)</h3>
          <div className={styles.label}>ערך נוכחי</div>
          <div className={styles.currentValue}>
            ${vm.currentUSD.toFixed(2)}
          </div>
          <div className={styles.growthBadge}>
            {vm.usdGrowth >= 0 ? '📈' : '📉'} {vm.usdGrowth.toFixed(2)}%
          </div>
        </div>

        <div className={styles.ils}>
          <h3>בשקלים (ILS)</h3>
          <div className={styles.label}>ערך נוכחי</div>
          <div className={styles.currentValue}>
            ₪{vm.currentILS.toFixed(2)}
          </div>
          <div
            className={`${styles.growthBadge} ${vm.ilsGrowth < 0 ? styles.negative : ''}`}
          >
            {vm.ilsGrowth >= 0 ? '📈' : '📉'} {vm.ilsGrowth.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* ── Comparison strip ── */}
      <div className={styles.comparison}>
        <div className={styles.comparisonTitle}>
          📊 השוואה ומדדים נוספים
        </div>
        <div className={styles.comparisonStats}>
          <div className={styles.comparisonStat}>
            <div className={styles.statLabel}>השפעת שער</div>
            <div
              className={styles.statValue}
              style={{ color: vm.fxImpact >= 0 ? '#059669' : '#DC2626' }}
            >
              {vm.fxImpactFormatted}
            </div>
          </div>
          <div className={styles.comparisonStat}>
            <div className={styles.statLabel}>שיא (USD)</div>
            <div className={styles.statValue}>${vm.highestUSD.toFixed(2)}</div>
          </div>
          <div className={styles.comparisonStat}>
            <div className={styles.statLabel}>שפל (USD)</div>
            <div className={styles.statValue}>${vm.lowestUSD.toFixed(2)}</div>
          </div>
          <div className={styles.comparisonStat}>
            <div className={styles.statLabel}>שיא (ILS)</div>
            <div className={styles.statValue}>₪{vm.highestILS.toFixed(2)}</div>
          </div>
          <div className={styles.comparisonStat}>
            <div className={styles.statLabel}>שפל (ILS)</div>
            <div className={styles.statValue}>₪{vm.lowestILS.toFixed(2)}</div>
          </div>
          <div className={styles.comparisonStat}>
            <div className={styles.statLabel}>ימי מסחר</div>
            <div className={styles.statValue}>{vm.data.length}</div>
          </div>
        </div>
      </div>

      {/* ── Chart ── */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <span className={styles.chartTitle}>גרף ביצועים</span>
          <div className={styles.chartLegend}>
            <span>
              <span className={styles.legendDot} style={{ background: '#F97316' }} />
              Nasdaq (USD)
            </span>
            <span>
              <span className={styles.legendDot} style={{ background: '#7C3AED' }} />
              Nasdaq (ILS)
            </span>
          </div>
        </div>

        {/* ── Chart view toggle ── */}
        <div className={styles.chartViewSelector}>
          {CHART_VIEWS.map(({ value, label }) => (
            <button
              key={value}
              className={`${styles.chartViewBtn} ${vm.chartView === value ? styles.chartViewActive : ''}`}
              onClick={() => vm.setChartView(value)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={vm.chartData}
              margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E6F0" />

              <XAxis
                dataKey="date"
                tickFormatter={(date) =>
                  new Date(date).toLocaleDateString('he-IL', {
                    month: 'short',
                    day: vm.chartView === 'monthly' ? undefined : 'numeric',
                    year: vm.chartView === 'monthly' ? '2-digit' : undefined,
                  })
                }
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />

              <YAxis
                width={70}
                tickFormatter={(v) => `${v.toFixed(1)}%`}
                tick={{ fontSize: 12 }}
              />

              <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="4 4" />

              <Tooltip
                labelFormatter={(label) =>
                  new Date(label).toLocaleDateString('he-IL', {
                    year: 'numeric',
                    month: 'long',
                    day: vm.chartView === 'monthly' ? undefined : 'numeric',
                  })
                }
                formatter={(value: number | undefined, name: string | undefined) => {
                  if (value === undefined || name === undefined) return ['N/A', ''];
                  return [`${value >= 0 ? '+' : ''}${value.toFixed(2)}%`, name];
                }}
              />

              <Legend />

              <Line
                type="monotone"
                dataKey="nsdqUSD"
                stroke="#F97316"
                strokeWidth={2}
                name="Nasdaq (USD)"
                dot={vm.chartView === 'monthly'}
                activeDot={{ r: 6 }}
              />

              <Line
                type="monotone"
                dataKey="nsdqILS"
                stroke="#7C3AED"
                strokeWidth={2}
                name="Nasdaq (ILS)"
                dot={vm.chartView === 'monthly'}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NasdaqPage;
