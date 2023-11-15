/**
 * @todo: move to utils of the domain event.
 */
const serviceQueuePrefix = 'vm';

export const createQueueName = (queueName: string) => {
  return `${serviceQueuePrefix}.${queueName}`;
};
