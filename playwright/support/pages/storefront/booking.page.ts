import { Page, Locator } from '@playwright/test'

export class BookingPage {
    readonly page: Page
    readonly continueButton: Locator
    readonly noSeatsMessage: Locator
    readonly totalPrice: Locator
    readonly passengersTitle: Locator
    readonly alert: Locator

    constructor(page: Page) {
        this.page = page
        this.continueButton = page.getByRole('button', { name: 'Continuar' })
        this.noSeatsMessage = page.getByRole('paragraph').filter({ hasText: 'Nenhum assento escolhido' })
        this.totalPrice = page.getByTestId('summary-total-price')
        this.passengersTitle = page.getByRole('heading', { name: 'Cadastre os passageiros' })
        this.alert = page.getByRole('alert')
    }

    async go(missionId: string) {
        await this.page.goto(`http://localhost:3000/booking/${missionId}`)
    }

    seatButton(seat: string): Locator {
        return this.page.getByRole('button', { name: new RegExp(`Assento ${seat}`) })
    }

    async selectSeat(seat: string) {
        await this.seatButton(seat).dispatchEvent('click')
    }

    async selectSeats(seats: string[]) {
        for (const seat of seats) {
            await this.seatButton(seat).click()
        }
    }

    async continue() {
        await this.continueButton.click()
    }
}
