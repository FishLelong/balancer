import merge from 'lodash/merge';
import registry from '@balancer-labs/assets/generated/pm/registry.homestead.json';
import registryKovan from '@balancer-labs/assets/generated/pm/registry.kovan.json';
import homestead from '@/config/homestead.json';
import kovan from '@/config/kovan.json';
import ropsten from '@/config/ropsten.json';
import registryRopsten from '@/config/registry.ropsten.json';

const configs = { homestead, kovan, ropsten };
configs.homestead = merge(registry, configs.homestead);
configs.kovan = merge(registryKovan, configs.kovan);
configs.ropsten = merge(registryRopsten, configs.ropsten);
const network = process.env.VUE_APP_NETWORK || 'homestead';
const config = configs[network];
config.env = process.env.VUE_APP_ENV || 'staging';

export default config;
