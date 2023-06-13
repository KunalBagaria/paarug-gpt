import prisma from "./db";

async function createFeedback(positive: boolean) {
  try {
    const feedback = await prisma.feedback.create({
      data: { positive },
    });
    return feedback;
  } catch (error) {
    console.error(error);
    return new Error("Error while creating feedback");
  }
}

export { createFeedback };