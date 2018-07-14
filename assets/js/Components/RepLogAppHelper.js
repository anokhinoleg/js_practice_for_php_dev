'use strict';
class Helper {
    constructor(repLogs) {
        this.repLogs = repLogs;
    }

    calculateTotalWeight() {
        return Helper._calculateTotalWeight(
            this.repLogs
        );
    }

    getTotalWeightString(maxWeight = 500) {
        let weight = this.calculateTotalWeight();
        return maxWeight < weight ? maxWeight + '+' + " lbs" : weight + " lbs";
    }

    static _calculateTotalWeight(repLogs) {
        let totalWeight = 0;
        for (let repLog of repLogs) {
            totalWeight += repLog.totalWeightLifted;
        }
        return totalWeight;
    }
}
export default Helper;