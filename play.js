class AGreatClass {
    constructor(greatNumber) {
        this.greatNumber = greatNumber;
    }

    getGreatNumber() {
        return this.greatNumber;
    }
}

class AnotherAGreatClass extends AGreatClass {
    constructor(greatWord, greatNumber) {
        super(greatNumber);
        this.greatWord = greatWord;
    }
    getGreatNumber() {
        let AGreatNumber = super.getGreatNumber();
        return [this.greatWord, AGreatNumber];
    }
}


const AGreatObject = new AnotherAGreatClass('adventure',42);
console.log(AGreatObject.getGreatNumber());