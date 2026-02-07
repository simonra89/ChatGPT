const wageIncomeInput = document.getElementById("wage-income");
const pensionIncomeInput = document.getElementById("pension-income");
const capitalIncomeInput = document.getElementById("capital-income");
const shareGainInput = document.getElementById("share-gain");
const shareLossInput = document.getElementById("share-loss");
const generalDeductionsInput = document.getElementById("general-deductions");
const calculateButton = document.getElementById("calculate");

const ordinaryIncomeEl = document.getElementById("ordinary-income");
const totalTaxEl = document.getElementById("total-tax");
const effectiveRateEl = document.getElementById("effective-rate");
const afterTaxIncomeEl = document.getElementById("after-tax-income");
const breakdownListEl = document.getElementById("breakdown-list");
const rateWarningEl = document.getElementById("rate-warning");
const ratesSummaryEl = document.getElementById("rates-summary");

const taxConfig2026 = {
  ordinaryIncomeRate: null,
  shareAdjustmentFactor: null,
  socialSecurity: {
    wageRate: null,
    pensionRate: null,
  },
  stepTax: [
    { min: 0, max: null, rate: null },
    { min: null, max: null, rate: null },
    { min: null, max: null, rate: null },
    { min: null, max: null, rate: null },
    { min: null, max: Infinity, rate: null },
  ],
};

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

const factorFormatter = new Intl.NumberFormat("nb-NO", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const parseValue = (value) => Math.max(0, Number.parseFloat(value) || 0);

const isConfigComplete = () => {
  const hasOrdinaryRate = Number.isFinite(taxConfig2026.ordinaryIncomeRate);
  const hasShareFactor = Number.isFinite(taxConfig2026.shareAdjustmentFactor);
  const hasSocial =
    Number.isFinite(taxConfig2026.socialSecurity.wageRate) &&
    Number.isFinite(taxConfig2026.socialSecurity.pensionRate);
  const hasStepTax = taxConfig2026.stepTax.every(
    (step) =>
      Number.isFinite(step.min) &&
      (Number.isFinite(step.max) || step.max === Infinity) &&
      Number.isFinite(step.rate),
  );

  return hasOrdinaryRate && hasShareFactor && hasSocial && hasStepTax;
};

const calculateStepTax = (personIncome) => {
  const breakdown = [];
  let totalTax = 0;

  taxConfig2026.stepTax.forEach(({ min, max, rate }, index) => {
    const taxableInBracket = Math.max(
      0,
      Math.min(personIncome, max) - min,
    );
    const tax = taxableInBracket * rate;
    totalTax += tax;
    breakdown.push({
      label: `Trinn ${index + 1}: ${currencyFormatter.format(min)} – ${
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
  const wageIncome = parseValue(wageIncomeInput.value);
  const pensionIncome = parseValue(pensionIncomeInput.value);
  const capitalIncome = parseValue(capitalIncomeInput.value);
  const shareGain = parseValue(shareGainInput.value);
  const shareLoss = parseValue(shareLossInput.value);
  const generalDeductions = parseValue(generalDeductionsInput.value);

  const shareNet = shareGain - shareLoss;
  const adjustedShareNet =
    shareNet * (taxConfig2026.shareAdjustmentFactor || 0);
  const ordinaryIncome =
    wageIncome +
    pensionIncome +
    capitalIncome +
    adjustedShareNet -
    generalDeductions;
  const taxableOrdinaryIncome = Math.max(0, ordinaryIncome);
  const personIncome = wageIncome + pensionIncome;

  if (!isConfigComplete()) {
    ordinaryIncomeEl.textContent =
      currencyFormatter.format(taxableOrdinaryIncome);
    totalTaxEl.textContent = "–";
    effectiveRateEl.textContent = "–";
    afterTaxIncomeEl.textContent = "–";
    breakdownListEl.innerHTML = "";
    const listItem = document.createElement("li");
    listItem.textContent =
      "Satser for 2026 mangler. Oppdater app.js før du beregner skatt.";
    breakdownListEl.appendChild(listItem);
    return;
  }

  const ordinaryIncomeTax = taxableOrdinaryIncome *
    (taxConfig2026.ordinaryIncomeRate || 0);
  const socialSecurityTax =
    wageIncome * (taxConfig2026.socialSecurity.wageRate || 0) +
    pensionIncome * (taxConfig2026.socialSecurity.pensionRate || 0);
  const { totalTax: stepTaxTotal, breakdown: stepTaxBreakdown } =
    calculateStepTax(personIncome);

  const totalTax = ordinaryIncomeTax + socialSecurityTax + stepTaxTotal;
  const totalIncome =
    wageIncome + pensionIncome + capitalIncome + shareGain - shareLoss;
  const effectiveRate = totalIncome > 0 ? totalTax / totalIncome : 0;
  const afterTaxIncome = totalIncome - totalTax;

  ordinaryIncomeEl.textContent = currencyFormatter.format(taxableOrdinaryIncome);
  totalTaxEl.textContent = currencyFormatter.format(totalTax);
  effectiveRateEl.textContent = percentFormatter.format(effectiveRate);
  afterTaxIncomeEl.textContent = currencyFormatter.format(afterTaxIncome);

  breakdownListEl.innerHTML = "";
  [
    {
      label: "Skatt på alminnelig inntekt",
      amount: ordinaryIncomeTax,
      rate: taxConfig2026.ordinaryIncomeRate,
      taxableInBracket: taxableOrdinaryIncome,
    },
    {
      label: "Trygdeavgift",
      amount: socialSecurityTax,
      rate: null,
      taxableInBracket: personIncome,
    },
    ...stepTaxBreakdown,
  ].forEach((item) => {
    const listItem = document.createElement("li");
    const rateLine = Number.isFinite(item.rate)
      ? `Sats: ${percentFormatter.format(item.rate)} · `
      : "";
    listItem.innerHTML = `
      <strong>${item.label}</strong><br />
      Grunnlag: ${currencyFormatter.format(item.taxableInBracket)} ·
      ${rateLine}Skatt: ${currencyFormatter.format(item.amount)}
    `;
    breakdownListEl.appendChild(listItem);
  });
};

const renderRateSummary = () => {
  ratesSummaryEl.innerHTML = "";
  const summaryItems = [
    {
      title: "Skatt på alminnelig inntekt",
      value: taxConfig2026.ordinaryIncomeRate,
      format: "percent",
    },
    {
      title: "Aksjeoppjusteringsfaktor",
      value: taxConfig2026.shareAdjustmentFactor,
      format: "factor",
    },
    {
      title: "Trygdeavgift lønn",
      value: taxConfig2026.socialSecurity.wageRate,
      format: "percent",
    },
    {
      title: "Trygdeavgift pensjon",
      value: taxConfig2026.socialSecurity.pensionRate,
      format: "percent",
    },
  ];

  summaryItems.forEach((item) => {
    const row = document.createElement("div");
    row.className = "rates-summary__item";
    const valueText = Number.isFinite(item.value)
      ? item.format === "factor"
        ? `x ${factorFormatter.format(item.value)}`
        : percentFormatter.format(item.value)
      : "Mangler";
    row.innerHTML = `<strong>${item.title}</strong><br />${valueText}`;
    ratesSummaryEl.appendChild(row);
  });
};

const updateWarning = () => {
  rateWarningEl.hidden = isConfigComplete();
};

document.addEventListener("DOMContentLoaded", () => {
  updateWarning();
  renderRateSummary();
  renderResults();
});

calculateButton.addEventListener("click", renderResults);
