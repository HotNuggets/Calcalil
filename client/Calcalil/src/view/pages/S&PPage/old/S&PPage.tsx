import styles from "./S&PPage.module.scss";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useSAndPPageVM } from "./S&PPageVM";
import BackToWelcomeButton from "../../components/BackToWelcomeButton/BackToWelcomeButton";

const SAndPPage = () => {
  const vm = useSAndPPageVM();

  if (vm.loading) return <p className={styles.loading}>טוען נתונים...</p>;

  return (
    <div className={styles.container}>
      <BackToWelcomeButton />

      <h2 className={styles.title}>S&P 500 – מתחילת השנה</h2>

      <div className={styles.summary}>
        <div className={styles.usd}>
          <h3>בדולרים</h3>
          <p>ערך נוכחי: {vm.currentUSD.toFixed(2)}</p>
          <p className={styles.green}>
            תשואה: {vm.usdGrowth.toFixed(2)}%
          </p>
        </div>

        <div className={styles.ils}>
          <h3>בשקלים</h3>
          <p>ערך נוכחי: ₪{vm.currentILS.toFixed(2)}</p>
          <p className={styles.red}>
            תשואה: {vm.ilsGrowth.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className={styles.chartWrapper}>
  <ResponsiveContainer width="100%" height="100%">
    <LineChart
  data={vm.data}
  margin={{ top: 10, right: 20, left: 30, bottom: 10 }}
>
  <XAxis dataKey="date" hide />

  <YAxis
    width={60}
    tickFormatter={(v) => v.toLocaleString()}
  />

  <Tooltip
    labelFormatter={(label) =>
      new Date(label).toLocaleDateString("he-IL")
    }
  />

  <Legend />

  <Line
    type="monotone"
    dataKey="spxUSD"
    stroke="#1976d2"
    name="S&P (USD)"
    dot={false}
  />

  <Line
    type="monotone"
    dataKey="spxILS"
    stroke="#2e7d32"
    name="S&P (ILS)"
    dot={false}
  />
</LineChart>
  </ResponsiveContainer>
</div>

    </div>
  );
};

export default SAndPPage;
