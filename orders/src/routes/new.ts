import express, { Request, Response } from 'express';
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@mtrepublic/commontickets';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';

const EXPIRATION_WINDOW_SECONDS = 15 * 60

const router = express.Router();

router.post('/api/orders', requireAuth, [
  body('tickedId')
    .not()
    .isEmpty()
    .withMessage('TicketId must be provided.')
], 
validateRequest, async (req: Request, res: Response) => {
  const { tickedId } = req.body;

  // Find the ticket the user is trying to order in the database
  const ticket = await Ticket.findById(tickedId);
  if (!ticket) {
    throw new NotFoundError();
  }

  // Make sure that this ticket is not already reserved
  const isReserved = await ticket.isReserved();
  if(isReserved) {
    throw new BadRequestError('Ticket is already reserved');
  }

  // Calculate an expiration date for this order
  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

  // Build the order and save it to the database
  const order = Order.build({
    userId: req.currentUser!.id,
    status: OrderStatus.Created,
    expiresAt: expiration,
    ticket
  });
  await order.save();

  // Publish an event saying that the order was created

  res.status(201).send(order);
});

export { router as newOrderRouter };