import { config as mainConfig } from './config.mainnet';
import { config as apothemConfig } from './config.apothem';

const config = (() => {
  switch (process.env.VL_CHAIN_NAME) {
    case 'mainnet':
      return mainConfig;
    case 'apothem':
      return apothemConfig;
    default:
      throw new Error(
        `Please select network from (mainnet, apothem). Was ${process.env.VL_CHAIN_NAME}`,
      );
  }
})();

console.log(`Using ${process.env.VL_CHAIN_NAME} config.`);

export default config as typeof mainConfig;
