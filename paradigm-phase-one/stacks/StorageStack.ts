import { Bucket, StackContext } from "sst/constructs";

export function StorageStack({ stack }: StackContext) {
  // instantiate buckets for both holochain and serverside storage
  const holochainBucket = new Bucket(stack, `holochain-storage`);
  const serverBucket = new Bucket(stack, `server-storage`);

  // display outputs
  stack.addOutputs({
    HolochainBucket: holochainBucket.bucketName,
    ServerBucket: serverBucket.bucketName,
  });

  // share resource
  return {
    holochainBucket,
    serverBucket,
  };
}
