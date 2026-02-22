import React from "react";
import styles from "./SavingsCalculatorPage.module.scss";
import BackToWelcomeButton from "../../components/BackToWelcomeButton/BackToWelcomeButton";
import { useSavingsCalculatorPageVM } from "./SavingsCalculatorPageVM";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// ─── Slider Component ─────────────────────────────────────────────────────────
interface SliderProps {
  label: string;
  value: number | null;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  onChange: (v: number) => void;
}

const Slider: React.FC<SliderProps> = ({ label, value, min, max, step, suffix = "", onChange }) => {
  const numValue = value ?? min;
  const pct = ((numValue - min) / (max - min)) * 100;

  return (
    <div className={styles.sliderGroup}>
      <div className={styles.sliderHeader}>
        <span className={styles.inputLabel}>{label}</span>
        <span className={styles.sliderValue}>
          {numValue.toLocaleString()}{suffix}
        </span>
      </div>
      <div className={styles.sliderTrack}>
        <div className={styles.sliderFill} style={{ width: `${pct}%` }} />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={numValue}
          onChange={(e) => onChange(Number(e.target.value))}
          className={styles.sliderInput}
        />
        <div className={styles.sliderThumb} style={{ left: `${pct}%` }} />
      </div>
    </div>
  );
};

// ─── Number Input Component ───────────────────────────────────────────────────
interface NumberInputProps {
  label: string;
  value: number | null;
  placeholder?: string;
  suffix?: string;
  info?: string;
  onChange: (v: number | null) => void;
}

const NumberInput: React.FC<NumberInputProps> = ({ label, value, placeholder, suffix = "₪", info, onChange }) => {
  const [raw, setRaw] = React.useState<string>(value?.toString() ?? "");

  React.useEffect(() => {
    setRaw(value?.toString() ?? "");
  }, [value]);

  const handleChange = (v: string) => {
    setRaw(v);
    const cleaned = v.replace(/[^0-9.]/g, "");
    const num = parseFloat(cleaned);
    onChange(!isNaN(num) ? num : null);
  };

  return (
    <div className={styles.inputGroup}>
      <div className={styles.inputLabel}>
        <span>{label}</span>
        {info && (
          <button
            type="button"
            className={styles.infoButton}
            onClick={() => alert(info)}
            aria-label={`מידע: ${label}`}
          >
            ?
          </button>
        )}
      </div>
      <div className={styles.inputWrapper}>
        <span className={styles.inputSymbol}>{suffix}</span>
        <input
          type="text"
          inputMode="decimal"
          value={raw}
          placeholder={placeholder}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={() => setRaw(value?.toString() ?? "")}
          className={styles.input}
        />
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const SavingsCalculatorPage = () => {
  const vm = useSavingsCalculatorPageVM();

  return (
    <div className={styles.calculator}>
      <BackToWelcomeButton />

      <div className={styles.content}>
        <h1 className={styles.title}>מחשבון חיסכון חכם</h1>

        {/* ── Type Selector ── */}
        <div className={styles.typeSelector}>
          <button
            className={`${styles.typeBtn} ${vm.calcType === "oneTime" ? styles.active : ""}`}
            onClick={() => vm.setCalcType("oneTime")}
          >
            💰 הפקדה חד פעמית
          </button>
          <button
            className={`${styles.typeBtn} ${vm.calcType === "monthly" ? styles.active : ""}`}
            onClick={() => vm.setCalcType("monthly")}
          >
            📅 הפקדה חודשית
          </button>
        </div>

        {/* ── Input Form ── */}
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>הגדרות חיסכון</h2>

          <div className={styles.formGrid}>
            {vm.calcType === "oneTime" && (
              <NumberInput
                label="סכום הפקדה חד פעמית"
                value={vm.deposit}
                placeholder="10,000"
                suffix="₪"
                onChange={vm.setDeposit}
              />
            )}

            {vm.calcType === "monthly" && (
              <>
                <NumberInput
                  label="הפקדה ראשונית"
                  value={vm.deposit}
                  placeholder="0"
                  suffix="₪"
                  onChange={vm.setDeposit}
                />
                <NumberInput
                  label="הפקדה חודשית"
                  value={vm.monthlyDeposit}
                  placeholder="1,000"
                  suffix="₪"
                  onChange={vm.setMonthlyDeposit}
                />
              </>
            )}

            <Slider
              label="מספר שנים"
              value={vm.years}
              min={1}
              max={50}
              step={1}
              suffix=" שנים"
              onChange={vm.setYears}
            />

            <Slider
              label="ריבית שנתית"
              value={vm.interest}
              min={0}
              max={15}
              step={0.1}
              suffix="%"
              onChange={vm.setInterest}
            />
          </div>

          <div className={styles.formTitle} style={{ marginTop: '24px', marginBottom: '16px', paddingBottom: '12px' }}>
            עמלות ומיסוי
          </div>

          <div className={styles.formGrid}>
            <Slider
              label="מס רווחי הון"
              value={vm.tax}
              min={0}
              max={50}
              step={1}
              suffix="%"
              onChange={vm.setTax}
            />

            <Slider
              label="דמי ניהול מהפקדה"
              value={vm.depositFee}
              min={0}
              max={10}
              step={0.1}
              suffix="%"
              onChange={vm.setDepositFee}
            />

            <Slider
              label="דמי ניהול שנתיים מצבירה"
              value={vm.accumulationFee}
              min={0}
              max={3}
              step={0.1}
              suffix="%"
              onChange={vm.setAccumulationFee}
            />
          </div>

          <button type="button" className={styles.calculateBtn} onClick={vm.calculate}>
            🧮 חשב תוצאות
          </button>
        </div>

        {/* ── Results Section ── */}
        {vm.result && (
          <div className={styles.resultsSection}>
            {/* Summary Cards */}
            <div className={styles.summaryCards}>
              <div className={`${styles.summaryCard} ${styles.positive}`}>
                <div className={styles.cardLabel}>סה״כ חיסכון סופי</div>
                <div className={`${styles.cardValue} ${styles.green}`}>
                  ₪{vm.result.finalAmount.toLocaleString()}
                </div>
              </div>

              <div className={styles.summaryCard}>
                <div className={styles.cardLabel}>סה״כ הופקד</div>
                <div className={`${styles.cardValue} ${styles.blue}`}>
                  ₪{vm.result.totalDeposited.toLocaleString()}
                </div>
              </div>

              <div className={`${styles.summaryCard} ${styles.positive}`}>
                <div className={styles.cardLabel}>רווחים נטו</div>
                <div className={`${styles.cardValue} ${styles.green}`}>
                  ₪{vm.result.earnedNet.toLocaleString()}
                </div>
              </div>

              <div className={`${styles.summaryCard} ${styles.negative}`}>
                <div className={styles.cardLabel}>מס ששולם</div>
                <div className={`${styles.cardValue} ${styles.red}`}>
                  ₪{vm.result.taxPaid.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Breakdown */}
            <div className={styles.breakdown}>
              <div className={styles.breakdownTitle}>📊 מדדי ביצוע</div>
              <div className={styles.breakdownGrid}>
                <div className={styles.breakdownStat}>
                  <div className={styles.statLabel}>תשואה נטו</div>
                  <div className={styles.statValue}>
                    {vm.result.netReturn.toFixed(2)}%
                  </div>
                </div>
                <div className={styles.breakdownStat}>
                  <div className={styles.statLabel}>תשואה אפקטיבית שנתית</div>
                  <div className={styles.statValue}>
                    {vm.result.effectiveRate.toFixed(2)}%
                  </div>
                </div>
                <div className={styles.breakdownStat}>
                  <div className={styles.statLabel}>ריבית חודשית ממוצעת</div>
                  <div className={styles.statValue}>
                    ₪{vm.result.monthlyGrowth.toFixed(0)}
                  </div>
                </div>
                <div className={styles.breakdownStat}>
                  <div className={styles.statLabel}>רווחים ברוטו</div>
                  <div className={styles.statValue}>
                    ₪{vm.result.earnedGross.toLocaleString()}
                  </div>
                </div>
                <div className={styles.breakdownStat}>
                  <div className={styles.statLabel}>עמלות ששולמו</div>
                  <div className={styles.statValue}>
                    ₪{vm.result.feesPaid.toLocaleString()}
                  </div>
                </div>
                <div className={styles.breakdownStat}>
                  <div className={styles.statLabel}>חודשי חיסכון</div>
                  <div className={styles.statValue}>
                    {vm.result.schedule.length}
                  </div>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className={styles.chartCard}>
              <h3 className={styles.chartTitle}>גרף צמיחת החיסכון</h3>
              <div className={styles.chartWrapper}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={vm.result.schedule.filter((_, i) => i % Math.max(1, Math.floor(vm.result!.schedule.length / 50)) === 0)}
                    margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
                  >
                    <defs>
                      <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="depositGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E6F0" />

                    <XAxis
                      dataKey="month"
                      tickFormatter={(m) => `${Math.floor(m / 12)}ש׳`}
                      tick={{ fontSize: 12 }}
                    />

                    <YAxis
                      tickFormatter={(v) => `₪${(v / 1000).toFixed(0)}K`}
                      tick={{ fontSize: 12 }}
                    />

                    <Tooltip
                      formatter={(value: number | undefined, name: string | undefined) => {
                        if (value === undefined || name === undefined) return ['N/A', ''];
                        return [
                          `₪${value.toLocaleString()}`,
                          name === "balance" ? "יתרה" : "הופקד",
                        ];
                      }}
                      labelFormatter={(label: any) => {
                        const month = Number(label);
                        if (isNaN(month)) return '';
                        return `חודש ${month} (${Math.floor(month / 12)} שנים)`;
                      }}
                    />

                    <Legend
                      formatter={(value: string) =>
                        value === "balance" ? "יתרה" : "סה״כ הופקד"
                      }
                    />

                    <Area
                      type="monotone"
                      dataKey="depositedTotal"
                      stroke="#0EA5E9"
                      strokeWidth={2}
                      fill="url(#depositGradient)"
                      name="depositedTotal"
                    />

                    <Area
                      type="monotone"
                      dataKey="balance"
                      stroke="#4F46E5"
                      strokeWidth={2}
                      fill="url(#balanceGradient)"
                      name="balance"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Table */}
            <div className={styles.tableCard}>
              <div className={styles.tableHeader}>
                <h3 className={styles.tableTitle}>פירוט חודשי מלא</h3>
                <p className={styles.tableSubtitle}>
                  מעקב אחר כל חודש במהלך תקופת החיסכון
                </p>
              </div>
              <div className={styles.tableScroll}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>חודש</th>
                      <th>סה״כ הופקד</th>
                      <th>ריבית חודשית</th>
                      <th>יתרה</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vm.result.schedule.map((row) => (
                      <tr key={row.month}>
                        <td className={styles.highlight}>
                          {row.month} {row.month % 12 === 0 && `(${row.month / 12} שנים)`}
                        </td>
                        <td>₪{row.depositedTotal.toLocaleString()}</td>
                        <td className={styles.positive}>
                          ₪{row.interestEarned.toFixed(2)}
                        </td>
                        <td className={styles.highlight}>
                          ₪{row.balance.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavingsCalculatorPage;
