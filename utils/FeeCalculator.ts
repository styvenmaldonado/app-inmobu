// src/config/feeConfig.js
import feeConfig from "~/feeConfig.json";
import { Loan } from "~/utils/financial/Loan";
import { Rate } from "~/utils/financial/Rate";

class FeeCalculator {
    /**
     * @private
     * Calcula el monto total de la tarifa para un monto base y una tasa de tarifa.
     * Método privado para encapsular la lógica interna.
     * @param {number} baseAmount - El monto base sobre el cual se calcula la tarifa.
     * @param {number} feeRate - La tasa de tarifa (ej. 0.6 para 60%).
     * @returns {number} El monto total de la tarifa.
     */
    #calculateTotalFee(baseAmount: number, feeRate:number) {
        if (typeof baseAmount !== 'number' || baseAmount < 0) {
            return 0;
        }
        return baseAmount * feeRate;
    }

    /**
     * Genera el programa de pagos de tarifas basado en un monto base y las configuraciones predefinidas.
     * Este es un método público que expone la funcionalidad principal.
     * @param {number} amount - El monto base de la transacción.
     * @returns {Array<Object>} Un array de objetos con el programa de pagos.
     */
    generateSchedulePayments(amount:number) {
        if (typeof amount !== 'number' || amount < 0) {
            return [];
        }

        const rate =  Rate.convertEffectiveAnnualToPeriodic(feeConfig.TEA,12)
        const fee = amount * (feeConfig.feeRate || 0)


        return feeConfig.FEE_SCHEDULES.map(schedule => {
           // Fee Amount

            const loan = new Loan({
                pv: fee,
                nper: schedule.quota,
                rate
            })

            const discountPercent = (schedule.discountPercent || 0)/ 100;

            return {
                paymentQuota: schedule.quota,
                paymentWithDiscount: fee * (1-discountPercent) ,
                discountText: schedule.discountText,
                feeMonthly: schedule.quota ==1  ? fee : loan.getPaymentPerPeriod(),
                totalFee:  schedule.quota ==1  ? fee : loan.getTotalAmountPaid()
            };
        });
    }

    /**
     * Calcula el fee principal (por defecto) para un monto dado.
     * Este es un método público que expone la funcionalidad principal.
     * @param {number} amount - El monto base de la transacción.
     * @returns {number} El monto del fee principal.
     */
    calculateDefaultFee(amount: number) {
        return this.#calculateTotalFee(amount, feeConfig.DEFAULT_FEE_RATE);
    }
}

export default new FeeCalculator(); // Exporta una instancia única de la clase (Singleton)