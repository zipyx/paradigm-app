import { RDS, Table, StackContext } from "sst/constructs";

export function DatabaseStack({ stack }: StackContext) {
  // create database instance
  const database = new RDS(stack, "Database", {
    engine: "postgresql13.9",
    defaultDatabaseName: "server_holochain",
  });

  // create dynamodb table for server side events
  const serverSideTable = new Table(stack, `central-table`, {
    fields: {
      id: "string",
      name: "string",
    },
    primaryIndex: { partitionKey: "id", sortKey: "name" },
  });

  // create dynamodb table for holochain app
  const holochainTable = new Table(stack, `holochain-table`, {
    fields: {
      id: "string",
      name: "string",
    },
    primaryIndex: { partitionKey: "id", sortKey: "name" },
  });

  // display outputs
  stack.addOutputs({
    DatabaseId: database.id,
    DatabaseName: database.defaultDatabaseName,
    DatabaseClusterArn: database.clusterArn,
    DatabaseClusterPort: database.clusterEndpoint.port.toString(),
    DatabaseClusterHostname: database.clusterEndpoint.hostname,
    DynamoDBServerTable: serverSideTable.tableName,
    DynamoDBHolochainTable: holochainTable.tableName,
  });

  return {
    database,
    serverSideTable,
  };
}
