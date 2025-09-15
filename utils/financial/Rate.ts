/**
 * @fileoverview Clase de utilidad para la conversión de tasas de interés.
 * Proporciona métodos estáticos para realizar cálculos comunes de tasas.
 */

export class Rate {
    /**
     * Convierte una Tasa Efectiva Anual (TEA) a una tasa efectiva para un número específico de períodos al año.
     * Esto es útil para adaptar una tasa anual a períodos de capitalización o pago más cortos (ej., mensual, diario).
     *
     * @param {number} annualEffectiveRate La Tasa Efectiva Anual (TEA) como una proporción decimal (ej., 0.08 para 8%).
     * @param {number} periodsPerYear El número de períodos en un año al que se desea convertir la tasa (ej., 12 para mensual, 365 para diario).
     * @returns {number} La tasa efectiva por período, como una proporción decimal.
     */
    static convertEffectiveAnnualToPeriodic(annualEffectiveRate: number, periodsPerYear: number): number {
        // Fórmula: (1 + TEA)^(1 / periodos_por_año) - 1
        return Math.pow((1 + annualEffectiveRate), (1 / periodsPerYear)) - 1;
    }

    // Si tuvieras más métodos, irían aquí, por ejemplo:
    /*
    static convertNominalToEffective(nominalRate: number, periodsPerYear: number): number {
        return Math.pow((1 + (nominalRate / periodsPerYear)), periodsPerYear) - 1;
    }
    */
}