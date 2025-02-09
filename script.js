const cash = document.getElementById("cash");
const purchaseButton = document.getElementById("purchase-btn");
const changeDue = document.getElementById("change-due");
const cashInRegister = document.getElementById("cash-in-register");
const total = document.getElementById("total");

let price = 3.26;
let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
];

const updateCashInRegister = () => {
  cashInRegister.innerHTML = `<h3>Change in drawer:</h3>
                              <p>Pennies: $${cid[0][1]}</p>
                              <p>Nickels: $${cid[1][1]}</p>
                              <p>Dimes: $${cid[2][1]}</p>
                              <p>Quarters: $${cid[3][1]}</p>
                              <p>Ones: $${cid[4][1]}</p>
                              <p>Fives: $${cid[5][1]}</p>
                              <p>Tens: $${cid[6][1]}</p>
                              <p>Twenties: $${cid[7][1]}</p>
                              <p>Hundreds: $${cid[8][1]}</p>`;

  total.innerText = "Total: $" + String(price);
};

updateCashInRegister();

const calculateChange = (totalDenom, denomWorth, changeRemaining, denomNumber = 0) => {
  if (totalDenom === 0 || changeRemaining < denomWorth) {
    return denomNumber;
  } else {
    totalDenom -= denomWorth;
    changeRemaining -= denomWorth;
    denomNumber++;

    return calculateChange(totalDenom, denomWorth, changeRemaining, denomNumber);
  }
};

const purchase = () => {
  const customerCash = Math.floor(cash.value * 100);
  const itemPrice = Math.floor(price * 100);

  if (customerCash < itemPrice) {
    alert("Customer does not have enough money to purchase the item");
  } else if (customerCash === itemPrice) {
    changeDue.innerHTML = "<p>No change due - customer paid with exact cash</p>";
  } else {
    let changeRemaining = customerCash - itemPrice;
    let totalCashInRegister = cid.reduce((acc, el) => acc + Math.floor(el[1] * 100), 0);

    if (totalCashInRegister < changeRemaining) {
      changeDue.innerHTML = "<p>Status: INSUFFICIENT_FUNDS</p>";
    } else if (totalCashInRegister === changeRemaining) {
      let changeOutPut = [];

      cid.forEach(el => {
        if (el[1] > 0) {
          changeOutPut.unshift(`<p>${el[0]}: $${el[1]}</p>`)
          el[1] = 0;
        }
      });

      changeDue.innerHTML = "<p>Status: CLOSED</p>" + changeOutPut.join("");
      updateCashInRegister();

    } else {
      let textContent = "";
      const denomWorth = [1, 5, 10, 25, 100, 500, 1000, 2000, 10000];
      const cidCopy = [...cid];
      let denomCount = 0;
      let subtracted = 0;

      for (let i = cid.length - 1; i >= 0; i--) {
        denomCount = calculateChange(Math.floor(cid[i][1] * 100), denomWorth[i], changeRemaining)

        if (denomCount > 0) {
          subtracted = denomCount * denomWorth[i];
          cid[i][1] = ((Math.floor(cid[i][1] * 100) - subtracted) / 100).toFixed(2);
          changeRemaining -= subtracted;
          totalCashInRegister -= subtracted;
          textContent += `<p>${cid[i][0]}: $${(subtracted / 100).toFixed(2)}</p>`;

          if (changeRemaining === 0)
            break;
        }
      }

      if (changeRemaining === 0) {
        updateCashInRegister();
        changeDue.innerHTML = `<p>Status: ${totalCashInRegister === 0 ? "CLOSED" : "OPEN"}</p>${textContent}`;
      }
      else {
        cid = cidCopy;
        changeDue.innerHTML = "<p>Status: INSUFFICIENT_FUNDS</p>";
      }
    }
  }
};

purchaseButton.addEventListener("click", purchase);
cash.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    purchase();
  }
});