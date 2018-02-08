/*let printThreeThings = function (thing1,thing2,thing3) {
    console.log(thing1,thing2,thing3);
};

let yammyThings = ['pizza', 'gelato', 'sushi'];

printThreeThings(...yammyThings);

let arr1 = [1, 2, 3, 4, ...yammyThings, 5];

console.log(arr1);
let trulycopyarr1 = [...arr1];

console.log(trulycopyarr1);
console.log(arr1);

let copyarr1 = arr1;

copyarr1.push(6);

console.log(copyarr1);
console.log(arr1);*/


let foods = new WeakMap();

foods.set(['italian'], 'gelato');
foods.set(['mexican'], 'torta');
foods.set(['canadian'], 'poutine');

let southern = ['Taxas', 'Tennesse', 'Kentucky'];
foods.set(southern, 'hot chicken');

console.log(
    foods.get(['italian']),
    foods.has('french'),
    foods.get(southern),
    foods.size
);