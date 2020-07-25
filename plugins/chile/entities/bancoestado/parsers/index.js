import BaseBancoEstadoParser from './BaseBancoEstadoParser';
import BancoEstadoExpensePurchaseParser from './BancoEstadoExpensePurchaseParser';
import BancoEstadoDepositDonationParser from './BancoEstadoDepositDonationParser';
import BancoEstadoDepositTransferParser from './BancoEstadoDepositTransferParser';

export {
  BaseBancoEstadoParser,
  BancoEstadoExpensePurchaseParser,
  BancoEstadoDepositDonationParser,
  BancoEstadoDepositTransferParser
};

// export a flat array of parsers
export default [
  BancoEstadoExpensePurchaseParser,
  BancoEstadoDepositDonationParser,
  BancoEstadoDepositTransferParser
];
