import { Pool } from 'pg'
import { Kysely, PostgresDialect, CamelCasePlugin } from 'kysely'

import { LunarBase, Mission, Reservation, Ticket } from './types'

interface Database {
    lunarBases: LunarBase,
    missions: Mission,
    reservations: Reservation,
    tickets: Ticket
}

const dialect = new PostgresDialect({
    pool: new Pool({
        connectionString: 'postgresql://postgres:u2BgpHnxc2gWPN5Z@db.ffmzzmgbjvgmzttdebgu.supabase.co:5432/postgres',
        ssl: { rejectUnauthorized: false }
    })
})

export const db = new Kysely<Database>({
    dialect,
    plugins: [new CamelCasePlugin()]
})

// ---- lunar bases ----

export async function cleanLunarBase(base: LunarBase) {
    await db
        .deleteFrom('missions')
        .where('baseId', '=', base.id)
        .execute()
    await deleteLunarBase(base.id)
}

export async function cleanAndInsertLunarBase(base: LunarBase) {
    await cleanLunarBase(base)
    await insertLunarBase(base)
}

export async function insertLunarBase(base: LunarBase) {
    await db
        .insertInto('lunarBases')
        .values(base)
        .execute()
}

export async function deleteLunarBase(id: string) {
    await db
        .deleteFrom('lunarBases')
        .where('id', '=', id)
        .execute()
}

// ---- missions ----

export async function cleanMission(mission: Mission) {
    await deleteTicket(mission.id)
    await deleteReservation(mission.id)
    await deleteMission(mission.id)
}

export async function cleanAndInsertMission(mission: Mission) {
    await cleanMission(mission)
    await insertMission(mission)
}

export async function insertMission(mission: Mission) {
    await db
        .insertInto('missions')
        .values(mission)
        .execute()
}

export async function deleteMission(id: string) {
    await db
        .deleteFrom('missions')
        .where('id', '=', id)
        .execute()
}

// ---- reservations ----

export async function insertReservation(reservation: Reservation) {
    await db
        .insertInto('reservations')
        .values(reservation)
        .execute()
}

export async function deleteReservation(missionId: string) {
    await db
        .deleteFrom('reservations')
        .where('missionId', '=', missionId)
        .execute()
}

// ---- tickets ----

export async function insertTickets(tickets: Ticket[]) {
    await db
        .insertInto('tickets')
        .values(tickets)
        .execute()
}

export async function deleteTicket(missionId: string) {
    await db
        .deleteFrom('tickets')
        .where('missionId', '=', missionId)
        .execute()
}
