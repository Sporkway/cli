import { 
  APIGatewayClient, 
  CreateUsagePlanCommand,
} from "@aws-sdk/client-api-gateway";
import { getGatewayId } from "./getGatewayId";

export async function createUsagePlan(
  name: string,
  rateLimit: number,
  burstLimit?: number,
  quotaLimit?: number,
  quotaPeriod?: 'DAY' | 'WEEK' | 'MONTH',
) {
  try {
    const client = new APIGatewayClient();

    const gatewayId = await getGatewayId(client);

    const input = quotaPeriod ? 
      {
        name,
        apiStages: [{
          apiId: `${gatewayId}`,
          stage: 'dev',
        }],
        throttle: {
          burstLimit,
          rateLimit,
        },
        quota: { 
          limit: quotaLimit,
          period: quotaPeriod,
        },
      }
      :
      {
        name,
        apiStages: [{
          apiId: `${gatewayId}`,
          stage: 'dev',
        }],
        throttle: {
          burstLimit,
          rateLimit,
        },
      };

    const command = new CreateUsagePlanCommand(input);
  
    const response = await client.send(command);
    return response;
  } catch (err) {
    console.error(`Error - could not create usage plan ${name}: `, err);
    throw err;
  }
}