import { makeRawLogExtractors } from '@yodaplus/spock-utils/dist/extractors/rawEventDataExtractor';
import { makeRawEventBasedOnTopicExtractor } from '@yodaplus/spock-utils/dist/extractors/rawEventBasedOnTopicExtractor';
import { join } from 'path';

import { UserProvidedSpockConfig } from '@oasisdex/spock-etl/dist/services/config';
import {
  managerGiveTransformer,
  openCdpTransformer,
} from './borrow/transformers/cdpManagerTransformer';

import {
  vatCombineTransformer,
  vatMoveEventsTransformer,
  vatRawMoveTransformer,
  vatTransformer,
} from './borrow/transformers/vatTransformer';
import { auctionTransformer, catTransformer } from './borrow/transformers/catTransformer';
import {
  AbiInfo,
  makeRawEventExtractorBasedOnTopicIgnoreConflicts,
  makeRawEventBasedOnDSNoteTopic,
} from './borrow/customExtractors';
import { flipNoteTransformer, flipTransformer } from './borrow/transformers/flipperTransformer';
import { getIlkInfo } from './borrow/dependencies/getIlkInfo';
import { getUrnForCdp } from './borrow/dependencies/getUrnForCdp';
import {
  auctionLiq2Transformer,
  dogTransformer,
  getDogTransformerName,
} from './borrow/transformers/dogTransformer';
import { clipperTransformer } from './borrow/transformers/clipperTransformer';

import { getOraclesAddresses } from './utils/addresses';
import {
  getOracleTransformerName,
  oraclesTransformer,
} from './borrow/transformers/oraclesTransformer';
import {
  eventEnhancerGasPrice,
  eventEnhancerTransformer,
  eventEnhancerTransformerEthPrice,
} from './borrow/transformers/eventEnhancer';

const mainnetAddresses = require('./addresses/mainnet.json');

const GENESIS = Number(process.env.GENESIS) || 46100101;

const vat = {
  address: '0xADD756B7a1384c48339Fe0f951405Ce03a3C9889',
  startingBlock: GENESIS,
};

const cdpManagers = [
  {
    address: '0x6F11c919c57E9558495E2f842aDD9841c2680559',
    startingBlock: GENESIS,
  },
];

const cats = [
  {
    address: '0x492f8426e57E44a64d015E50182Cf742Da74E99F',
    startingBlock: GENESIS,
  },
];

const dogs = [
  {
    address: '0x1d1f15a43C738c435c12d78a5ACCa1C435261A19',
    startingBlock: GENESIS,
  },
];

const clippers = [
  {
    name: 'clipper',
    abi: require('../abis/clipper.json'),
    startingBlock: GENESIS,
  },
];

const flipper = [
  {
    name: 'flipper',
    abi: require('../abis/flipper.json'),
    startingBlock: GENESIS,
  },
];

const oracle = [
  {
    name: 'oracle',
    abi: require('../abis/oracle.json'),
    startingBlock: GENESIS,
  },
];

const flipperNotes: AbiInfo[] = [
  {
    name: 'flipper',
    functionNames: [
      'tend(uint256,uint256,uint256)',
      'dent(uint256,uint256,uint256)',
      'deal(uint256)',
    ],
    abi: require('../abis/flipper.json'),
    startingBlock: GENESIS,
  },
];

const addresses = {
  ...mainnetAddresses,
};

const oracles = getOraclesAddresses(mainnetAddresses).map(description => ({
  ...description,
  startingBlock: GENESIS,
}));

const oraclesTransformers = oracles.map(getOracleTransformerName);

export const config: UserProvidedSpockConfig = {
  startingBlock: GENESIS,
  extractors: [
    ...makeRawLogExtractors(cdpManagers),
    ...makeRawLogExtractors(cats),
    ...makeRawLogExtractors(dogs),
    ...makeRawLogExtractors([vat]),
    ...makeRawEventBasedOnTopicExtractor(flipper),
    ...makeRawEventBasedOnDSNoteTopic(flipperNotes),
    ...makeRawEventExtractorBasedOnTopicIgnoreConflicts(
      clippers,
      dogs.map(dog => dog.address.toLowerCase()),
    ), // ignore dogs addresses because event name conflict
    ...makeRawEventExtractorBasedOnTopicIgnoreConflicts(oracle),
  ],
  transformers: [
    ...openCdpTransformer(cdpManagers, { getUrnForCdp }),
    ...managerGiveTransformer(cdpManagers),
    ...catTransformer(cats),
    ...auctionTransformer(cats, { getIlkInfo }),
    ...dogTransformer(dogs),
    ...auctionLiq2Transformer(dogs, { getIlkInfo }),
    vatTransformer(vat),
    vatCombineTransformer(vat),
    vatMoveEventsTransformer(vat),
    vatRawMoveTransformer(vat),
    flipTransformer(),
    flipNoteTransformer(),
    clipperTransformer(dogs.map(dep => getDogTransformerName(dep.address))),
    ...oraclesTransformer(oracles),
    eventEnhancerTransformer(vat, dogs[0], cdpManagers, oraclesTransformers),
    eventEnhancerTransformerEthPrice(vat, dogs[0], cdpManagers, oraclesTransformers),
    eventEnhancerGasPrice(vat, cdpManagers),
  ],
  migrations: {
    borrow: join(__dirname, './borrow/migrations'),
  },
  api: {
    whitelisting: {
      enabled: false,
      whitelistedQueriesDir: './queries',
    },
  },
  addresses,
  onStart: async services => {},
  blockGenerator: {
    batch: 50,
  },
  extractorWorker: {
    batch: 400,
    reorgBuffer: 0,
  },
};
