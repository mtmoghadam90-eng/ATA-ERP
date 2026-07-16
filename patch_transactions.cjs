const fs = require('fs');
let content = fs.readFileSync('src/components/TransactionsView.tsx', 'utf-8');

content = content.replace(
  `                      onChange={(e) => setAmountForeign(Number(e.target.value))}`,
  `                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setAmountForeign(val);
                        if (exchangeRate > 0) {
                          setAmountRIYAL(val * exchangeRate);
                        }
                      }}`
);

content = content.replace(
  `                          onChange={(e) => setExchangeRate(Number(e.target.value))}`,
  `                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setExchangeRate(val);
                            if (amountForeign > 0) {
                              setAmountRIYAL(amountForeign * val);
                            }
                          }}`
);

fs.writeFileSync('src/components/TransactionsView.tsx', content);
