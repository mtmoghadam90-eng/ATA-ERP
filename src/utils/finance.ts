import { Proforma, Transaction, ExchangeRate, Project } from '../types';

// Helper to map Persian currency names to English codes
export const mapCurrencyToEnglish = (persian: string | undefined): 'USD' | 'EUR' | 'AED' | 'CNY' | 'IRR' => {
  if (persian === 'دلار') return 'USD';
  if (persian === 'یورو') return 'EUR';
  if (persian === 'درهم') return 'AED';
  if (persian === 'یوان') return 'CNY';
  return 'IRR';
};

// Helper to determine proforma outcome status self-contained
export const getProformaStatus = (pf: Proforma): 'پیش‌نویس' | 'ارسال شده' | 'تأیید شده (برنده)' | 'لغو شده' | 'باخته' | 'نیمه برنده' => {
  if (pf.isCancelled || pf.status === 'لغو شده') return 'لغو شده';
  
  const items = pf.items || [];
  if (items.length === 0) {
    if (pf.status === 'تأیید شده (برنده)' || pf.status === 'باخته' || pf.status === 'نیمه برنده') {
      return pf.status;
    }
    return pf.status === 'پیش‌نویس' ? 'پیش‌نویس' : 'ارسال شده';
  }

  const wonCount = items.filter(i => i.status === 'برنده').length;
  const lostCount = items.filter(i => i.status === 'بازنده').length;

  if (wonCount === items.length) return 'تأیید شده (برنده)';
  if (lostCount === items.length) return 'باخته';
  if (wonCount > 0) return 'نیمه برنده';
  
  if (pf.status === 'تأیید شده (برنده)' || pf.status === 'باخته' || pf.status === 'نیمه برنده') {
    return pf.status;
  }

  return pf.status || 'پیش‌نویس';
};

// Helper to check if a proforma counts as a won/sales proforma
export const isSalesProforma = (pf: Proforma): boolean => {
  const status = getProformaStatus(pf);
  return status === 'تأیید شده (برنده)' || status === 'نیمه برنده';
};

// Helper to get won items currency amount
export const getWonItemsCurrencyAmount = (pf: Proforma): number => {
  const status = getProformaStatus(pf);
  if (status !== 'تأیید شده (برنده)' && status !== 'نیمه برنده') return 0;
  
  if (status === 'تأیید شده (برنده)') {
    return pf.finalAmount || 0;
  }
  
  // For semi-winner: only won items
  const items = pf.items || [];
  let wonItems = [];
  const hasExplicitWon = items.some(item => item.status === 'برنده');
  if (hasExplicitWon) {
    wonItems = items.filter(item => item.status === 'برنده');
  } else {
    wonItems = items.filter(item => item.status !== 'بازنده');
  }
  
  const wonItemsSumRaw = wonItems.reduce((sum, item) => sum + (item.totalPriceRIYAL || (item.quantity * item.unitPriceRIYAL) || 0), 0);
  const discountAmount = wonItemsSumRaw * (pf.discountPercent || 0) / 100;
  const taxAmount = (wonItemsSumRaw - discountAmount) * (pf.taxPercent || 0) / 100;
  return wonItemsSumRaw - discountAmount + taxAmount;
};

export interface ProformaFinanceReport {
  proformaId: string;
  proformaNumber: string;
  status: string;
  currency: 'دلار' | 'یورو' | 'درهم' | 'ریال' | 'یوان';
  salesAmountForeign: number;
  historicalExchangeRate: number;
  salesAmountHistoricalRiyal: number;
  
  actualReceivedRiyal: number;
  settledAmountForeign: number;
  settledSalesHistoricalRiyal: number;
  
  remainingAmountForeign: number;
  remainingAmountHistoricalRiyal: number;
  remainingAmountCurrentRiyal: number;
  
  realizedGainLoss: number;
  unrealizedGainLoss: number;
  settlementPercent: number;
  
  unallocatedRiyal: number; // Excess amount over sales amount
  
  missingHistoricalRate: boolean;
  missingSettlementRate: boolean;
}

// Compute finance details for a single proforma
export const calculateProformaFinance = (
  pf: Proforma,
  transactions: Transaction[],
  currentExchangeRates: ExchangeRate[]
): ProformaFinanceReport => {
  const currency = pf.currency || 'ریال';
  const isRiyal = currency === 'ریال';
  
  // 1. Sales amount in original currency
  const salesAmountForeign = getWonItemsCurrencyAmount(pf);
  
  // 2. Historical exchange rate
  let historicalExchangeRate = 1;
  let missingHistoricalRate = false;
  if (!isRiyal) {
    historicalExchangeRate = pf.historicalExchangeRate || 0;
    if (historicalExchangeRate <= 0) {
      missingHistoricalRate = true;
    }
  }
  
  // 3. Sales amount historical Rial
  const salesAmountHistoricalRiyal = salesAmountForeign * historicalExchangeRate;
  
  // 4. Find linked receipts
  const activeTransactions = transactions.filter(t => 
    t.type === 'دریافت' && 
    t.status !== 'پیش‌نویس' && 
    t.status !== 'لغو شده'
  );
  
  let actualReceivedRiyal = 0;
  let settledAmountForeign = 0;
  let missingSettlementRate = false;
  
  // For tracking unallocated excess
  let remainingForeignToSettle = salesAmountForeign;
  let unallocatedRiyal = 0;
  
  // Process transactions chronologically to allocate correctly
  const linkedTx = activeTransactions
    .filter(t => t.proformaId === pf.id)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
  for (const t of linkedTx) {
    let txRiyal = t.amountRIYAL || 0;
    let txRate = t.exchangeRate || 0;
    let txForeign = t.amountForeign || 0;
    
    if (!isRiyal && txRate <= 0) {
      missingSettlementRate = true;
    }
    
    let currentSettledForeign = 0;
    
    if (isRiyal) {
      currentSettledForeign = txRiyal;
      actualReceivedRiyal += txRiyal;
    } else {
      if (t.isDirectForeign) {
        // Direct foreign payment
        currentSettledForeign = txForeign;
        // Riyal equivalent is direct foreign * rate
        const calculatedRiyal = txForeign * (txRate || historicalExchangeRate || 1);
        actualReceivedRiyal += calculatedRiyal;
        txRiyal = calculatedRiyal;
      } else {
        // Rial payment for foreign currency
        actualReceivedRiyal += txRiyal;
        if (txRate > 0) {
          currentSettledForeign = txRiyal / txRate;
        } else {
          currentSettledForeign = 0;
        }
      }
    }
    
    // Check if we exceed remaining balance
    if (currentSettledForeign > remainingForeignToSettle + 0.0001) {
      const allowedForeign = remainingForeignToSettle;
      const excessForeign = currentSettledForeign - allowedForeign;
      
      settledAmountForeign += allowedForeign;
      remainingForeignToSettle = 0;
      
      // Part of the Rial amount goes to unallocated
      if (isRiyal) {
        unallocatedRiyal += excessForeign;
      } else {
        const rateToUse = txRate || historicalExchangeRate || 1;
        unallocatedRiyal += excessForeign * rateToUse;
      }
    } else {
      settledAmountForeign += currentSettledForeign;
      remainingForeignToSettle -= currentSettledForeign;
    }
  }
  
  // 5. Remaining balances
  const remainingAmountForeign = Math.max(0, salesAmountForeign - settledAmountForeign);
  const remainingAmountHistoricalRiyal = remainingAmountForeign * historicalExchangeRate;
  
  // 6. Current rate reporting
  let currentRate = 1;
  if (!isRiyal) {
    const engCode = mapCurrencyToEnglish(currency);
    const rateObj = currentExchangeRates.find(r => r.currency === engCode);
    currentRate = rateObj ? rateObj.rateToRIYAL : 0;
  }
  
  const remainingAmountCurrentRiyal = remainingAmountForeign * currentRate;
  
  // 7. Realized and Unrealized Gains/Losses
  const settledSalesHistoricalRiyal = settledAmountForeign * historicalExchangeRate;
  
  // Realized: Difference between actual received and historical cost of what was settled
  const realizedGainLoss = isRiyal ? 0 : (actualReceivedRiyal - unallocatedRiyal) - settledSalesHistoricalRiyal;
  
  // Unrealized: Difference between current day value of remaining and its historical value
  const unrealizedGainLoss = isRiyal ? 0 : remainingAmountCurrentRiyal - remainingAmountHistoricalRiyal;
  
  // 8. Settlement percentage
  const settlementPercent = salesAmountForeign > 0 
    ? Math.min(100, Math.round((settledAmountForeign / salesAmountForeign) * 10000) / 100) 
    : 0;
    
  return {
    proformaId: pf.id,
    proformaNumber: pf.proformaNumber,
    status: pf.status,
    currency: currency as any,
    salesAmountForeign,
    historicalExchangeRate,
    salesAmountHistoricalRiyal,
    actualReceivedRiyal: actualReceivedRiyal - unallocatedRiyal, // Allocated received
    settledAmountForeign,
    settledSalesHistoricalRiyal,
    remainingAmountForeign,
    remainingAmountHistoricalRiyal,
    remainingAmountCurrentRiyal,
    realizedGainLoss,
    unrealizedGainLoss,
    settlementPercent,
    unallocatedRiyal,
    missingHistoricalRate,
    missingSettlementRate
  };
};

export interface ProjectFinanceSummary {
  projectId: string;
  projectCode: string;
  projectName: string;
  customerId: string;
  customerName: string;
  status: string;
  
  proformas: ProformaFinanceReport[];
  
  totalSalesHistoricalRiyal: number;
  totalReceivedRiyal: number; // Sum of all actual received Rial (including unallocated)
  totalAllocatedReceivedRiyal: number;
  totalSettledSalesHistoricalRiyal: number;
  
  totalRemainingHistoricalRiyal: number;
  totalRemainingCurrentRiyal: number;
  
  totalRealizedGainLoss: number;
  totalUnrealizedGainLoss: number;
  
  totalUnallocatedRiyal: number; // Sum of excess payments + unallocated project-level receipts
  
  settlementPercent: number;
  
  // Currency-wise balances breakdown
  currencyBalances: { [key: string]: number };
  
  hasIncompleteData: boolean;
}

// Compute complete finance details for a project
export const calculateProjectFinance = (
  project: Project,
  allProformas: Proforma[],
  allTransactions: Transaction[],
  currentExchangeRates: ExchangeRate[]
): ProjectFinanceSummary => {
  // 1. Get won/semi-won proformas for this project
  const projectProformas = allProformas.filter(pf => pf.projectId === project.id && isSalesProforma(pf));
  
  // 2. Compute reports for each proforma
  const proformaReports = projectProformas.map(pf => 
    calculateProformaFinance(pf, allTransactions, currentExchangeRates)
  );
  
  // 3. Find unallocated transactions at the project level
  // These are receipts linked to this project but NOT assigned to any proforma
  const projectReceipts = allTransactions.filter(t => 
    t.projectId === project.id && 
    t.type === 'دریافت' && 
    t.status !== 'پیش‌نویس' && 
    t.status !== 'لغو شده'
  );
  
  const unallocatedTx = projectReceipts.filter(t => !t.proformaId);
  const directUnallocatedRiyal = unallocatedTx.reduce((sum, t) => sum + (t.amountRIYAL || 0), 0);
  
  // 4. Sum up
  let totalSalesHistoricalRiyal = 0;
  let totalAllocatedReceivedRiyal = 0;
  let totalSettledSalesHistoricalRiyal = 0;
  let totalRemainingHistoricalRiyal = 0;
  let totalRemainingCurrentRiyal = 0;
  let totalRealizedGainLoss = 0;
  let totalUnrealizedGainLoss = 0;
  let totalProformaUnallocatedRiyal = 0;
  
  const currencyBalances: { [key: string]: number } = {};
  let hasIncompleteData = false;
  
  for (const rep of proformaReports) {
    totalSalesHistoricalRiyal += rep.salesAmountHistoricalRiyal;
    totalAllocatedReceivedRiyal += rep.actualReceivedRiyal;
    totalSettledSalesHistoricalRiyal += rep.settledSalesHistoricalRiyal;
    totalRemainingHistoricalRiyal += rep.remainingAmountHistoricalRiyal;
    totalRemainingCurrentRiyal += rep.remainingAmountCurrentRiyal;
    totalRealizedGainLoss += rep.realizedGainLoss;
    totalUnrealizedGainLoss += rep.unrealizedGainLoss;
    totalProformaUnallocatedRiyal += rep.unallocatedRiyal;
    
    if (rep.missingHistoricalRate || rep.missingSettlementRate) {
      hasIncompleteData = true;
    }
    
    if (rep.remainingAmountForeign > 0) {
      currencyBalances[rep.currency] = (currencyBalances[rep.currency] || 0) + rep.remainingAmountForeign;
    }
  }
  
  const totalUnallocatedRiyal = directUnallocatedRiyal + totalProformaUnallocatedRiyal;
  const totalReceivedRiyal = totalAllocatedReceivedRiyal + totalUnallocatedRiyal;
  
  // Overall settlement percent
  const settlementPercent = totalSalesHistoricalRiyal > 0
    ? Math.min(100, Math.round((totalSettledSalesHistoricalRiyal / totalSalesHistoricalRiyal) * 10000) / 100)
    : 0;
    
  return {
    projectId: project.id,
    projectCode: project.code,
    projectName: project.name,
    customerId: project.customerId,
    customerName: project.customerName,
    status: project.status,
    proformas: proformaReports,
    totalSalesHistoricalRiyal,
    totalReceivedRiyal,
    totalAllocatedReceivedRiyal,
    totalSettledSalesHistoricalRiyal,
    totalRemainingHistoricalRiyal,
    totalRemainingCurrentRiyal,
    totalRealizedGainLoss,
    totalUnrealizedGainLoss,
    totalUnallocatedRiyal,
    settlementPercent,
    currencyBalances,
    hasIncompleteData
  };
};

export interface CompanyFinanceSummary {
  totalSalesHistoricalRiyal: number;
  totalReceivedRiyal: number;
  totalSettledSalesHistoricalRiyal: number;
  totalRemainingHistoricalRiyal: number;
  totalRemainingCurrentRiyal: number;
  totalRealizedGainLoss: number;
  totalUnrealizedGainLoss: number;
}

// Compute total summary for the whole company
export const calculateCompanyFinanceSummary = (
  projects: Project[],
  allProformas: Proforma[],
  allTransactions: Transaction[],
  currentExchangeRates: ExchangeRate[]
): CompanyFinanceSummary => {
  let totalSalesHistoricalRiyal = 0;
  let totalReceivedRiyal = 0;
  let totalSettledSalesHistoricalRiyal = 0;
  let totalRemainingHistoricalRiyal = 0;
  let totalRemainingCurrentRiyal = 0;
  let totalRealizedGainLoss = 0;
  let totalUnrealizedGainLoss = 0;
  
  // Sum up across all projects
  for (const proj of projects) {
    const summary = calculateProjectFinance(proj, allProformas, allTransactions, currentExchangeRates);
    totalSalesHistoricalRiyal += summary.totalSalesHistoricalRiyal;
    totalReceivedRiyal += summary.totalReceivedRiyal;
    totalSettledSalesHistoricalRiyal += summary.totalSettledSalesHistoricalRiyal;
    totalRemainingHistoricalRiyal += summary.totalRemainingHistoricalRiyal;
    totalRemainingCurrentRiyal += summary.totalRemainingCurrentRiyal;
    totalRealizedGainLoss += summary.totalRealizedGainLoss;
    totalUnrealizedGainLoss += summary.totalUnrealizedGainLoss;
  }
  
  // Also include general (project-less) receipts in total received
  const generalReceipts = allTransactions.filter(t => 
    !t.projectId && 
    t.type === 'دریافت' && 
    t.status !== 'پیش‌نویس' && 
    t.status !== 'لغو شده'
  );
  const generalReceivedRiyal = generalReceipts.reduce((sum, t) => sum + (t.amountRIYAL || 0), 0);
  totalReceivedRiyal += generalReceivedRiyal;
  
  return {
    totalSalesHistoricalRiyal,
    totalReceivedRiyal,
    totalSettledSalesHistoricalRiyal,
    totalRemainingHistoricalRiyal,
    totalRemainingCurrentRiyal,
    totalRealizedGainLoss,
    totalUnrealizedGainLoss
  };
};
