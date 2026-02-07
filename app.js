const wageIncomeInput = document.getElementById("wage-income");
const pensionIncomeInput = document.getElementById("pension-income");
const capitalIncomeInput = document.getElementById("capital-income");
const shareGainInput = document.getElementById("share-gain");
const shareLossInput = document.getElementById("share-loss");
const generalDeductionsInput = document.getElementById("general-deductions");
const netWealthInput = document.getElementById("net-wealth");
const ageGroupInput = document.getElementById("age-group");
const regionInput = document.getElementById("region");
const calculateButton = document.getElementById("calculate");

const ordinaryIncomeEl = document.getElementById("ordinary-income");
const totalTaxEl = document.getElementById("total-tax");
const effectiveRateEl = document.getElementById("effective-rate");
const afterTaxIncomeEl = document.getElementById("after-tax-income");
const breakdownListEl = document.getElementById("breakdown-list");
const ratesSummaryEl = document.getElementById("rates-summary");

const taxConfig2026 = {
  ordinaryIncome: {
    rate: 0.22,
    rateTromsFinnmark: 0.185,
  },
  allowances: {
    personfradragClass1: 114540,
  },
  minstefradrag: {
    wage: { rate: 0.46, max: 95700 },
    pension: { rate: 0.4, max: 91350 },
  },
  trinnskatt: [
    { min: 0, max: 226100, rate: 0.0 },
    { min: 226100, max: 318300, rate: 0.017 },
    { min: 318300, max: 725050, rate: 0.04 },
    { min: 725050, max: 980100, rate: 0.137 },
    { min: 980100, max: 1467200, rate: 0.168 },
    { min: 1467200, max: Infinity, rate: 0.178 },
  ],
  trygdeavgift: {
    lowerThreshold: 99650,
    phaseInCapRate: 0.25,
    rates: {
      wageUnder17OrOver69: 0.051,
      wage17To69: 0.076,
      pension: 0.051,
    },
  },
  wealthTax: {
    allowance: 1900000,
    totalRateUpTo: 0.00675,
    totalRateAbove: 0.00875,
    breakpoint: 21700000,
  },
  shareholder: {
    upliftFactor: 1.72,
  },
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

const calculateStepTax = (personIncome) => {
  const breakdown = [];
  let totalTax = 0;

  taxConfig2026.trinnskatt.forEach(({ min, max, rate }, index) => {
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

const calculateMinstefradrag = (income, config) => {
  if (income <= 0) {
    return 0;
  }
  return Math.min(income * config.rate, config.max);
};

const calculateTrygdeavgift = (income, rate) => {
  const { lowerThreshold, phaseInCapRate } = taxConfig2026.trygdeavgift;
  if (income <= lowerThreshold) {
    return 0;
  }
  const rawTax = income * rate;
  const cappedTax = phaseInCapRate * (income - lowerThreshold);
  return Math.min(rawTax, cappedTax);
};

const calculateWealthTax = (netWealth) => {
  if (netWealth <= taxConfig2026.wealthTax.allowance) {
    return 0;
  }
  const taxableWealth = netWealth - taxConfig2026.wealthTax.allowance;
  const baseRate = taxConfig2026.wealthTax.totalRateUpTo;
  const aboveRate = taxConfig2026.wealthTax.totalRateAbove;
  const breakpoint = taxConfig2026.wealthTax.breakpoint;

  if (netWealth <= breakpoint) {
    return taxableWealth * baseRate;
  }

  const taxableBelow = breakpoint - taxConfig2026.wealthTax.allowance;
  const taxableAbove = netWealth - breakpoint;
  return taxableBelow * baseRate + taxableAbove * aboveRate;
};

const renderResults = () => {
  const wageIncome = parseValue(wageIncomeInput.value);
  const pensionIncome = parseValue(pensionIncomeInput.value);
  const capitalIncome = parseValue(capitalIncomeInput.value);
  const shareGain = parseValue(shareGainInput.value);
  const shareLoss = parseValue(shareLossInput.value);
  const generalDeductions = parseValue(generalDeductionsInput.value);
  const netWealth = parseValue(netWealthInput.value);
  const ageGroup = ageGroupInput.value;
  const region = regionInput.value;

  const shareNet = shareGain - shareLoss;
  const adjustedShareNet =
    shareNet * taxConfig2026.shareholder.upliftFactor;
  const minstefradragWage = calculateMinstefradrag(
    wageIncome,
    taxConfig2026.minstefradrag.wage,
  );
  const minstefradragPension = calculateMinstefradrag(
    pensionIncome,
    taxConfig2026.minstefradrag.pension,
  );
  const personfradrag = taxConfig2026.allowances.personfradragClass1;
  const totalDeductions =
    generalDeductions + minstefradragWage + minstefradragPension + personfradrag;
  const ordinaryIncome =
    wageIncome +
    pensionIncome +
    capitalIncome +
    adjustedShareNet -
    totalDeductions;
  const taxableOrdinaryIncome = Math.max(0, ordinaryIncome);
  const personIncome = wageIncome + pensionIncome;

  const ordinaryRate =
    region === "troms-finnmark"
      ? taxConfig2026.ordinaryIncome.rateTromsFinnmark
      : taxConfig2026.ordinaryIncome.rate;
  const ordinaryIncomeTax = taxableOrdinaryIncome * ordinaryRate;

  const wageRate =
    ageGroup === "under17-over69"
      ? taxConfig2026.trygdeavgift.rates.wageUnder17OrOver69
      : taxConfig2026.trygdeavgift.rates.wage17To69;
  const pensionRate = taxConfig2026.trygdeavgift.rates.pension;
  const socialSecurityTax =
    calculateTrygdeavgift(wageIncome, wageRate) +
    calculateTrygdeavgift(pensionIncome, pensionRate);
  const { totalTax: stepTaxTotal, breakdown: stepTaxBreakdown } =
    calculateStepTax(personIncome);
  const wealthTax = calculateWealthTax(netWealth);

  const totalTax = ordinaryIncomeTax + socialSecurityTax + stepTaxTotal + wealthTax;
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
      rate: ordinaryRate,
      taxableInBracket: taxableOrdinaryIncome,
    },
    {
      label: "Trygdeavgift lønn",
      amount: calculateTrygdeavgift(wageIncome, wageRate),
      rate: wageRate,
      taxableInBracket: wageIncome,
    },
    {
      label: "Trygdeavgift pensjon",
      amount: calculateTrygdeavgift(pensionIncome, pensionRate),
      rate: pensionRate,
      taxableInBracket: pensionIncome,
    },
    ...stepTaxBreakdown,
    {
      label: "Formuesskatt",
      amount: wealthTax,
      rate: null,
      taxableInBracket: netWealth,
    },
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
      value: taxConfig2026.ordinaryIncome.rate,
      format: "percent",
    },
    {
      title: "Alminnelig inntekt (Troms/Finnmark)",
      value: taxConfig2026.ordinaryIncome.rateTromsFinnmark,
      format: "percent",
    },
    {
      title: "Aksjeoppjusteringsfaktor",
      value: taxConfig2026.shareholder.upliftFactor,
      format: "factor",
    },
    {
      title: "Trygdeavgift lønn",
      value: taxConfig2026.trygdeavgift.rates.wage17To69,
      format: "percent",
    },
    {
      title: "Trygdeavgift pensjon",
      value: taxConfig2026.trygdeavgift.rates.pension,
      format: "percent",
    },
    {
      title: "Formuesskatt (til 21,7 mill.)",
      value: taxConfig2026.wealthTax.totalRateUpTo,
      format: "percent",
    },
    {
      title: "Formuesskatt (over 21,7 mill.)",
      value: taxConfig2026.wealthTax.totalRateAbove,
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

document.addEventListener("DOMContentLoaded", () => {
  renderRateSummary();
  renderResults();
});

calculateButton.addEventListener("click", renderResults);
