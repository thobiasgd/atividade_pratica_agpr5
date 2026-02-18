import { AggregateRoot } from '../entities/aggregate-root';
import { UniqueEntityID } from '../entities/unique-entity-id';
import { DomainEvent } from './domain-event';

type DomainEventCallback = (event: unknown) => void;

export class DomainEvents {
  private static handlersMap: Record<string, DomainEventCallback[]> = {};
  private static markedAggregates: AggregateRoot<unknown>[] = [];

  public static shouldRun = true;

  public static markAggregateForDispatch(aggregate: AggregateRoot<unknown>) {
    const aggregateFound = !!this.findMarkedAggregateByID(aggregate.id);

    if (!aggregateFound) {
      this.markedAggregates.push(aggregate);
    }
  }

  private static dispatchAggregateEvents(aggregate: AggregateRoot<unknown>) {
    aggregate.domainEvents.forEach((event: DomainEvent) =>
      this.dispatch(event),
    );
  }

  private static removeAggregateFromMarkedDispatchList(
    aggregate: AggregateRoot<unknown>,
  ) {
    const index = this.markedAggregates.findIndex((a) => a.equals(aggregate));

    this.markedAggregates.splice(index, 1);
  }

  private static findMarkedAggregateByID(
    id: UniqueEntityID,
  ): AggregateRoot<unknown> | undefined {
    return this.markedAggregates.find((aggregate) => aggregate.id.equals(id));
  }

  static dispatchEventsForAggregate(id: UniqueEntityID) {
    const aggregate = this.markedAggregates.find((a) => a.id.equals(id));

    if (!aggregate) {
      console.log(
        '[DomainEvents] Nenhum aggregate marcado para:',
        id.toString(),
      );
      return;
    }

    const events = aggregate.domainEvents;
    console.log('[DomainEvents] Eventos encontrados:', events.length);

    events.forEach((event) => {
      console.log('[DomainEvents] Disparando evento:', event.constructor.name);
      this.dispatch(event);
    });

    aggregate.clearEvents();
  }

  /* public static register(
    callback: DomainEventCallback,
    eventClassName: string,
  ) {
    const wasEventRegisteredBefore = eventClassName in this.handlersMap;

    if (!wasEventRegisteredBefore) {
      this.handlersMap[eventClassName] = [];
    }

    this.handlersMap[eventClassName].push(callback);static dispatchEventsForAggregate(id: UniqueEntityID) {

  } */
  static register(callback: DomainEventCallback, eventName: string) {
    console.log('[DomainEvents] Registrando handler para:', eventName);

    const handlers = this.handlersMap[eventName] ?? [];
    handlers.push(callback);
    this.handlersMap[eventName] = handlers;
  }

  public static clearHandlers() {
    this.handlersMap = {};
  }

  public static clearMarkedAggregates() {
    this.markedAggregates = [];
  }

  static dispatch(event: DomainEvent) {
    const eventName = event.constructor.name;
    const handlers = this.handlersMap[eventName] ?? [];

    console.log('[DomainEvents] Handlers para', eventName, handlers.length);

    for (const handler of handlers) {
      try {
        handler(event);
      } catch (err) {
        console.error(
          '[DomainEvents] Erro executando handler de',
          eventName,
          err,
        );
      }
    }
  }
}
