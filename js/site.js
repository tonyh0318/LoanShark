function generatePayment(loanAmount, interestRate, term) {

    return (loanAmount * interestRate) / (1 - Math.pow(1 + interestRate, -term));
}

function calcCurrentInterest(balance, rate) {
    return balance * rate;
}


function buildPymtSched() {
    let loanAmount = Number(document.getElementById("loanAmount").value); //The amount of money loaned in dollars
    let interestRate = parseFloat(document.getElementById("rate").value / 1200); //The percentage rate at which interest will accrue on the loan 
    const term = parseInt( document.getElementById("numOfPaymts").value); //The time over which the loan will be repaid, in months
    const payment = generatePayment(loanAmount, interestRate, term);
    let paymentDataStructs = getPaymts(loanAmount, interestRate, term, payment);

    //pass the array to the display function
    displayTableData(paymentDataStructs);


}


function getPaymts(amt, rate, term, payment) {
    let paymentDataStructs = {
        payments: [],
        details: {}
    };

    let balance = amt;
    let totalInterest = 0;
    let monthlyPrincipal = 0;
    let monthlyInterest = 0;
    let monthlyTotalInterest = 0;


    for (month = 1; month <= term; month++) {

        monthlyInterest = calcCurrentInterest(balance, rate);
        totalInterest += monthlyInterest;
        monthlyPrincipal = payment - monthlyInterest;
        balance = balance - monthlyPrincipal;

        let currentPymt = {
            month: month,
            payment: payment,
            principal: monthlyPrincipal,
            interest: monthlyInterest,
            totalInterest: totalInterest,
            balance: balance
        };
        paymentDataStructs.payments.push(currentPymt);
    }

    let details = {
        payment: payment,
        totalPrincipal: amt,
        totalInterest: totalInterest,
        totalCost: (amt + totalInterest)
    };

    paymentDataStructs.details = details;
    return paymentDataStructs;
}

function displayTableData(paymtDataStructs){
      //get the table we are going to add to.
      let tableBody = document.getElementById("paymtBody");
      let template = document.getElementById("pymtemplate");

      //clear the table for previous calculations
      tableBody.innerHTML = "";

      for (let i = 0; i < paymtDataStructs.payments.length; i++) {
          //get a clone row template
          payRow = template.content.cloneNode(true);
          //grab only the columns in the template
          paycols = payRow.querySelectorAll("td");

          //build the row
          //we know that there are six columns in our template
          paycols[0].textContent = paymtDataStructs.payments[i].month;
          paycols[1].textContent = paymtDataStructs.payments[i].payment.toFixed(2);
          paycols[2].textContent = paymtDataStructs.payments[i].principal.toFixed(2);
          paycols[3].textContent = paymtDataStructs.payments[i].interest.toFixed(2);
          paycols[4].textContent = paymtDataStructs.payments[i].totalInterest.toFixed(2);
          paycols[5].textContent = Math.abs(paymtDataStructs.payments[i].balance).toFixed(2);

          //append to the table
          tableBody.appendChild(payRow);
      }

      //total interest is in the last row of the payments array.
      let totalInterest = paymtDataStructs.details.totalInterest;
      let payment = paymtDataStructs.details.payment;
      let loanAmount = paymtDataStructs.details.totalPrincipal;
      let totalCost = paymtDataStructs.details.totalCost;

      //Build out the summary area
      let labelPrincipal = document.getElementById("totalPrincipal");
      labelPrincipal.innerHTML = Number(loanAmount).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
      });

      let labelInterest = document.getElementById("totalInterest");
      labelInterest.innerHTML = Number(totalInterest).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
      });

      let paymentdiv = document.getElementById("payment");
      paymentdiv.innerHTML = `<div class="d-flex justify-content-center"><h1>${Number(payment).toLocaleString("en-US", {style: "currency", currency: "USD", })} </h1></div>`;
 

      let totalCostDiv = document.getElementById("totalCost");
      totalCostDiv.innerHTML = Number(totalCost).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
      });
}


