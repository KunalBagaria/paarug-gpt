import ical from 'node-ical';
import { CalendarEvents } from './types';

async function getLatestEvents(): Promise<CalendarEvents | Error> {
  try {
    const webEvents = await ical.async.fromURL('https://api.lu.ma/ics/get?entity=calendar&id=cal-cl57AMcV2gdbbau');
    const parsedEvents = Object.values(webEvents)
      .filter((event: any) => new Date(event.start).getTime() > new Date().getTime())
      .sort((a: any, b: any) => new Date(a.start).getTime() - new Date(b.start).getTime())
      .slice(0, 10)
      .map((event: any) => `${new Date(event.start).toLocaleDateString()} - ${event.summary}`);
    const formattedEvents = parsedEvents.join('\n');
    return {
      events: formattedEvents,
      lastUpdated: new Date()
    };
  } catch (e) {
    console.error(e);
    return new Error('Error while fetching events');
  }
}

export { getLatestEvents }