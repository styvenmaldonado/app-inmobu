import {
    pmt as _pmt,
    ppmt as _ppmt,
    ipmt as _ipmt,
    pv as _pv
} from "financial";
import Decimal from 'decimal.js'; // Importa la librería Decimal.js

/**
 * @interface LoanParameters
 * Define la estructura de los parámetros necesarios para inicializar una instancia de Loan.
 */
interface LoanParameters {
    /** La tasa de interés por período (ej. 0.005 para 0.5% mensual). */
    rate: number;
    /** El número total de períodos del préstamo. */
    nper: number;
    /** El valor presente o principal del préstamo. */
    pv: number;
}

/**
 * @interface AmortizationEntry
 * Representa una entrada en la tabla de amortización para un período específico.
 */
interface AmortizationEntry {
    /** El número del período. */
    period: number;
    /** La porción del pago que amortiza el capital. */
    principalPaid: Decimal; // Ahora es un objeto Decimal
    /** La porción del pago que corresponde a intereses. */
    interestPaid: Decimal;  // Ahora es un objeto Decimal
    /** El saldo pendiente del préstamo al final del período. */
    remainingBalance: Decimal; // Ahora es un objeto Decimal
}

/**
 * @class Loan
 * Proporciona métodos para realizar cálculos financieros relacionados con un préstamo de amortización fija,
 * utilizando Decimal.js para garantizar la precisión en todas las operaciones monetarias.
 */
export class Loan {
    /** @readonly El valor presente o principal del préstamo, como un objeto Decimal. */
    public readonly pv: Decimal;
    /** @readonly La tasa de interés por período del préstamo, como un objeto Decimal. */
    public readonly rate: Decimal;
    /** @readonly El número total de períodos del préstamo, como un objeto Decimal. */
    public readonly nper: Decimal;

    /**
     * Crea una nueva instancia de un préstamo.
     * @param {LoanParameters} params Los parámetros iniciales del préstamo (pv, rate, nper).
     */
    constructor({ pv, rate, nper }: LoanParameters) {
        // Convertimos los números primitivos a objetos Decimal al inicio
        this.pv = new Decimal(pv);
        this.rate = new Decimal(rate);
        this.nper = new Decimal(nper);

        // Opcional: Validación mejorada con Decimal.js
        if (this.pv.lte(0) || this.rate.lte(0) || this.nper.lte(0)) {
            throw new Error("Loan parameters (pv, rate, nper) must be positive values.");
        }
    }

    /**
     * Calcula el Pago Mensual Total (PMT) fijo para el préstamo.
     * Este pago incluye tanto la porción de capital como la de intereses.
     * @returns {Decimal} El monto del pago periódico fijo, como un objeto Decimal.
     */
    public getPaymentPerPeriod(): Decimal {
        // financial.js espera 'number' primitivos, por eso usamos .toNumber()
        // El resultado de _pmt es un 'number', lo convertimos a Decimal para mantener la precisión
        const pmtValue = _pmt(
            this.rate.toNumber(),
            this.nper.toNumber(),
            this.pv.negated().toNumber() // Se niega PV porque es dinero recibido, y financial.js espera un valor opuesto
        );
        return new Decimal(pmtValue);
    }

    /**
     * Calcula el costo total pagado por el préstamo durante toda su duración.
     * Es la suma de todos los pagos periódicos.
     * @returns {Decimal} El monto total pagado (capital + intereses), como un objeto Decimal.
     */
    public getTotalAmountPaid(): Decimal {
        // Todas las operaciones aritméticas se hacen con métodos de Decimal.js
        return this.getPaymentPerPeriod().times(this.nper);
    }

    /**
     * Calcula el monto total de intereses pagados durante la vida del préstamo.
     * Es la diferencia entre el monto total pagado y el capital inicial del préstamo.
     * @returns {Decimal} El monto total de intereses, como un objeto Decimal.
     */
    public getTotalInterestPaid(): Decimal {
        // Se resta el capital inicial al total pagado usando .minus()
        return this.getTotalAmountPaid().minus(this.pv);
    }


    public getPresentValue() {
        return _pv(this.rate.toNumber(),this.nper.toNumber(),0,0)
    }

    /**
     * Genera la tabla de amortización completa del préstamo.
     * Para cada período, muestra la parte de capital, la parte de intereses y el saldo pendiente.
     * @returns {AmortizationEntry[]} Un array de objetos, donde cada objeto representa un período de la amortización.
     */
    public getAmortizationSchedule(): AmortizationEntry[] {
        const schedule: AmortizationEntry[] = [];
        let currentBalance = new Decimal(this.pv); // El saldo inicial es el principal del préstamo, como Decimal

        for (let i = 1; i <= this.nper.toNumber(); i++) { // nper.toNumber() para la condición del bucle
            // Calcular capital pagado para el período actual
            const principalPaidNumber = _ppmt(this.rate.toNumber(), i, this.nper.toNumber(), this.pv.negated().toNumber());
            const principalPaid = new Decimal(principalPaidNumber).negated(); // Negamos para que sea un valor positivo

            // Calcular intereses pagados para el período actual
            const interestPaidNumber = _ipmt(this.rate.toNumber(), i, this.nper.toNumber(), this.pv.negated().toNumber());
            const interestPaid = new Decimal(interestPaidNumber).negated(); // Negamos para que sea un valor positivo

            // Actualiza el saldo restante después de aplicar el pago de capital.
            currentBalance = currentBalance.minus(principalPaid);

            // Asegurar que el saldo sea 0 en el último período por posibles imprecisiones
            if (i === this.nper.toNumber()) {
                currentBalance = new Decimal(0);
            }

            schedule.push({
                period: i,
                principalPaid: principalPaid,
                interestPaid: interestPaid,
                remainingBalance: currentBalance
            });
        }
        return schedule;
    }

}