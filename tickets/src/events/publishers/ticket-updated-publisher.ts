import { Publisher, Subjects, TicketUpdatedEvent } from "@mtrepublic/commontickets";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}