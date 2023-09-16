import { Bucket, StackContext } from "sst/constructs";

export function StorageStack({ stack }: StackContext) {
  // instantiate storage buckets for both holochain and serverside storage
  const hAppAgentBucket = new Bucket(stack, `hApp-agent-storage`);
  const hAppServiceBucket = new Bucket(stack, `hApp-service-storage`);

  // display outputs
  stack.addOutputs({
    HolochainAppAgentBucket: hAppAgentBucket.bucketName,
    HolochainAppServiceBucket: hAppServiceBucket.bucketName,
  });

  // share resource
  return {
    hAppAgentBucket,
    hAppServiceBucket,
  };
}
