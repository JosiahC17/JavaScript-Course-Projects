'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//////////////////////////////////////////////
// App Lecture 1) Creating DOM elements in JS:
// Setting up Movements: Deposit / Withdrawal

// Sort Lecture (Future editing, came back to same func)

// Put loop function in a function, not on global scope
const displayMovements = function (movements, sort = false) {
  // First step, clear all html:
  containerMovements.innerHTML = '';

  // Create copy so doesn't mutate og array
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  // Then loop over array
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    // Creating DOM elements in JS using template literals
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type} </div>
    <div class="movements__value">${mov}€</div>
    </div>
    
    `;
    // We simply wrote the HTML above, this activates it (MDN if curious)
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// displayMovements(account1.movements); Removed hard coded function call, put conditional function call in login. Only want to display movements, balance, and summary when logged in

//////////////////////////////////////////////
// App Lecture 2)Computing Usernames using Map and forEach
// Username is just the first letter of each name lowercas

// const user = 'Steven Thomas Williams';
// Have function in global scope just to figure out, then put in a function for all accounts
// Can add .map because split returns an array
// const username = user
//   .toLowerCase()
//   .split(' ')
//   .map(name => name[0])
//   .join('');
// Add username to the accounts object in proper format
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);
// console.log(accounts);

//////////////////////////////////////////////
// App Lecture 3) Reduce to add current balance

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};
// calcDisplayBalance(account1.movements);

//////////////////////////////////////////////
// App Lecture 4) Magic of Chaining:Deposits,Interest,etc
///////////////////////////////////
// Change from movements to whole account to access interest
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const expenses = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(expenses)}€`;
  // Add that bank only adds interest if interest is at least 1
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter((int, i, arr) => int >= 1) //At least 1 EUR
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

// calcDisplaySummary(account1.movements);

//////////////////////////////////////////////
// App Lecture 4) Implementing Login Feature

// New function to condense updating UI
const updateUI = function (acc) {
  // Movements
  displayMovements(acc.movements);
  // Balance
  calcDisplayBalance(acc);
  // Display Summary
  calcDisplaySummary(acc);
};
// We want the current account to be on global scope
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  // Prevent form submitting, reloading page
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  // Optional Chaining: ?., only if it exists, wont ERROR
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and Welcome Message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear Login Input Fields and Focus
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    // This code refactored so reusable
    // Update UI
    updateUI(currentAccount);
    // // Display Movements: call function
    // displayMovements(currentAccount.movements);
    // // Display Balance
    // calcDisplayBalance(currentAccount);
    // // Display Summary
    // // Edit function to allow for unique interest rates
    // // Must call whole account to allow access to rates
    // calcDisplaySummary(currentAccount);
  }
});

//////////////////////////////////////////////
// App Lecture 5) Implementing Transfer $ Feature

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  // Clear the input fields
  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur();
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the Transfer:
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    // Update UI
    updateUI(currentAccount);
  }
});

//////////////////////////////////////////////
// App Lecture 6) findIndex for Close Account

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    currentAccount?.username === inputCloseUsername.value &&
    currentAccount?.pin === Number(inputClosePin.value)
  ) {
    // Retrieves the index
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // Delete Account
    accounts.splice(index, 1);
    // Hide UI
    containerApp.style.opacity = 0;
  }
  // Clear the fields
  inputCloseUsername.value = inputClosePin.value = '';
});
// App Lecture 7) Some for loan requests
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  // Condition for loan approval
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1))
    // Update Movements
    currentAccount.movements.push(amount);
  // Uodate UI
  updateUI(currentAccount);
  // Set field back to blank
  inputLoanAmount.value = '';
});

//////////////////////////////////////////////
// App Lecture 7) Sort movements (see display movements)

// So when sort button clicked, sort parameter in display movements set to true, sorting is applied
// Toggle function of sort button:
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

// LECTURES
///////////////////////////////////
/*
///////////////////////////////////
// Array Methods - Intro
///////////////////////////////////
let arr = ['a', 'b', 'c', 'd', 'e'];

// SLICE method - creates new array from old one
console.log(arr.slice(2));
console.log(arr.slice(2, 4)); // 4 isn't included
console.log(arr.slice(-2));
console.log(arr.slice(-1));
console.log(arr.slice(1, -2));
console.log(arr.slice()); // Shallow copy w/ slice
console.log([...arr]); // Shallow copy with spread

// SPLICE - changes original array
// Similar to slice, but deletes from og array
// console.log(arr.splice(2)); // Deleted these from arr
arr.splice(-1);
arr.splice(1, 2); // First value is where it starts, second value is how many you want deleted
console.log(arr);

// REVERSE - changes original array
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse()); // Mutates original array
console.log(arr2);

// CONCAT - doesn't change og array
const letters = arr.concat(arr2); // Both in one big arr
console.log(letters);
// Seen before: same result as above
console.log([...arr, ...arr2]);
// JOIN - result is a string with separator specified
console.log(letters.join(' - '));
///////////////////////////////////
// Array Methods - AT method
///////////////////////////////////
// .at method another way of calling the index of an array value
const arr = [23, 11, 64];
console.log(arr[0]);
console.log(arr.at(0)); // Same as above

// Get last element of arr
console.log(arr[arr.length - 1]);
console.log(arr.slice(-1)[0]);
console.log(arr.at(-1)); // Quickest/easiest way

// At for strings as well
console.log('josiah'.at(0));
console.log('josiah'.at(-1));

///////////////////////////////////
// Looping Arrays: For each
///////////////////////////////////
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// Loop over array with old for of loop
// for (const movement of movements) {
//   if (movement > 0) {
//     console.log(`${movement} deposited`);
//   } else {
//     console.log(`${Math.abs(movement)} withdrawal`);
//   }
// }

// console.log('--- FOR EACH ---');

// FOR EACH LOOP: needs callback function to give for each instructions, then executes on each array value

// movements.forEach(function (movement) {
//   if (movement > 0) {
//     console.log(`${movement} deposited`);
//   } else {
//     console.log(`${Math.abs(movement)} withdrawal`);
//   }
// });

// Behind the scenes of looping the array with forEach
// 0: function(200)
// 1: function(450)
// 2: function(-400)
// ... etc.

// Get current index of array:
// Have to use .entries which makes an array with the first value is the index and the second is the actual values of the array, using destructuring

for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${i + 1}: ${movement} deposited`);
  } else {
    console.log(`Movement ${i + 1}: ${Math.abs(movement)} withdrawal`);
  }
}

console.log('--- FOR EACH ---');

// Much simpler, second parameter always the index

movements.forEach(function (mov, i, arr) {
  if (mov > 0) {
    console.log(`Movement ${i + 1}: ${mov} deposited`);
  } else {
    console.log(`Movement ${i + 1}: ${Math.abs(mov)} withdrawal`);
  }
});

// Main difference between 'for of' loop and forEach: you cannot use break or continue on forEach and the index

///////////////////////////////////
// Looping Maps and Sets: For each
///////////////////////////////////
// With maps
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});
// With sets: sets don't have keys so second parameter is just value again, can omit
console.log('--- FOR SETS ---');
const currenciesUnique = new Set(['USD', 'EUR', 'GBP', 'USD', 'USD', 'EUR']);
currenciesUnique.forEach(function (value, _, map) {
  console.log(`${value}: ${value} `);
});

///////////////////////////////////////
// Coding Challenge #1


Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀

const checkDogs = function (dogsJulia, dogsKate) {
  let newDogsJulia = dogsJulia.slice();
  newDogsJulia.splice(3, 2);
  newDogsJulia.splice(0, 1);
  const allDogs = newDogsJulia.concat(dogsKate);
  allDogs.forEach(function (age, i) {
    const dogType = age >= 3 ? 'adult' : 'puppy';
    // console.log(`Dog number ${i + 1} is`);
    if (age >= 3) {
      console.log(
        `Dog number ${i + 1} is an ${dogType}, and is ${age} years old`
      );
    } else console.log(`Dog number ${i + 1} is still a ${dogType} 🐶`);
  });
};
checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);

///////////////////////////////////
// Map Method for Arrays: Another Loop function
///////////////////////////////////
// Map method returns new array
const euroToUSD = 1.1;
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const movementUSD = movements.map(function (mov) {
  return mov * euroToUSD;
});
// Mini challenge
const movementArr = movements.map(mov => mov * euroToUSD);
console.log(movementArr);
// console.log(movements);
// console.log(movementUSD);

// More examples with map method
const movDesc = movements.map(
  (mov, i, arr) =>
    `Movement ${i + 1}: ${Math.abs(mov)} ${
      mov > 0 ? 'deposited' : 'withdrawal'
    }`
);
console.log(movDesc);

///////////////////////////////////
// Filter Method: Another Array method
///////////////////////////////////
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// Filter an array using old for of loop
const depositsForOf = [];
for (const mov of movements) if (mov > 0) depositsForOf.push(mov);

// Filter using .filter
const deposits = movements.filter(function (mov) {
  return mov > 0;
});
console.log(movements);
console.log(deposits);
const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals);
console.log(depositsForOf);

///////////////////////////////////
// Reduce Method
///////////////////////////////////
// Jonas says this is the most powerful array method
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// Main dif from other methods so far: first parameter is the accumulator, like a snowball effect
const balance = movements.reduce(function (acc, cur, i, arr) {
  console.log(`Iteration ${i}: ${acc}`);
  return acc + cur;
}, 0); //0 initial value of the acc, where it starts
// Same balance variable but with arrow function
const balance1 = movements.reduce((acc, cur) => acc + cur, 0);

console.log(balance);
console.log(balance1);

// Showcasing with for of loop: always need the external variable to make it work, why the array methods better
let balance2 = 0;
for (const mov of movements) balance2 += mov;
console.log(balance2);

// Retrieving MAX value from array using Reduce:
// Logic: if accumulator is greater than mov, keep the acc, if not try the next mov
const max = movements.reduce(
  (acc, mov) => (acc > mov ? acc : mov),
  movements[0]
);
console.log(max);

///////////////////////////////////////
// Coding Challenge #2


Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀


const calcAverageHumanAge = function (ages) {
  const ageHuman = ages.map((age, i) => (age <= 2 ? 2 * age : 16 + age * 4));
  const adults = ageHuman.filter(age => age >= 18);
  // const avg = adults.reduce((acc, age) => acc + age, 0) / adults.length;
  // Dif way avg: (2, 3) (2+3)/2 = 2.5 === 2/2 + 3/2 = 2.5
  const avg = adults.reduce((acc, age, i, arr) => acc + age / arr.length, 0);
  console.log(ageHuman);
  console.log(adults);
  console.log(avg);
};
calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);


///////////////////////////////////
// Magic of Chaining Methods Lecture:
///////////////////////////////////
// We want to take all movement deposits, then convert them to USD, and finally add them all up
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const euroToUSD = 1.1;
const depositsUSD = movements
  .filter(mov => mov > 0)
  .map(mov => mov * euroToUSD)
  .reduce((acc, mov) => acc + mov, 0);
console.log(depositsUSD);
///////////////////////////////////////
// Coding Challenge #3


Rewrite the 'calcAverageHumanAge' function from the previous challenge, but this time as an arrow function, and using chaining!

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀


const calcAverageHumanAgeArr = ages => {
  const avg = ages
    .map((age, i, arr) => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);
  console.log(avg);
};

calcAverageHumanAgeArr([5, 2, 4, 1, 15, 8, 3]);
calcAverageHumanAgeArr([16, 6, 10, 5, 6, 1, 4]);

///////////////////////////////////
// Find method:
///////////////////////////////////

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const firstWithdrawal = movements.find(mov => mov < 0);
console.log(firstWithdrawal);

// Showcase: find an object in an array based on a property of that object
console.log(accounts);
const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);
// Mini Challenge
const jd = [];
for (const acc of accounts) {
  if (acc.owner === 'Jessica Davis') {
    jd.push(acc);
  }
}
console.log(...jd);

///////////////////////////////////
// Array Methods - Some and Every
///////////////////////////////////
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log(movements);

// Includes asks === equality, does it exist?

console.log(movements.includes(-130));

// SOME you can use <, >, etc.

const anyDeposits = movements.some(mov => mov > 0);
console.log(anyDeposits);

// EVERY: like some but condition applied to all at once

console.log(movements.every(mov => mov > 0));
// Only positive movements, returns true
console.log(account4.movements.every(mov => mov > 0));

// Separate Callback Functions:
const deposit = mov => mov > 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));

///////////////////////////////////
// Array Methods - Flat and flatMap
///////////////////////////////////

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// ---------- FLAT ----------
// Flat array method flattens the array, removes any values that are nested in an array, arrays inside arrays

const arr = [[1, 2, 3], [4, 5, 6], 7, 8];

console.log(arr.flat()); // Returns all values

// More depth of nested arrays
const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2)); // Value specified determines the depth of nested arrays values being retrieved, default is 1

// Example: bank wants all movements from all accounts

// What I wrote as mini challenge

// const accountMovements = accounts.map(acc => acc.movements);
// console.log(accountMovements);
// console.log(accountMovements.flat());
// const totalArr = accountMovements.flat();
// const totalBal = totalArr.reduce((acc, mov) => acc + mov, 0);

// Proper with chaining

const totalBal = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);

console.log(totalBal);
// Notice here that map and flat are used together, this is very common so they created flatMap that combines the 2

// ---------- FLATMAP ----------
// flatMap only goes 1 level deep and you cannot change it, will only unpack 1 level of nested arrays
// flatMap receives a callback function the same as map

const totalBal2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);

console.log(totalBal2); // Same as above

///////////////////////////////////
// Sorting Arrays - sort Method
///////////////////////////////////
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// Sorting Strings Arrays
const owners = ['Jonas', 'Josiah', 'Zach', 'Martha'];
console.log(owners.sort());
console.log(owners); // Mutates original array

// Numbers
console.log(movements.sort()); // Sort sorts strings, treats numbers as strings, doesn't work properly
// Must use a callback function to set rules for sorting

// Small to Large numbers

// return > 0 - B, A // switch order
// return < 0 - A, B // keep order
movements.sort((a, b) => {
  if (a > b) return 1; // switch order
  if (a < b) return -1; // keep order
});

// Same as above, if a is greater than b, a - b is positive, if a is less than b, a - b is negative
movements.sort((a, b) => a - b);

console.log(movements);

// Large to small
movements.sort((a, b) => {
  if (a > b) return -1;
  if (a < b) return 1;
});

movements.sort((a, b) => b - a);
console.log(movements);

///////////////////////////////////
// Fill and From method: Creating Arrays
///////////////////////////////////

// How we have been creating arrays
const arr = [1, 2, 3, 4, 5, 6, 7];
new Array(1, 2, 3, 4, 5, 6, 7);

// If only one number is expressed, creates empty array with that many spaces
const x = new Array(7);
console.log(x);
// Fill mutates original array, second value is where it starts that value not included, set 3rd value as the end
x.fill(1);
console.log(x);

x.fill(2, 3, 6);
console.log(x);

arr.fill(17, 4, 7);
console.log(arr);

// Array.from: creating arrays programatically:
// Create an object that has the length of the array, then a function to fill that array

// Array of seven 1's
const y = Array.from({ length: 7 }, () => 1);
console.log(y);

// Array of 1-7
const z = Array.from({ length: 7 }, (cur, i) => i + 1);
console.log(z);

// Array of 100 dice rolls
const dice = Array.from(
  { length: 100 },
  () => Math.trunc(Math.random() * 6) + 1
);
// console.log(dice);

// Retrieving the movements straight from the UI to an array
labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  // console.log(movementsUI.map(el => Number(el.textContent.replace('€', ''))));
  console.log(movementsUI);
});

///////////////////////////////////
// Array Method Practice
///////////////////////////////////

// 1. Get all Deposits

const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((acc, mov) => acc + mov, 0);
console.log(bankDepositSum);

// 2. How many deposits at least 1000?
const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov >= 1000).length;
console.log(numDeposits1000);
// Reduce showcase: instead of accumulator, just count
const numDeposit1000 = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);
console.log(numDeposit1000);
// Prefixed ++ operator:
let a = 10;
console.log(a++); // Still 10, ++ returns og value first, then adds the 1, so a is 11 but at this point still 10
console.log(a);
console.log(++a); // Prefix adds before

// 3. Create an object with the sum of deposits + withdrawals
// Starting point needs to be an object, usually 0
// Must return the accumulator with curly braces

const sums = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
      // Second way to do it, bracket notation instead of dot, more dry
      sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );
console.log(sums);

// 4. Function that takes strings and makes titles
// this is a nice title -> This Is a Nice Title

const convertTitleCase = function (title) {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);
  // Create array with the exceptions:
  const exceptions = ['a', 'an', 'the', 'or', 'with', 'but', 'in', 'on'];
  // Convert Title using method chaining
  const titleCase = title
    .toLowerCase()
    .split(' ')
    // Add the exceptions, exclude them with .includes
    .map(word => (exceptions.includes(word) ? word : capitalize(word)))
    .join(' ');
  return capitalize(titleCase);
};

console.log(convertTitleCase(`this is a nice title`));
console.log(convertTitleCase(`this is a LONG title but not too long`));
console.log(convertTitleCase(`another title with an EXAMPLE`));


///////////////////////////////////////
// Coding Challenge #4

Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

GOOD LUCK 😀
recommendedFood = weight ** 0.75 * 28
*/
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 1. Calculate Recommended Food
dogs.forEach(function (dog) {
  dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28);
  console.log(`${dog}`);
});
console.log(dogs);

// 2. Find Sarah and determine if dogs is fed enough
const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(dogSarah);
console.log(
  `Sarah's dog is eating too ${
    dogSarah.curFood > dogSarah.recommendedFood ? 'much' : 'little'
  }`
);
// 3. New Arrays for too much or too little
const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recommendedFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooMuch);

const ownersEatTooLittle = dogs
  .filter(dog => dog.recommendedFood > dog.curFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooLittle);
// 4. Log above to console
console.log(`${ownersEatTooMuch.join(' and ')}'s dog eats too much`);
console.log(`${ownersEatTooLittle.join(' and ')}'s dog eats too little`);
// 5.
const exact = dogs.includes(dogs.curFood === dogs.recommendedFood);
console.log(exact);
// 6.current > (recommended * 0.90) && current < (recommended * 1.10
const checkOkay = dogs =>
  dogs.curFood > dogs.recommendedFood * 0.9 &&
  dogs.curFood < dogs.recommendedFood * 1.1;

const okay = dogs.some(checkOkay);
console.log(okay);
// 7. Create array that has all dogs that eat an okay amount
const okayArray = dogs.filter(checkOkay).flatMap(dog => dog.owners);
console.log(okayArray);

// 8. Array ascending order
const recFoodAsc = dogs
  .slice()
  .sort((a, b) => a.recommendedFood - b.recommendedFood);
console.log(recFoodAsc);
