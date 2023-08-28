import { SSTConfig } from "sst";
import { ApiStack } from "./stacks/ApiStack";
import { AuthStack } from "./stacks/AuthStack";
import { StorageStack } from "./stacks/StorageStack";
import { DatabaseStack } from "./stacks/DatabaseStack";

export default {
  config(_input) {
    return {
      name: "paradigm-phase-one",
      region: "ap-southeast-2",
    };
  },
  stacks(app) {
    const prototype = `${app.name}-${app.stage}`;
    app.setDefaultFunctionProps({
      runtime: "nodejs18.x",
      logRetention: "six_months",
    });
    app
      .stack(AuthStack, { stackName: `auth-${prototype}` })
      .stack(ApiStack, { stackName: `api-${prototype}` })
      .stack(StorageStack, { stackName: `storage-${prototype}` })
      .stack(DatabaseStack, { stackName: `database-${prototype}` });
  },
} satisfies SSTConfig;
