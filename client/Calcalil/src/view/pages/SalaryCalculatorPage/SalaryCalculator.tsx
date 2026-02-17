import React from 'react';
import { useSalaryCalculatorVM, CURRENCIES, fmt, fmtDelta } from './SalaryCalculator.vm';
import type { Currency, ProjectionRow } from './SalaryCalculator.vm';
import styles from './SalaryCalculator.module.scss';

// ─── Sub-components ───────────────────────────────────────────────────────────

interface SliderInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  accent: string;
  onChange: (v: number) => void;
}

const SliderInput: React.FC<SliderInputProps> = ({
  label, value, min, max, step, display, accent, onChange,
}) => {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className={styles.sliderWrapper}>
      <div className={styles.sliderHeader}>
        <span className={styles.sliderLabel}>{label}</span>
        <span className={styles.sliderValue} style={{ color: accent }}>{display}</span>
      </div>
      <div className={styles.sliderTrack}>
        <div
          className={styles.sliderFill}
          style={{ width: `${pct}%`, background: accent }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={styles.sliderInput}
        />
        <div
          className={styles.sliderThumb}
          style={{ left: `${pct}%`, background: accent }}
        />
      </div>
    </div>
  );
};

interface NumberInputProps {
  label: string;
  value: number;
  currency: Currency;
  accent: string;
  onChange: (v: number) => void;
}

const NumberInput: React.FC<NumberInputProps> = ({
  label, value, currency, accent, onChange,
}) => {
  const [raw, setRaw] = React.useState<string>(String(value));

  React.useEffect(() => {
    setRaw(String(value));
  }, [value]);

  const handleChange = (v: string): void => {
    setRaw(v);
    const n = parseFloat(v.replace(/,/g, ''));
    if (!isNaN(n) && n >= 0) onChange(n);
  };

  return (
    <div className={styles.numberInputWrapper}>
      <span className={styles.numberInputLabel}>{label}</span>
      <div className={styles.numberInputField}>
        <span className={styles.numberInputSymbol} style={{ color: accent }}>
          {currency}
        </span>
        <input
          type="text"
          value={raw}
          className={styles.numberInput}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={() => setRaw(String(value))}
          onFocus={(e) => (e.target.style.borderColor = accent)}
          onBlurCapture={(e) => (e.target.style.borderColor = '#2e2e2e')}
        />
      </div>
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

const SalaryCalculator: React.FC = () => {
  const vm = useSalaryCalculatorVM();

  return (
    <div className={styles.root}>

      {/* ── כותרת ראשית ── */}
      <header className={styles.header}>
        <div className={styles.currencyBar}>
          {CURRENCIES.map((c) => (
            <button
              key={c}
              onClick={() => vm.setCurrency(c)}
              className={`${styles.currencyBtn} ${vm.currency === c ? styles.active : ''}`}
            >
              {c}
            </button>
          ))}
        </div>
        <h1 className={styles.title}>מחשבון צמיחת שכר</h1>
        <p className={styles.subtitle}>גלה איך השכר שלך גדל עם כל העלאה</p>
      </header>

      <div className={styles.content}>

        {/* ── תמונת מצב נוכחית ── */}
        <div className={styles.snapshotGrid}>
          {[
            { label: 'שכר בסיס',    value: fmt(vm.base, vm.currency),  color: '#0EA5E9' },
            { label: 'בונוס',        value: fmt(vm.bonus, vm.currency), color: '#7C3AED' },
            { label: 'חבילה כוללת', value: fmt(vm.total, vm.currency), color: '#4F46E5' },
          ].map(({ label, value, color }) => (
            <div key={label} className={styles.snapshotCard}>
              <div className={styles.snapshotLabel}>{label}</div>
              <div className={styles.snapshotValue} style={{ color }}>{value}</div>
            </div>
          ))}
        </div>

        {/* ── קלטים ── */}
        <div className={styles.inputsGrid}>
          <div className={styles.panel}>
            <div className={styles.panelTitle}>השכר הנוכחי שלי</div>
            <NumberInput
              label="שכר בסיס"
              value={vm.base}
              onChange={vm.setBase}
              currency={vm.currency}
              accent="#0EA5E9"
            />
            <NumberInput
              label="בונוס"
              value={vm.bonus}
              onChange={vm.setBonus}
              currency={vm.currency}
              accent="#7C3AED"
            />
          </div>

          <div className={styles.panel}>
            <div className={styles.panelTitle}>הגדרות העלאה</div>
            <SliderInput
              label="העלאה שנתית (% משכר הבסיס)"
              value={vm.raisePercent}
              min={1} max={30} step={0.5}
              display={`${vm.raisePercent}%`}
              onChange={vm.setRaisePercent}
              accent="#4F46E5"
            />
            <SliderInput
              label="% מהעלאה שיועבר לבונוס"
              value={vm.bonusSplit}
              min={0} max={100} step={5}
              display={`${vm.bonusSplit}%`}
              onChange={vm.setBonusSplit}
              accent="#7C3AED"
            />
            <SliderInput
              label="שנות תחזית"
              value={vm.years}
              min={1} max={15} step={1}
              display={`${vm.years} שנ׳`}
              onChange={vm.setYears}
              accent="#0EA5E9"
            />
          </div>
        </div>

        {/* ── פירוט חלוקת ההעלאה ── */}
        <div className={styles.breakdown}>
          <div className={styles.breakdownTitle}>
            📋 איך ההעלאה מתחלקת (דוגמה לשנה הראשונה)
          </div>
          <div className={styles.breakdownGrid}>
            {vm.breakdownItems.map(({ label, value, sub, color }) => (
              <div key={label} className={styles.breakdownCell}>
                <div className={styles.breakdownCellLabel}>{label}</div>
                <div className={styles.breakdownCellValue} style={{ color }}>{value}</div>
                <div className={styles.breakdownCellSub}>{sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── גרף שנתי ── */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <span className={styles.chartTitle}>תחזית שנה אחר שנה</span>
            <div className={styles.chartLegend}>
              <span>
                <span className={styles.legendDot} style={{ background: '#0EA5E9' }} />
                בסיס
              </span>
              <span>
                <span className={styles.legendDot} style={{ background: '#7C3AED' }} />
                בונוס
              </span>
            </div>
          </div>

          <div className={styles.chartRows}>
            {vm.projection.map((row: ProjectionRow, i: number) => {
              const bW = (row.base / vm.maxTotal) * 100;
              const bonW = (row.bonus / vm.maxTotal) * 100;
              const delta = i > 0 ? row.total - vm.projection[i - 1].total : 0;
              return (
                <div key={row.year} className={styles.chartRow}>
                  <div
                    className={styles.chartRowLabel}
                    style={{ color: i === 0 ? '#4F46E5' : '#9BA3C4', fontWeight: i === 0 ? 700 : 400 }}
                  >
                    {i === 0 ? 'היום' : `שנה ${row.year}`}
                  </div>
                  <div className={styles.chartBars}>
                    <div className={styles.barBase} style={{ width: `${bW}%` }} />
                    <div className={styles.barBonus} style={{ width: `${bonW}%` }} />
                  </div>
                  <div className={styles.chartRowTotal}>
                    {fmt(row.total, vm.currency)}
                    {i > 0 && (
                      <span className={styles.chartDelta}>
                        {fmtDelta(delta, vm.currency)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── טבלה מפורטת ── */}
        <div className={styles.tableCard}>
          <div className={styles.tableCardTitle}>פירוט מלא</div>
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  {['שנה', 'שכר בסיס', 'בונוס', 'חבילה כוללת', 'סכום ההעלאה', 'צמיחה מצטברת'].map((h) => (
                    <th key={h} className={styles.tableTh}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vm.projection.map((row: ProjectionRow, i: number) => {
                  const raiseAmt = i > 0 ? row.total - vm.projection[i - 1].total : 0;
                  const cumGrowth = ((row.total - vm.total) / vm.total * 100).toFixed(1);
                  const isFirst = i === 0;
                  return (
                    <tr key={row.year} className={`${styles.tableTr} ${isFirst ? styles.currentRow : ''}`}>
                      <td className={styles.tableTd} style={{ color: isFirst ? '#4F46E5' : '#1A1D2E', fontWeight: isFirst ? 700 : 500 }}>
                        {isFirst ? 'נוכחי' : `שנה ${row.year}`}
                      </td>
                      <td className={styles.tableTd} style={{ color: '#0EA5E9' }}>{fmt(row.base, vm.currency)}</td>
                      <td className={styles.tableTd} style={{ color: '#7C3AED' }}>{fmt(row.bonus, vm.currency)}</td>
                      <td className={styles.tableTd} style={{ color: '#1A1D2E', fontWeight: 700 }}>{fmt(row.total, vm.currency)}</td>
                      <td className={styles.tableTd} style={{ color: isFirst ? '#B8BEDA' : '#059669' }}>
                        {isFirst ? '—' : fmtDelta(raiseAmt, vm.currency)}
                      </td>
                      <td className={styles.tableTd} style={{ color: isFirst ? '#B8BEDA' : '#4F46E5' }}>
                        {isFirst ? '—' : `+${cumGrowth}%`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── סיכום ── */}
        <div className={styles.summaryCallout}>
          <div className={styles.summaryLabel}>
            בעוד {vm.years} שנ{vm.years > 1 ? 'ים' : 'ה'} תרוויח
          </div>
          <div className={styles.summaryAmount}>
            {fmt(vm.finalYear.total, vm.currency)}
          </div>
          <div className={styles.summaryStats}>
            <div className={styles.summaryStat}>
              לעומת היום <span style={{ color: '#fff' }}>{fmt(vm.total, vm.currency)}</span>
            </div>
            <div className={styles.summaryStat}>
              רווח כולל <span style={{ color: '#fff' }}>+{fmt(vm.totalGain, vm.currency)}</span>
            </div>
            <div className={styles.summaryStat}>
              צמיחה <span style={{ color: '#fff' }}>+{((vm.totalGain / vm.total) * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            ── מכונת הזמן ──
        ══════════════════════════════════════════════════════ */}
        <section className={styles.timeMachineSection}>

          <div className={styles.sectionHeading}>
            <div className={styles.sectionEyebrow}>מכונת הזמן</div>
            <h2 className={styles.sectionTitle}>כמה ארוויח בשנה...?</h2>
            <p className={styles.sectionSubtitle}>
              הכנס מספר שנה כלשהו וראה מיד את השכר החזוי שלך
            </p>
          </div>

          {/* שדה הזנת שנה */}
          <div className={styles.yearPickerWrapper}>
            <div className={styles.yearPickerInner}>
              <div className={styles.yearPickerAboveLabel}>מספר שנים מהיום</div>
              <div className={styles.yearPickerControl}>
                <button
                  className={styles.yearPickerBtn}
                  onClick={() => vm.stepLookupYear(-1)}
                >
                  −
                </button>
                <div className={styles.yearPickerInputArea}>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={vm.lookupInput}
                    className={styles.yearPickerInput}
                    onChange={(e) => vm.handleLookupChange(e.target.value)}
                    onBlur={() => {
                      if (vm.lookupYear >= 1 && vm.lookupYear <= 100) {
                        vm.handleLookupChange(String(vm.lookupYear));
                      }
                    }}
                  />
                  <span className={styles.yearPickerHint}>שנים מהיום · עד 100</span>
                </div>
                <button
                  className={styles.yearPickerBtn}
                  onClick={() => vm.stepLookupYear(1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* כרטיס תוצאה */}
          <div
            key={`${vm.lookupYear}-${vm.base}-${vm.bonus}-${vm.raisePercent}-${vm.bonusSplit}`}
            className={styles.resultCard}
          >
            <div className={styles.resultCardAccentBar} />

            <div className={styles.resultCardBody}>

              {/* תוצאה ראשית */}
              <div className={styles.resultMainSection}>
                <div className={styles.resultIntro}>
                  בעוד <strong>שנה {vm.lookupYear}</strong> החבילה השנתית שלך תהיה
                </div>
                <div className={styles.resultAmount}>
                  {fmt(vm.lookupResult.total, vm.currency)}
                </div>
                <div className={styles.resultBadges}>
                  <span className={`${styles.badge} ${styles.green}`}>
                    {fmtDelta(vm.lookupGain, vm.currency)} רווח
                  </span>
                  <span className={`${styles.badge} ${styles.gold}`}>
                    +{vm.lookupGainPct}% צמיחה
                  </span>
                  <span className={`${styles.badge} ${styles.neutral}`}>
                    {(vm.lookupResult.total / vm.total).toFixed(2)}× השכר הנוכחי
                  </span>
                </div>
              </div>

              {/* בסיס / בונוס */}
              <div className={styles.splitGrid}>
                <div className={`${styles.splitCard} ${styles.baseCard}`}>
                  <div className={styles.splitCardLabel}>שכר בסיס</div>
                  <div className={styles.splitCardValue} style={{ color: '#0EA5E9' }}>
                    {fmt(vm.lookupResult.base, vm.currency)}
                  </div>
                  <div className={styles.splitCardDelta}>
                    {fmtDelta(vm.lookupResult.base - vm.base, vm.currency)} לעומת היום
                  </div>
                </div>
                <div className={`${styles.splitCard} ${styles.bonusCard}`}>
                  <div className={styles.splitCardLabel}>בונוס</div>
                  <div className={styles.splitCardValue} style={{ color: '#7C3AED' }}>
                    {fmt(vm.lookupResult.bonus, vm.currency)}
                  </div>
                  <div className={styles.splitCardDelta}>
                    {fmtDelta(vm.lookupResult.bonus - vm.bonus, vm.currency)} לעומת היום
                  </div>
                </div>
              </div>

              {/* סרגל התקדמות */}
              {/* <div className={styles.progressBox}>
                <div className={styles.progressLabels}>
                  <span>היום — {fmt(vm.total, vm.currency)}</span>
                  <span>שנה {vm.lookupYear} — {fmt(vm.lookupResult.total, vm.currency)}</span>
                </div>
                <div className={styles.progressTrack}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${Math.min((vm.total / vm.lookupResult.total) * 100, 97)}%` }}
                  >
                    <div className={styles.progressDot} />
                  </div>
                </div>
                <div className={styles.progressStats}>
                  {[
                    { label: `חודשי (שנה ${vm.lookupYear})`, value: fmt(vm.lookupResult.total / 12, vm.currency), color: '#EA580C' },
                    { label: 'חודשי היום',                   value: fmt(vm.total / 12, vm.currency),             color: '#9BA3C4' },
                    { label: 'רווח חודשי',                   value: fmtDelta((vm.lookupResult.total - vm.total) / 12, vm.currency), color: '#059669' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className={styles.progressStat}>
                      <div className={styles.progressStatLabel}>{label}</div>
                      <div className={styles.progressStatValue} style={{ color }}>{value}</div>
                    </div>
                  ))}
                </div>
              </div> */}

            </div>
          </div>

        </section>
      </div>
    </div>
  );
};

export default SalaryCalculator;
