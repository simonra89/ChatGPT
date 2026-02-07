const incomeInput = document.getElementById("income");
const deductionsInput = document.getElementById("deductions");
const calculateButton = document.getElementById("calculate");

const taxableIncomeEl = document.getElementById("taxable-income");
const totalTaxEl = document.getElementById("total-tax");
const effectiveRateEl = document.getElementById("effective-rate");
const afterTaxIncomeEl = document.getElementById("after-tax-income");
const breakdownListEl = document.getElementById("breakdown-list");

const brackets = [
  { min: 0, max: 50000, rate: 0 },
  { min: 50000, max: 100000, rate: 0.1 },
  { min: 100000, max: 200000, rate: 0.2 },
  { min: 200000, max: Infinity, rate: 0.3 },
];

const currencyFormatter = new Intl.NumberFormat("nb-NO", {
  style: "currency",
  currency: "NOK",
  maximumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat("nb-NO", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const parseValue = (value) => Math.max(0, Number.parseFloat(value) || 0);

const calculateTax = (taxableIncome) => {
  const breakdown = [];
  let totalTax = 0;

  brackets.forEach(({ min, max, rate }) => {
    const taxableInBracket = Math.max(
      0,
      Math.min(taxableIncome, max) - min,
    );
    const tax = taxableInBracket * rate;
    totalTax += tax;
    breakdown.push({
      label: `${currencyFormatter.format(min)} – ${
        Number.isFinite(max) ? currencyFormatter.format(max) : "og oppover"
      }`,
      amount: tax,
      rate,
      taxableInBracket,
    });
  });

  return { totalTax, breakdown };
};

const renderResults = () => {
  const income = parseValue(incomeInput.value);
  const deductions = parseValue(deductionsInput.value);
  const taxableIncome = Math.max(0, income - deductions);

  const { totalTax, breakdown } = calculateTax(taxableIncome);
  const effectiveRate = income > 0 ? totalTax / income : 0;
  const afterTaxIncome = income - totalTax;

  taxableIncomeEl.textContent = currencyFormatter.format(taxableIncome);
  totalTaxEl.textContent = currencyFormatter.format(totalTax);
  effectiveRateEl.textContent = percentFormatter.format(effectiveRate);
  afterTaxIncomeEl.textContent = currencyFormatter.format(afterTaxIncome);

  breakdownListEl.innerHTML = "";
  breakdown.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <strong>${item.label}</strong><br />
      Skattepliktig del: ${currencyFormatter.format(item.taxableInBracket)} ·
      Sats: ${percentFormatter.format(item.rate)} ·
      Skatt: ${currencyFormatter.format(item.amount)}
    `;
    breakdownListEl.appendChild(listItem);
  });
};

calculateButton.addEventListener("click", renderResults);
document.addEventListener("DOMContentLoaded", renderResults);
