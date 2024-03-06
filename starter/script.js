'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2023-11-27T17:01:17.194Z',
    '2023-11-20T23:36:17.929Z',
    '2023-11-22T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
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

/////////////////////////////////////////////////
// Functions
const formatDate = function(date,local){
 
  const daySpent = (day1,day2) => Math.round(Math.abs((day2-day1)/(1000*24*60*60)));

  const dayPassed = daySpent(new Date(),date)
  if(dayPassed === 0) return "Today";
  if(dayPassed === 1) return "Yesterday";
  if(dayPassed <= 7) return  `${dayPassed} days ago`
  else{
 /*  const year = `${date.getFullYear()}`.padStart(2,0);
  const month = `${date.getMonth()+1}`.padStart(2,0);
  const day = `${date.getDate()}`.padStart(2,0);
  return  `${year}/${month}/${day}`; */
  const options = {
    hour : "numeric",
    minute : "numeric",
    day : "numeric",
    month : "long",
    year : "numeric",
    weekday : "short"
  }
  return new Intl.DateTimeFormat(currentAccount.locale,options).format(date);

 }
}

const formatNumber = function(value,locale,currency){
  return new Intl.NumberFormat(locale,{style:"currency",currency:currency}).format(value);
}

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
   /*  const year = `${date.getFullYear()}`.padStart(2,0);
    const month = `${date.getMonth()+1}`.padStart(2,0);
    const day = `${date.getDate()}`.padStart(2,0); */
    const displayDate = formatDate(date);
  /*   const formatNum = new Intl.NumberFormat(acc.locale,{style:"currency",currency:acc.currency}).format(mov); */
  const formatNum = formatNumber(mov,acc.locale,acc.currency);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formatNum}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  /* labelBalance.textContent = `${acc.balance.toFixed(2)}€`; */
  labelBalance.textContent = formatNumber(acc.balance,acc.locale,acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  /* labelSumIn.textContent = `${incomes.toFixed(2)}€`; */
  labelSumIn.textContent = formatNumber(incomes,acc.locale,acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
/*   labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`; */
   labelSumOut.textContent = formatNumber(Math.abs(out),acc.locale,acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
 /*  labelSumInterest.textContent = `${(interest).toFixed(2)}€`; */
    labelSumInterest.textContent = formatNumber(interest,acc.locale,acc.currency);
};

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

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

///////////////////////////////////////
// Event handlers
let currentAccount;
/* currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity=100; */
/*const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = `${now.getMonth()+1}`.padStart(2,0);
const currentDate  = `${now.getDate()}`.padStart(2,0);
const curretHour = `${now.getHours()}`.padStart(2,0);
const curretMinute = `${now.getMinutes()}`.padStart(2,0);
labelDate.textContent = `${currentYear}/${currentMonth}/${currentDate}, ${curretHour}:${curretMinute}`;*/

//experiment intl api -> which is used to create date and time based on each country locale 

/* const intlTest = new Date();
const options = {
  hour : "numeric",
  minute : "numeric",
  day : "numeric",
  month : "long",
  year : "numeric",
  weekday : "short"
} */
//short --> nov , long --> november, narrow --> N
//const locale = navigator.language// identify the local string right from our search engine 
/*console.log(locale);
console.log(intlTest);
labelDate.textContent = new Intl.DateTimeFormat(locale,options).format(intlTest);*///pass the local string based on the countrty, we can pass time as well using options object which could even be used to change the pattern of the format 
let timer;//need to be global to change the timer when different account log in because need to remove old timer and should assign new timer 
const setTimeCounter = function(){
  //set a time 
  //print the time using settimeinterval every one second
  //update the remaining time 
  let time = 60;
  const tick = function(){
    const minutes = `${Math.trunc(time/60)}`.padStart(2,0);
    const seconds = `${time%60}`.padStart(2,0);
    labelTimer.textContent = `${minutes}:${seconds}`;
  
   if(time===0){
    clearInterval(timer);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = "Log in to get started";
   }
   time--;//need to come after if condition because once 1 second come it log out so need to show 0, so first update as zero then apply if condition 
 }
 tick();//to avoid the time count showing one second right after execution finished 
   timer = setInterval(tick,1000);
   return timer;
}

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    const intlTest = new Date();
    const options = {
      hour : "numeric",
      minute : "numeric",
      day : "numeric",
      month : "long",
      year : "numeric",
      weekday : "short"
}
//short --> nov , long --> november, narrow --> N
   const locale = currentAccount.locale// identify the local string right from our search engine 
   //console.log(locale);
   //console.log(intlTest);
  labelDate.textContent = new Intl.DateTimeFormat(locale,options).format(intlTest);//pass the local string based on the countrty, we can pass time as well using options object which could even be used to change the pattern of the format 

   /*  const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = `${now.getMonth()+1}`.padStart(2,0);
    const currentDate  = `${now.getDate()}`.padStart(2,0);
    const curretHour = `${now.getHours()}`.padStart(2,0);
    const curretMinute = `${now.getMinutes()}`.padStart(2,0);
    labelDate.textContent = `${currentYear}/${currentMonth}/${currentDate}, ${curretHour}:${curretMinute}`; */

    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    clearInterval(timer);//clear the old timer
    timer = setTimeCounter();//and update new timer

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
   
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    clearInterval(timer);
    timer = setTimeCounter();
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    
    setTimeout(function(){
      // Add movement
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
  
      // Update UI
      clearInterval(timer)
      timer = setTimeCounter();
      updateUI(currentAccount);
    },5000)
   
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
console.log(23===23.000);//js store numbers internally as float points so that give true 
console.log(0.2+0.1);
console.log(0.1+0.2);//internally js store numbers in 64 base 2 where storing decimal is no as easy as what we do in decimal, so ouput come 0.300000004 which can be solved in js juslike in php and ruby also we can not make precise financial calculation in js 
console.log(0.1+0.2 === 0.3); //false but should be true 
console.log(0.1+0.4 === 0.5); // true 
//string to numbers 
console.log(Number("23"));
console.log(+"23");//+ sign do type coercion which make all string to number 

//parsing - just like type coercion but more advance than that, it is used function/object like Number();
//its second argument should be 10 base to avoid some issues, pointoing 2 base as argument could give errors 
console.log(Number.parseInt("23",10));//23 as integer output 
console.log(Number.parseInt(" 23prt ",10))//23 as integer,useful to read value out of string particularly the css values
console.log(Number.parseInt(" lkj23 ",10))//NaN begining caharacters should be number character to make it integer 

console.log(Number.parseInt("25hj",2));//nan

console.log(Number.parseFloat("2.5 jh",10))//2.5 as decimal value
console.log(Number.parseInt("2.5kl"))//give 2 not give decimal 2.5

//this parse method can be called as globally but to give name space its better to call it on Number()
console.log(parseInt("25 kl "));

//isNaN() check if value is NaN(not a number)
console.log(Number.isNaN(20));//false 
console.log(Number.isNaN("20"));//false
console.log(Number.isNaN("20kg"));//false 
console.log(Number.isNaN(+"20tf"));//true
console.log(Number.isNaN("jkl20"));//false
console.log(Number.isNaN(20/0));//false

//isFinite() to check if value is number 
console.log(Number.isFinite(20));//true 
console.log(Number.isFinite("20"));//false
console.log(Number.isFinite("20kl"));//false
console.log(Number.isFinite(+"20"));//true
console.log(Number.isFinite(+"20lop")) //false 
console.log(Number.isFinite("hj20"));//false 
console.log(Number.isFinite(20/0));//false 
console.log(Number.isFinite(20.5))//true

//isInteger to check if value is integer 
console.log(Number.isInteger(20));//true 
console.log(Number.isInteger("20"));//false 
console.log(Number.isInteger(+"20"))//true
console.log(Number.isInteger(+"20jkl"))//false
console.log(Number.isInteger("20lko"))//false
console.log(Number.isInteger(20.3))//false
console.log(Number.isInteger(20/0));//false

//Math and rounding 
console.log("********************Math and Rounding********************************************");
//sqr root 
console.log(Math.sqrt(25));//5
console.log(Math.sqrt("25"));//5
console.log(Math.sqrt("25klj"));//NaN
console.log(25**(1/2));//5
console.log("25"**(1/2));//5
console.log("25"**("1/2"));//nan

//max and minimum 
console.log(Math.max(1,2,3,4,54));//54
console.log(Math.max("25",1,2,3,"12"))//25
console.log(Math.max("25","12px","13",2,5,8))//nan
console.log(Math.min(1,2,3,4,54))//1
console.log(Math.min("25",1,2,3,"12"));//1
console.log(Math.min("25","12px","13",2,5,8))//nan

//constant pi 
console.log(Number.parseFloat("10rem"));
console.log(Math.PI*Number.parseFloat("10rem")**2)

//random numbers 
console.log(Math.random())//give number(decimal and non decimal) between 0.0001--0.99
console.log(Math.trunc(Math.random()))//rounded number 0
console.log(Math.trunc(Math.random()*6))//give numbrer between 0-5
console.log(Math.trunc(Math.random()*6+1))//give 1--6

const random =(max,min)=>Math.trunc(Math.random()*(max-min)+1)+min; //0---max-min-1 -> 1----max-min -> 1+min ---- max
console.log(random(12,10)); //11-12

//rounding
//Math.trunc() --> cut all decimal part 
console.log(Math.trunc(23.6));//23
console.log(Math.trunc(23.3));//23
console.log(Math.trunc("23.6"));//23
console.log(Math.trunc(+"23.65"));//23

//Math.floor() --> round down to nearest integer
console.log(Math.floor(23.3));//23
console.log(Math.floor(23.5));//23
console.log(Math.floor(23.9));//23
console.log(Math.floor("23.6"));//23
console.log(Math.floor("23.6rem"));//nan

//Math.ceil() --> round up to nearest integer 
console.log(Math.ceil(23.3));//24
console.log(Math.ceil("23.6"));//24
console.log(Math.ceil(+"23.9"));//24

//trunc() and floor() method seems to be same but in the negative value it is not but for positive value its same 
console.log(Math.floor(-23.3))//-24
console.log(Math.trunc(-23.3))//-23

//rounding decimals 
//toFixed() always return string value just like first the primitive is turned into string object by boxing method and once after a string like method is applied on that object it again retured as string type 
console.log((23.6).toFixed(0));//24
console.log((25.3256).toFixed(2))//25.33
console.log(+(28.36).toFixed(1))//28.4 +sign here make it as number type 

//remainders 
console.log(8/3);
console.log(8%3);//remainder 2
console.log(2/2);
console.log(2%2);//remainder 0

const isEven = num => num%2 === 0;
console.log(isEven(8));//true
console.log(isEven(514));
console.log(isEven(125));//false

labelBalance.addEventListener("click",function(){
  [...document.querySelectorAll(".movements__row")].forEach((mov,i)=>{
    if(i%2===0){
      mov.style.backgroundColor = "orangered";
      //mov stands for element from node list 
      //node element on which the event handler should work
    }
    if(i%3===0){
      mov.style.backgroundColor = "blue";
    }
  })
})

//numeric seperators 
//make a format that all can understand - mostly in numbers 
const num = 456_589_569_466
console.log(562_456_569);
console.log(num);
console.log(parseInt("546_456"))//546

console.log(65_56);
const pi = 3.1_45
console.log(pi);
//between numbers only it gives output before and after numbers it would give errors
//console.log(3._145); error
//console.log(_123) error
//console.log(123_) error
console.log(Number(134_156));//134156
console.log(Number("123_569"))//NaN
console.log(+"123_123")//NaN

//bigInt 
//it is a data type that is used to store the value that can not be handled in jsvascript since javascript would store values upto 2**53-1 which is 64 bit two base format where 53bit use for integer values while rest of the bits used for decimal values , so if we use such values which is greater than 2**53-1 there would be error in mathametical operation so to solve it bigInt data type used 
console.log(2**53-1)//9007199254740991
console.log(Number.MAX_SAFE_INTEGER)//9007199254740991

console.log(2**53)  //9007199254740992
console.log(2**53+1)// 9007199254740992
console.log(2**53+2)//9007199254740994
console.log(2**53+3)//9007199254740996
//so here when the value become greater than 2**53-1 there is failiure in mahematic operations 
//so bigInt introduced as follows 
console.log(444444444444444444444444444444444444n);//444444444444444444444444444444n

const num_1 = 1225668126554444447788555n;
console.log(num_1);//1225668126554444447788555n

//operations
console.log(BigInt(111111111111111111111111111111112564));//111111111111111113774877033367601152n
//BigInt() is used to make a normal value as bigInt type
//because during the mathematical operations the bigInt would not mix or do math operation with normal values 
//console.log(2000000000000000000n*9); error
//console.log(22222222222222222222222222222n+6); error

console.log(200000n+123n)//200123n
console.log(1245666666666666666666666666666n*BigInt(10))//12456666666666666666666666666660n

//comparisions 
console.log(20n>15);//true
console.log(20n === 20)//false because never do type coercion because two types are different so false '
console.log(20n==20)//true
console.log(typeof 20n);//bigint
console.log(20n=="20")//true two equals do type coercion

//math operation would give error 
//console.log(Math.sqrt(64n)) error

//string concat would make bigINt as string it would not give any isuues 
const huge = 444444444444444444444444444444444444444444n
console.log(huge+" is really big")//44444444444444444444444444444444444444 is really big

//divisions 
console.log(10/3)//3.33333333333
console.log(10n/3n)//nearest bigInt so here 3n
console.log(11n/3n)//3n
console.log(12n/3n);//4n

//creating Date 
//new Date() --> we can parse string inside the dtae() paranthese 
console.log(new Date());
console.log(new Date("Wed Nov 22 2023 18:53:33"))
console.log(new Date("2015 december 24"));

console.log(new Date(2019,10,20,23,15,5));
//here months starts from 0 so 0 means january 
console.log(new Date(0));//Thu Jan 01 1970 05:30:00 GMT+0530 (India Standard Time) this is computer standard unix time 
console.log(new Date(3*24*60*60*1000))//Sun Jan 04 1970 05:30:00 GMT+0530 (India Standard Time), 3 days after the unix time so which is calculated using milliseconds , 3*24*60*60*1000 which is called time stamp
console.log(new Date(2013,11,20));

//working with dates 
//dates also specila kind of object just like arrays , which also has methods and properties 

const future = new Date(2037,10,12,15,23);
console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth());
console.log(future.getDate());
console.log(future.getDay());//sunday - 0, monday -1, tuesday -2 ,wednesday -3, thursday -4
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getSeconds());
console.log(future.getTime());//give time stamp of date stored in the future variable
console.log(new Date(2141632380000));//Thu Nov 12 2037 15:23:00 GMT+0530 (India Standard Time) 
console.log(Date.now())//1700669143686 - current time stamp
console.log(new Date(1700669143686));//Wed Nov 22 2023 21:35:43 GMT+0530 (India Standard Time) -- showing current time using current time stamp
console.log(future.toISOString());//2037-11-12T09:53:00.000Z make iso string format 

//set object properties 
future.setFullYear(1997);
console.log(future);//Wed Nov 12 1997 15:23:00 GMT+0600 (India Standard Time)
future.setMonth(6)
future.setDate(17)
console.log(future);
console.log(new Date(account1.movementsDates[0]));

console.log(Math.round(-23.9));//-24
console.log(Math.round(-23.3));//-23
console.log(Math.round(23.3));//23
console.log(Math.round(23.5));//24

console.log(Number(new Date()));//1700711734016 -- make it as number would give time stamp
console.log(+new Date());
console.log(new Date().getTime());//1700711734016

const daySpent = (day1,day2) => Math.round(Math.abs((day2-day1)/(1000*24*60*60)));
console.log(daySpent(new Date(2023,10,12),new Date(2023,10,20)))

console.log(daySpent(new Date(2023,10,12),new Date(2023,10,8)))

//number internalization 
const numIntl = 3451245.325
const optionsNum = {
  //style : "unit",
  //unit : "mile-per-hour"

  style : "percent"
}

const optionsCurrency ={
  style : "currency",
  currency : "EUR"
}


console.log("US : ",new Intl.NumberFormat("en-US").format(numIntl));//US :  3,451,245.325
console.log("Germany : ", new Intl.NumberFormat("de-DE").format(numIntl));//Germany :  3.451.245,325

//units,//percentage
console.log("US : ",new Intl.NumberFormat("en-US",optionsNum).format(numIntl));//US :  3,451,245.325mph/%
console.log("Germany : ", new Intl.NumberFormat("de-DE",optionsNum).format(numIntl));//Germany :  3.451.245,325 mi/p/%

//currency options 
console.log(new Intl.NumberFormat("en-US",optionsCurrency).format(numIntl));//€3,451,245.33
console.log(new Intl.NumberFormat("de-DE",optionsCurrency).format(numIntl))//3.451.245,33 €
//browser locale 
console.log(new Intl.NumberFormat(navigator.language,optionsCurrency).format(numIntl))//€3,451,245.33

//useGrouping - flase would not group the number
const currencyGroup = {
  style:"currency",
  currency : "EUR",
  useGrouping : false
}
console.log(new Intl.NumberFormat(navigator.language,currencyGroup).format(numIntl))//€3451245.33


//settime out 
//To implement asynchronous js -> it call the function in future after some amout of time 
//once after setimeout is called it would store the timer in a variable, we can delete the timer using cleartimeout(setimeoutstored variable) then callback function inside the setimeout will not be called after the particular some amount of time 
//it would not stop the execution of javascript but it would register the callfunction to be called after some time in future 
//it is used as example for closure where the callback function inside it was called even after the execution context gone whichmeans the callback function inside it remembered the variable enviroment wherre it was born
//since the setimeout functions callback function is called by settimeout in future we do not have control over it to pass our argument to callback functions, so to pass argument callback function we pass it after the delay time in the settimeout , those argument passed after delay time is considered as arguments of callback function inside the settimeout.

setTimeout(()=>console.log(`Order pizza`),3000);//comes after waiting
console.log("waiting.....");//comes first even before callbak function

//argument passing 
setTimeout((ing1,ing2)=>console.log(`Ordering pizza with ${ing1} and ${ing2}`),5000,"spiniach","cheese");

//cleartimeout()
const ingredients = ["spiniach","cheese"];
const pizzaTimer = setTimeout((ing1,ing2)=>console.log(`Tasting pizza with ${ing1} and ${ing2}`),4000,...ingredients);

if(ingredients.includes("spiniach")) clearTimeout(pizzaTimer);//no output of "tasting with pizza with spiniach and cheese" since it contains spiniach so it got cleartimeout, which means that timer was not call the callback function after the particular time in future 

//setInterval -- it is not like settimeout which could execute the callback function once after some amount of time but it would execute the callback function between particular time interval 

/* setInterval(()=>{
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const second = now.getSeconds();
  console.log(`${hour} : ${minute} : ${second}`);
},1000); */

/* let clock = setInterval(function(){
  return new Date();
});

let hours = setInterval(()=>new Date().getHours(),1000);
let minutes = setInterval(()=>new Date().getMinutes(),1000);
let second = setInterval(()=>new Date().getMinutes(),1000);

console.log(`${hours} : ${minutes} : ${second}`); */




