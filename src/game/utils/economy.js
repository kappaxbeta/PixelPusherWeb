/**
 * PixelPusher Economy System
 * Manages supply, demand, and pricing for the city's weed empire.
 */
class Economy {
    constructor() {
        this.basePrice = 100;
        this.weedSupply = 1000;
        this.weedDemand = 1000;
        this.pricePerUnit = 100;
        this.cityVibe = "stable"; // "high-demand", "over-supplied", "chaotic"
    }

    /**
     * Update the economy (call this periodically or during scene transitions)
     */
    tick() {
        // Randomly shift demand and supply slightly
        this.weedDemand += (Math.random() - 0.45) * 50; // Slight tendency to grow
        this.weedSupply += (Math.random() - 0.5) * 30;

        // Clamps
        this.weedDemand = Math.max(10, this.weedDemand);
        this.weedSupply = Math.max(10, this.weedSupply);

        // Calculate Price based on Ratio
        const ratio = this.weedDemand / this.weedSupply;
        this.pricePerUnit = Math.round(this.basePrice * ratio);

        // Update Vibe
        if (ratio > 1.5) this.cityVibe = "high-demand";
        else if (ratio < 0.6) this.cityVibe = "over-supplied";
        else this.cityVibe = "stable";

        console.log(`[Economy] Tick: Price=${this.pricePerUnit}, Supply=${Math.round(this.weedSupply)}, Demand=${Math.round(this.weedDemand)}, Vibe=${this.cityVibe}`);
    }

    /**
     * Get a summary for the AI context
     */
    getEconomySummary() {
        return `The current weed price is ${this.pricePerUnit} credits. The market is ${this.cityVibe}. Supply level: ${Math.round(this.weedSupply)}, Demand level: ${Math.round(this.weedDemand)}.`;
    }

    /**
     * Player sells weed
     */
    onSell(amount) {
        this.weedSupply += amount;
        this.tick();
    }

    /**
     * Player buys weed (or NPCs consume it)
     */
    onBuy(amount) {
        this.weedDemand += amount * 0.1; // Buying increases future demand slightly
        this.weedSupply -= amount;
        this.tick();
    }
}

export const economy = new Economy();
