import  { useState, useEffect } from "react";
import styles from "./MortgageCalculatorPage.module.scss";
import BackToWelcomeButton from "../../components/BackToWelcomeButton/BackToWelcomeButton";

type MortgageRow = {
  price: number;
  route: string;
  method: string;
  months: number;
  interest: number;
  index: number | null;
  monthlyPayment: number;
  totalPaid: number;
};

const MortgageCalculatorPage = () => {
  const [rows, setRows] = useState<MortgageRow[]>([
    {
      price: 0,
      route: "",
      method: "spizer",
      months: 0,
      interest: 0,
      index: null,
      monthlyPayment: 0,
      totalPaid: 0,
    },
  ]);

  const handleRowChange = (
    index: number,
    field: keyof MortgageRow,
    value: string | number
  ) => {
    const updatedRows = [...rows];
    (updatedRows[index] as any)[field] =
      typeof value === "string" && !["route", "method"].includes(field)
        ? Number(value)
        : value;
    setRows(updatedRows);
  };

  const addRow = () => {
    setRows([
      ...rows,
      {
        price: 0,
        route: "",
        method: "spizer",
        months: 0,
        interest: 0,
        index: null,
        monthlyPayment: 0,
        totalPaid: 0,
      },
    ]);
  };

  const calculateRow = (row: MortgageRow): MortgageRow => {
    const P = row.price;
    const r = row.interest / 100 / 12;
    const n = row.months;

    if (row.method === "spizer" && r > 0) {
      const monthly = (P * r) / (1 - Math.pow(1 + r, -n));
      return { ...row, monthlyPayment: monthly, totalPaid: monthly * n };
    }

    if (row.method === "keren" && r > 0) {
      //const principalPart = P / n;
      const avgInterest = (P * r) / 2;
      const totalPaid = P + avgInterest;
      const monthlyPayment = totalPaid / n;
      return { ...row, monthlyPayment, totalPaid };
    }

    if (row.method === "bolit" && r > 0) {
  const monthlyPayment = P * r; // interest only
  const totalPaid = monthlyPayment * n + P; // all interest + principal at end
  return { ...row, monthlyPayment, totalPaid };
}

    return { ...row, monthlyPayment: 0, totalPaid: 0 };
  };

  const calculateAll = () => {
    const updated = rows.map((row) => calculateRow(row));
    setRows(updated);
  };

  useEffect(() => {
    calculateAll();
  }, [rows.length, JSON.stringify(rows)]);

  return (
    <div className={styles.calculator}>
      <BackToWelcomeButton />
      <h2 className={styles.title}>מחשבון משכנתא</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>סכום</th>
            <th>מסלול</th>
            <th>שיטת תשלום</th>
            <th>תקופה (חודשים)</th>
            <th>ריבית (%)</th>
            <th>מדד (%)</th>
            <th>החזר חודשי</th>
            <th>סה״כ תשלום</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>
                <input
                  type="number"
                  value={row.price || ""}
                  onChange={(e) =>
                    handleRowChange(index, "price", Number(e.target.value))
                  }
                />
              </td>
              <td>
                <select
                  value={row.route}
                  onChange={(e) =>
                    handleRowChange(index, "route", e.target.value)
                  }
                >
                  <option value="">בחר מסלול</option>
                  <option value="prime">פריים</option>
                  <option value="fixedIndex">קבועה צמודה</option>
                  <option value="fixedNoIndex">קבועה לא צמודה</option>
                  <option value="variable5NoIndex">משתנה לא צמודה כל 5</option>
                  <option value="variable5Index">משתנה צמודה כל 5</option>
                  <option value="eligibility">זכאות</option>
                  <option value="euro">יורו</option>
                  <option value="usd">דולר</option>
                  <option value="mkmAnchor">עוגן מק"מ</option>
                  <option value="variable1Index">משתנה צמודה כל שנה</option>
                  <option value="variable2Index">משתנה צמודה כל 2</option>
                  <option value="variable10Index">משתנה צמודה כל 10</option>
                </select>
              </td>
              <td>
                <select
                  value={row.method}
                  onChange={(e) =>
                    handleRowChange(index, "method", e.target.value)
                  }
                >
                  <option value="spizer">שפיצר</option>
                  <option value="keren">קרן שווה</option>
                  <option value="bolit">בולט</option>
                </select>
              </td>
              <td>
                <input
                  type="number"
                  value={row.months || ""}
                  onChange={(e) =>
                    handleRowChange(index, "months", Number(e.target.value))
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.interest || ""}
                  step="0.01"
                  onChange={(e) =>
                    handleRowChange(index, "interest", Number(e.target.value))
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.index ?? ""}
                  step="0.01"
                  onChange={(e) =>
                    handleRowChange(index, "index", Number(e.target.value))
                  }
                />
              </td>
        <td className={styles.resultCell}>
            {row.monthlyPayment !== null
                ? row.monthlyPayment.toLocaleString("he-IL", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,}): "-"}
            </td>
        <td className={styles.resultCell}>
             {row.totalPaid !== null
            ? row.totalPaid.toLocaleString("he-IL", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,}): "-"}
            </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className={styles.addRow} onClick={addRow}>
        ➕ הוסף מסלול
      </button>
    </div>
  );
};

export default MortgageCalculatorPage;
