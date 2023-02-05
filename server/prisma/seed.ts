import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

const prisma = new PrismaClient()

function generateDatesFromYearBeginning(): Date[] {
  const today = new Date()

  let dayOfTheYear = dayjs().startOf('year');

  const dates = [];

  while (dayOfTheYear.isBefore(today)) {
    dates.push(dayOfTheYear.toDate())
    dayOfTheYear = dayOfTheYear.add(1, 'day');
  }

  return dates;
}

function generateNumberFromInterval(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomElements(elements: Array<any>): Array<any> {
  const random = [];

  for (let element of elements) {
    if (generateNumberFromInterval(0, 100) <= 45) {
      random.push(element);
    }
  }

  return random;
}

const AVAILABLE_HABITS = [
  'Almoçar',
  'Beber 2L de água',
  'Passear com o cachorro',
  'Transar',
  'Jogar'
];

const AVAILABLE_WEEK_DAYS = [
  0, 1, 2, 3, 4, 5, 6
];

const FIRST_DAY_OF_YEAR = dayjs().startOf('year').toDate();

type Habits = Array<{
  id: string,
  title: string | number,
  created_at: Date,
  weekDays: Array<string | number>,
  days: Array<string>
}>;

async function run() {
  await prisma.$queryRaw`
    PRAGMA foreign_keys = 0;
  `;

  await Promise.all([
    prisma.day.deleteMany(),
    prisma.habit.deleteMany(),
    prisma.habitWeekDay.deleteMany(),
    prisma.dayHabit.deleteMany()
  ])

  await prisma.$queryRaw`
    PRAGMA foreign_keys = 1;
  `;

  const dates = generateDatesFromYearBeginning().map(date => dayjs(date).toDate());
  const habits: Habits = [];

  let days: Array<string> = [];

  for (let title of AVAILABLE_HABITS) {
    const randomWeekDays = randomElements(AVAILABLE_WEEK_DAYS);
    const randomDays = dates.filter(d => randomWeekDays.includes(dayjs(d).day())).map(d => d.toISOString());

    habits.push({
      id: uuidv4(),
      title,
      created_at: FIRST_DAY_OF_YEAR,
      weekDays: randomWeekDays,
      days: randomDays
    })

    days = [...new Set([...days, ...randomDays])];
  }

  for (let habit of habits) {
    await prisma.habit.create({
      data: {
        id: habit.id,
        title: habit.title.toString(),
        created_at: habit.created_at,
        weekDays: {
          create: habit.weekDays.map(weekDay => ({ week_day: Number(weekDay) }))
        }
      }
    })
  }

  for (let date of dates) {
    const randomHabits = randomElements(AVAILABLE_HABITS);
    const randomWeekDays = randomElements(AVAILABLE_WEEK_DAYS);
    const randomDays = dates.filter(d => randomWeekDays.includes(dayjs(d).day()))
      .map(d => d.toISOString());

    days = [...new Set([...days, ...randomDays])];
  }

  for (let date of days) {
    const possibleHabits = await prisma.habit.findMany({
      where: {
        created_at: {
          lte: date,
        },
        weekDays: {
          some: {
            week_day: dayjs(date).startOf('day').day(),
          }
        }
      }
    });

    const randomPossibleHabits = randomElements(possibleHabits);

    await prisma.day.create({
      data: {
        date: new Date(date),
        dayHabits: {
          create: randomPossibleHabits.map(habit => ({ habit_id: habit.id }))
        }
      }
    })
  }

  /*
  await Promise.all([
    prisma.day.create({
      data: {
        date: new Date('2023-01-02T03:00:00.000z'),
        dayHabits: {
          create: {
            habit_id: firstHabitId,
          }
        }
      }
    }),
    prisma.day.create({
      data: {
        date: new Date('2023-01-06T03:00:00.000z'),
        dayHabits: {
          create: {
            habit_id: firstHabitId,
          }
        }
      }
    }),

    prisma.day.create({
      data: {
        date: new Date('2023-01-04T03:00:00.000z'),
        dayHabits: {
          create: [
            { habit_id: firstHabitId },
            { habit_id: secondHabitId },
          ]
        }
      }
    }),
  ]) */
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