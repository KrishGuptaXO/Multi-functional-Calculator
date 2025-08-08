document.addEventListener("DOMContentLoaded",()=>{
let input = document.getElementById('inputbox');
let buttons = document.querySelectorAll('#basicsection button');
let string = "";
buttons.forEach(button => {
  button.addEventListener('click', () => {
    let value = button.textContent.trim();
    if (value === '=') {
      string=eval(string);
      input.value=string;
    } else if(value==='AC'){
      string = '';
      input.value='';
    } else if(value==='CE'){
      string = '';
      input.value = '';
    } else if(value==='⌫'){
      string=string.slice(0,-1);
      input.value = string;
    } else if(value==='%'){
      string=String(eval(string)/100);
      input.value=string;
    } else if(value==='π'){
      string+=Math.PI;
      input.value=string;
    } else if(value==='x²'){
      string=String(eval(string)**2);
      input.value =string;
    } else if(value==='√'){
      string=String(Math.sqrt(eval(string)));
      input.value=string;
    } else if(value==='+/-'){
      if(string){
        if(string.startsWith('-')){
          string = string.slice(1);
        } else{
          string = "-" + string;
        }
        input.value = string;
      }
    }
    else{
      string+=value;
      input.value = string;
    }
  });
});

document.querySelectorAll('.a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('data-target');
    if (targetId === 'standard') {
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }, 50);
    } else{
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});
let prevScrollPos = window.pageYOffset;
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  const currentScrollPos = window.pageYOffset;
  if (prevScrollPos > currentScrollPos) {
    navbar.style.top = "0";
  } else {
    navbar.style.top = "-100px";
  }
  prevScrollPos = currentScrollPos;
});

// ================= Temperature Converter Logic =================
const fromValue = document.getElementById('from-value');
const fromUnit = document.getElementById('from-unit');
const toUnit = document.getElementById('to-unit');
const convertBtn = document.querySelector('.convert-btn');
const resultBox = document.getElementById('to-value');
const formulaBox = document.getElementById('formula-box');

function convertTemp(value, from, to) {
  let result;
  if (from === 'Celsius') result = value;
  else if (from === 'Farenheit') result = (value - 32) * (5 / 9);
  else if (from === 'Kelvin') result = value - 273.15;

  if (to === 'Celsius') result = result;
  else if (to === 'Farenheit') result = (result * 9 / 5) + 32;
  else if (to === 'Kelvin') result = result + 273.15;

  return result.toFixed(2);
}

function getFormulaLatex(from, to) {
  const map = {
    'Celsius->Farenheit': 'F = \\frac{9}{5}C + 32',
    'Farenheit->Celsius': 'C = \\frac{5}{9}(F - 32)',
    'Celsius->Kelvin': 'K = C + 273.15',
    'Kelvin->Celsius': 'C = K - 273.15',
    'Farenheit->Kelvin': 'K = \\frac{5}{9}(F - 32) + 273.15',
    'Kelvin->Farenheit': 'F = \\frac{9}{5}(K - 273.15) + 32'
  };
  return map[`${from}->${to}`] || 'ERROR';
}

convertBtn.addEventListener('click', () => {
  const value = parseFloat(fromValue.value);
  const from = fromUnit.value;
  const to = toUnit.value;
  if (isNaN(value)) {
    resultBox.value = "Enter a valid input";
    formulaBox.style.display = 'none';
    return;
  }
  const result = convertTemp(value, from, to);
  resultBox.value = result;
  
  // Display formula
  const formula = getFormulaLatex(from, to);
  formulaBox.innerHTML = `$$${formula}$$`;
  formulaBox.style.display = 'block';
  MathJax.typeset();
});

// ================= Currency Converter Logic =================
const dropdowns = document.querySelectorAll(".curr-select select");
const btn = document.querySelector("#curr-form button");
const fromCurr = document.querySelector("select[name='from']");
const toCurr = document.querySelector("select[name='to']");
const msg = document.querySelector(".msg");
const amountInp = document.querySelector(".amount input");
const fromImg = fromCurr.parentElement.querySelector("img");
const toImg = toCurr.parentElement.querySelector("img");

for(let select of dropdowns){
  for(let code in countryList){
    const option = document.createElement("option");
    option.value = code;
    option.textContent = code;
    if(select.name === "from" && code==="USD") option.selected = true;
    if(select.name === "to" && code==="INR") option.selected = true;
    select.appendChild(option);
  }
  select.addEventListener("change",(e)=> {
    const currCode = e.target.value;
    const countryCode = countryList[currCode];
    const imgTag = e.target.parentElement.querySelector("img");
    imgTag.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
  });
}

btn.addEventListener("click", async (e) => {
  e.preventDefault();
  const amountVal = amountInp.value;
  if (!amountVal || isNaN(amountVal)) {
    msg.textContent = "Please enter a valid number.";
    return;
  }

  const from = fromCurr.value;
  const to = toCurr.value;
  const url = `https://v6.exchangerate-api.com/v6/1e54df9296dce85ba3b83db2/latest/${from}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.result !== "success") {
      msg.textContent = "API Error: Unable to get rates.";
      return;
    }

    const rate = data.conversion_rates[to];
    const finalAmount = (amountVal * rate).toFixed(2);
    msg.textContent = `${amountVal} ${from} = ${finalAmount} ${to}`;
  } catch (err) {
    msg.textContent = "Something went wrong. Try again.";
  }
});

});