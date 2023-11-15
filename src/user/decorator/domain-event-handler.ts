import { SetMetadata } from '@nestjs/common';
import { DOMAIN_EVENT_HANDLER } from '../constant/domain-event-handler';

export const DomainEventHandler = (event: any) => {
  return SetMetadata(DOMAIN_EVENT_HANDLER, event.name);
};
