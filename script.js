const form = document.querySelector("form");
const inputs = document.querySelectorAll('input[type="number"], input[type="text"]');
const radioInputs = document.querySelectorAll('input[type="radio"]');
const resultDiv = document.querySelector(".result__max");

// reset selected radio label style
form.addEventListener("reset", () => {
    document.querySelectorAll('input[type="radio"]').forEach(function(r) {
        r.parentElement.style.backgroundColor = "";
        r.parentElement.style.borderColor = "";
    });
});

// selected radio label style
radioInputs.forEach(r => {
    r.addEventListener("change", () => {
        radioInputs.forEach(r => {
            r.parentElement.style.backgroundColor = "";
            r.parentElement.style.borderColor = "";
        });
        if(r.checked) {
            r.parentElement.style.backgroundColor = "hsl(60, 72%, 93%)";
            r.parentElement.style.borderColor = "hsl(61, 70%, 52%)";
        };
    });
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    let isValid = true;
    // number input validation
    inputs.forEach(i => {            
        const err = i.parentElement.nextElementSibling;
        if(i.value === "") {
            isValid = false;            
            err.innerHTML = `This field is required`;
            i.style.borderColor = "hsl(4, 69%, 50%)";
            i.nextElementSibling.style.backgroundColor = "hsl(4, 69%, 50%)";
            i.nextElementSibling.style.color = "white";       
        } else {
            isValid = true;
            err.innerHTML = ``;
            i.style.borderColor = "";
            i.nextElementSibling.style.backgroundColor = "";
            i.nextElementSibling.style.color = "";
        }
    })

    // radio validation
    const errRadio = document.querySelector(".error-radio");
    let radioChecked = false;
    radioInputs.forEach(r => {
        if (r.checked) {
            radioChecked = true;
        }
    });
    if (!radioChecked) {
        errRadio.innerHTML = `This field is required`;
        isValid = false;
    } else {
        errRadio.innerHTML = ``;
    }

    // mortgage calculation
    const amount = document.getElementById("mortgage-amount").value;
    const cleanValue = amount.replace(/[^\d,]/g, '');
    const mortgageAmount = parseInt(cleanValue.replace(",", ""));

    const mortgageTerm = document.getElementById("term").value;
    const interest = document.getElementById("interest").value;
    
    
    const monthlyInterestRate = interest / (12 * 100);

    const totalPayments = mortgageTerm * 12;

    let monthlyRepayment = 0;
    let totalRepayment = 0;
    
    const mortgageType = document.querySelector('input[type="radio"]:checked').value;
    
    if (mortgageType === 'repayment') {
        monthlyRepayment = mortgageAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments) /
                            (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);
        totalRepayment = monthlyRepayment * totalPayments;
    } else if (mortgageType === 'interest') {
        monthlyRepayment = mortgageAmount * monthlyInterestRate;
        totalRepayment = mortgageAmount;
    }

    const formattedMonthlyRepayment = monthlyRepayment.toLocaleString('en-GB', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    const formattedTotalRepayment = totalRepayment.toLocaleString('en-GB', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    // display completed result 
    if(isValid) {
      resultDiv.innerHTML = `
            <div class="result__wrap result__completed">
                <h3 class="result__completed-title">Your results</h3>
                <p class="result__completed-descr">Your results are shown below based on the information you provided. 
                To adjust the results, edit the form and click “calculate repayments” again.</p>
                <div class="result__completed-board">
                <div class="result__completed-month-stack">
                    <p class="result__completed-subtitle">Your monthly repayments</p>
                    <p class="result__completed-month">£${formattedMonthlyRepayment}</p>
                </div>
                <hr>
                <div class="result__completed-total-stack">
                    <p class="result__completed-subtitle">Total you'll repay over the term</p>
                    <p class="result__completed-total">£${formattedTotalRepayment}</p>
                </div>
                </div> 
            </div>
        `;  
    }

});