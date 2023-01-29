import dayjs from 'dayjs';

import { FastifyInstance } from 'fastify';
import { prisma } from './lib/prisma';
import { z } from 'zod';

export async function routes(app: FastifyInstance) {
    app.post('/habits', async (request) => {
        const createHabitBody = z.object({
            title: z.string(),
            weekDays: z.array(z.number().min(0).max(6))
        });

        const { title, weekDays } = createHabitBody.parse(request.body);
        const today = dayjs().startOf('day').toDate();

        await prisma.habit.create({
            data: {
                title,
                created_at: today,
                weekDays: {
                    create: weekDays.map(weekDay => ({
                        week_day: weekDay
                    }))
                }
            }
        })
    });

    app.get('/day', async (request) => {
        const getDayParams = z.object({
            date: z.coerce.date()
        });

        const { date } = getDayParams.parse(request.query);

        const parsedDate = dayjs(date).startOf('day');
        const weekDay = parsedDate.day();

        const habits = await prisma.habit.findMany({
            where: {
                created_at: {
                    lte: date,
                },
                weekDays: {
                    some: {
                        week_day: weekDay, 
                    }
                }
            }
        });

        const day = await prisma.day.findUnique({
            where: {
                date: parsedDate.toDate()
            },
            include: {
                dayHabits: true
            }
        });

        const completedHabits = day?.dayHabits.map(dayHabit => dayHabit.habit_id);

        return habits.map(habit => ({
            ...habit,
            completed: completedHabits?.includes(habit.id) || false
        }));
    })
    
    app.patch('/habits/:id/toggle', async (request) => {
        const toggleHabitParams = z.object({
            id: z.string().uuid(),
        });

        const { id } = toggleHabitParams.parse(request.params);

        const today = dayjs().startOf('day').toDate();

        let day = await prisma.day.findUnique({
            where: {
                date: today
            }
        });

        if (!day) {
            day = await prisma.day.create({
                data: {
                    date: today
                }
            });
        }

        const dayHabit = await prisma.dayHabit.findUnique({
            where: {
                day_id_habit_id: {
                    day_id: day.id,
                    habit_id: id
                }
            }
        });

        if (dayHabit) {
            await prisma.dayHabit.delete({
                where: {
                    id: dayHabit.id
                }
            });

            return;
        }

        await prisma.dayHabit.create({
            data: {
                day_id: day.id,
                habit_id: id
            }
        });
    });
}