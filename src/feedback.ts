import prisma from "./db";

async function incrementTotal() {
  try {
    const stats = await prisma.stats.findFirst();
    if (!stats) {
      await prisma.stats.create({ data: { total: 1 } });
      return;
    }
    await prisma.stats.update({
      where: { id: stats.id },
      data: { total: stats.total + 1 },
    });
  } catch (e) {
    console.error(e);
    return new Error("Error while incrementing total");
  }
}

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

export { createFeedback, incrementTotal };