import { Publisher, Subjects, TicketCreatedEvent } from "@mtrepublic/commontickets";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}