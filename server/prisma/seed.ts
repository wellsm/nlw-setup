import { PrismaClient } from '@prisma/client'
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient()
const today = dayjs().startOf('day');

const firstHabitId = uuidv4()
const firstHabitCreationDate = today.toDate();

const secondHabitId = uuidv4()
const secondHabitCreationDate = today.add(1, 'day').toDate();

const thirdHabitId = uuidv4()
const thirdHabitCreationDate = today.subtract(1, 'day').toDate();

async function run() {
  await prisma.habitWeekDay.deleteMany()
  await prisma.dayHabit.deleteMany()
  await prisma.habit.deleteMany()
  await prisma.day.deleteMany()

  /**
   * Create habits
   */
  await Promise.all([
    prisma.habit.create({
      data: {
        id: firstHabitId,
        title: 'Beber 2L água',
        created_at: firstHabitCreationDate,
        weekDays: {
          create: [
            { week_day: 1 },
            { week_day: 2 },
            { week_day: 3 },
            { week_day: 4 }
          ]
        }
      }
    }),

    prisma.habit.create({
      data: {
        id: secondHabitId,
        title: 'Exercitar 30m',
        created_at: secondHabitCreationDate,
        weekDays: {
          create: [
            { week_day: 3 },
            { week_day: 4 },
            { week_day: 5 },
          ]
        }
      }
    }),

    prisma.habit.create({
      data: {
        id: thirdHabitId,
        title: 'Dormir 8h',
        created_at: thirdHabitCreationDate,
        weekDays: {
          create: [
            { week_day: 1 },
            { week_day: 2 },
            { week_day: 3 },
            { week_day: 4 },
            { week_day: 5 },
          ]
        }
      }
    })
  ])

  await Promise.all([
    /**
     * Habits (Complete/Available): 1/1
     */
    prisma.day.create({
      data: {
        /** Today */
        date: today.toDate(),
        dayHabits: {
          create: {
            habit_id: firstHabitId,
          }
        }
      }
    }),

    /**
     * Habits (Complete/Available): 1/1
     */
    prisma.day.create({
      data: {
        /** Friday */
        date: today.add(1, 'day').toDate(),
        dayHabits: {
          create: {
            habit_id: firstHabitId,
          }
        }
      }
    }),

    /**
     * Habits (Complete/Available): 2/2
     */
    prisma.day.create({
      data: {
        /** Wednesday */
        date: today.subtract(1, 'day').toDate(),
        dayHabits: {
          create: [
            { habit_id: firstHabitId },
            { habit_id: secondHabitId },
          ]
        }
      }
    }),
  ])
}

run()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })