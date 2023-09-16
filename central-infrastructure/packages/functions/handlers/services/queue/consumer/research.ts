import { SQSEvent } from "aws-lambda";

export async function main(event: SQSEvent) {
  const records: any[] = event.Records;
  console.log(
    `(Consumer) [Health Research] Message processed : "${records[0].body}"`,
  );

  return {};
}
