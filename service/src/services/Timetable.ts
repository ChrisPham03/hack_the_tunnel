import { Timetable } from "@prisma/client";
import { prisma } from "../db";
import { Result, Ok, Err } from "ts-results";
import { AccountService } from ".";
const discordWebhookUrl: string = 'https://discord.com/api/webhooks/1297234171218886777/ZYVNzhfWhc6KstkzmuM_hUY2Fztlrrvl9idT3JVGio9eVfDLrepW_ZUeWDK1fU5ol4vv';

// Define the structure of the payload for the Discord message
interface DiscordMessagePayload {
  content?: string;
}
// Function to send the message to Discord
async function sendMessageToDiscord(messageContent: string): Promise<void> {
  const payload: DiscordMessagePayload = {
    content: messageContent,
  };

  try {
    const response: Response = await fetch(discordWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      console.log("Message sent to Discord successfully.");
    } else {
      console.error("Failed to send message to Discord:", response.statusText);
    }
  } catch (error) {
    console.error("Error sending message to Discord:", error);
  }
}
export const createTimetable = async (
  email: string,
  name: string,
  scheduledEventIds: string[],
): Promise<Result<Timetable, Error>> => {
  const account = await AccountService.findByEmail(email);

  if (account === null) {
    return Err(new Error("Account not found"));
  }

  const timetable = await prisma.timetable.create({
    data: {
      name,
      account: {
        connect: {
          id: account.id,
        },
      },
      timetableEvents: {
        create: scheduledEventIds.map((id) => ({
          scheduledEvent: {
            connect: {
              id: parseInt(id),
            },
          },
        })),
      },
    },
  });
  sendMessageToDiscord(`New timetable created: ${name}`);
  return Ok(timetable);
};

export const getTimetableById = async (
  id: number,
): Promise<Result<Timetable, Error>> => {
  const timetable = await prisma.timetable.findUnique({
    where: {
      id,
    },
    include: {
      timetableEvents: {
        include: {
          scheduledEvent: {
            include: {
              course: true,
            },
          },
        },
      },
    },
  });

  if (timetable === null) {
    return Err(new Error("Timetable not found"));
  }
  sendMessageToDiscord(`Timetable with id ${id} was accessed`);
  return Ok(timetable);
};

export const getAccountTimetables = async (
  email: string,
): Promise<Result<Timetable[], Error>> => {
  const account = await AccountService.findByEmail(email);

  if (account === null) {
    return Err(new Error("Account not found"));
  }

  const timetables = await prisma.timetable.findMany({
    where: {
      accountId: account.id,
    },
    include: {
      timetableEvents: {
        include: {
          scheduledEvent: {
            include: {
              course: true,
            },
          },
        },
      },
    },
  });
  sendMessageToDiscord(`Timetables for account with email ${email} were accessed`);
  return Ok(timetables);
};
