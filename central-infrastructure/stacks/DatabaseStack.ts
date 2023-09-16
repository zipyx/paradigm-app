import { RDS, Table, StackContext } from "sst/constructs";

export function DatabaseStack({ stack }: StackContext) {
  // create database instance
  const database = new RDS(stack, "Database", {
    engine: "postgresql13.9",
    defaultDatabaseName: "patient_records",
  });

  // dynamodb table for server side event services
  const hAppAgentServices = new Table(stack, `hApp-agent-services`, {
    fields: {
      id: "string",
      name: "string",
    },
    primaryIndex: { partitionKey: "id", sortKey: "name" },
  });

  // dynamodb table for holochain app agent connections established
  const hAppAgentConnections = new Table(stack, `hApp-agent-connections`, {
    fields: {
      id: "string",
      connected_at: "number",
      ip_address: "string",
      message: "string",
    },
    primaryIndex: { partitionKey: "id" },
  });

  // display outputs
  stack.addOutputs({
    DatabaseId: database.id,
    DatabaseName: database.defaultDatabaseName,
    DatabaseClusterArn: database.clusterArn,
    DatabaseClusterPort: database.clusterEndpoint.port.toString(),
    DatabaseClusterHostname: database.clusterEndpoint.hostname,
    DynamoDBHolochainAppAgentServices: hAppAgentServices.tableName,
    DynamoDBHolochainAppAgentConnections: hAppAgentConnections.tableName,
  });

  return {
    database,
    hAppAgentServices,
    hAppAgentConnections,
  };
}
