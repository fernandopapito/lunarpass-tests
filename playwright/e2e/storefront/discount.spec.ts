import { test, expect } from '../../support'

import { Mission } from '../../support/types'
import { cleanAndInsertMission } from '../../support/db'
import { birthDateForAge } from '../../support/helpers'

test('Compra de 1 assento sem desconto', async ({ app }) => {
  // Arrange
  const mission: Mission = {
    id: 'LP-1129A',
    rocket: 'Starship',
    baseId: 'alpha',
    departureDate: '2029-11-10',
    returnDate: '2029-11-17',
    price: 1000.00
  }

  await cleanAndInsertMission(mission)
  await app.store.bookingPage.go(mission.id)

  // Act
  await app.store.bookingPage.selectSeats(['A1'])

  // Assert
  await expect(app.store.bookingPage.discount).toHaveText('Sem desconto')
  await expect(app.store.bookingPage.totalPrice).toHaveText('USD 1,000.00')
})

test('Compra de 2 assentos com 5% de desconto', async ({ app }) => {
  // Arrange
  const mission: Mission = {
    id: 'LP-1129B',
    rocket: 'Starship',
    baseId: 'orion',
    departureDate: '2029-11-12',
    returnDate: '2029-11-19',
    price: 1000.00
  }

  await cleanAndInsertMission(mission)
  await app.store.bookingPage.go(mission.id)

  // Act
  await app.store.bookingPage.selectSeats(['A1', 'A2'])

  // Assert
  await expect(app.store.bookingPage.discount).toHaveText('5% · −USD 100.00')
  await expect(app.store.bookingPage.totalPrice).toHaveText('USD 1,900.00')
})

test('Compra de 3 assentos com 5% de desconto', async ({ app }) => {
  // Arrange
  const mission: Mission = {
    id: 'LP-1129C',
    rocket: 'Starship',
    baseId: 'aurora',
    departureDate: '2029-11-14',
    returnDate: '2029-11-21',
    price: 1000.00
  }

  await cleanAndInsertMission(mission)
  await app.store.bookingPage.go(mission.id)

  // Act
  await app.store.bookingPage.selectSeats(['A1', 'A2', 'B1'])

  // Assert
  await expect(app.store.bookingPage.discount).toHaveText('5% · −USD 150.00')
  await expect(app.store.bookingPage.totalPrice).toHaveText('USD 2,850.00')
})

test('Compra de 4 assentos com 10% de desconto', async ({ app }) => {
  // Arrange
  const mission: Mission = {
    id: 'LP-1129D',
    rocket: 'Starship',
    baseId: 'selene',
    departureDate: '2029-11-16',
    returnDate: '2029-11-23',
    price: 1000.00
  }

  await cleanAndInsertMission(mission)
  await app.store.bookingPage.go(mission.id)

  // Act
  await app.store.bookingPage.selectSeats(['A1', 'A2', 'B1', 'B2'])

  // Assert
  await expect(app.store.bookingPage.discount).toHaveText('10% · −USD 400.00')
  await expect(app.store.bookingPage.totalPrice).toHaveText('USD 3,600.00')
})

test('Desconto recalculado ao desmarcar um assento', async ({ app }) => {
  // Arrange
  const mission: Mission = {
    id: 'LP-1129E',
    rocket: 'Starship',
    baseId: 'alpha',
    departureDate: '2029-11-18',
    returnDate: '2029-11-25',
    price: 1000.00
  }

  await cleanAndInsertMission(mission)
  await app.store.bookingPage.go(mission.id)
  await app.store.bookingPage.selectSeats(['A1', 'A2', 'B1', 'B2'])

  // Act
  await app.store.bookingPage.unselectSeat('B2')

  // Assert
  await expect(app.store.bookingPage.discount).toHaveText('5% · −USD 150.00')
  await expect(app.store.bookingPage.totalPrice).toHaveText('USD 2,850.00')
})

test('Finalização do pagamento com desconto aplicado', async ({ app }) => {
  // Arrange
  const mission: Mission = {
    id: 'LP-1129F',
    rocket: 'Starship',
    baseId: 'orion',
    departureDate: '2029-11-20',
    returnDate: '2029-11-27',
    price: 1000.00
  }

  await cleanAndInsertMission(mission)
  await app.services.stripe.approvePayment('Visa', 'pi_3UX6sz14NoBxd29D08GIaxi1')
  await app.store.bookingPage.go(mission.id)
  await app.store.bookingPage.selectSeats(['A1', 'A2', 'B1', 'B2'])
  await app.store.bookingPage.continue()
  await app.store.bookingPage.submitPassengers([
    { seat: 'A1', fullName: 'Buzz Aldrin', passport: 'XP10001', birthDate: birthDateForAge(25) },
    { seat: 'A2', fullName: 'Neil Armstrong', passport: 'XP10002', birthDate: birthDateForAge(25) },
    { seat: 'B1', fullName: 'Fernando Papito', passport: 'XP10003', birthDate: birthDateForAge(25) },
    { seat: 'B2', fullName: 'Papito Fernando', passport: 'XP10004', birthDate: birthDateForAge(25) }
  ])

  // Act
  await app.store.bookingPage.submitPayment({
    email: 'buzz@lunarpass.dev',
    cardName: 'Buzz Aldrin',
    cardNumber: '4242 4242 4242 4242',
    expiry: '12/30',
    cvv: '123'
  })

  // Assert
  await expect(app.store.bookingPage.reservationTotalPrice).toHaveText('USD 3,600.00')
  await expect(app.store.bookingPage.reservationDiscount).toHaveText(
    'Desconto de 10% aplicado sobre USD 4,000.00 (−USD 400.00)'
  )
})
