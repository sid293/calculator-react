import './App.css';
import { useState } from 'react';

function App() {
  let [state, setState] = useState("");
  // let isOperator = false;
  let [isOperator, setIsOperator] = useState(false);
  let [output, setOutput] = useState("");

  let buttonsArray = ['7','8','9','+','4','5','6','-','1','2','3','*','C','0','=',"/"];

  class stack{
    constructor(){
      this.items = [];
    }
    push(element){
      this.items.push(element);
    }
    pop(){
      if(this.isEmpty()){
        return null;
      }
      return this.items.pop();
    }
    isEmpty(){
      return this.items.length === 0;
    }
    peek(){
      if(this.isEmpty()){
        return null;
      }
      return this.items[this.items.length -1];
    }
  }

let stacknums = new stack();
let stackop = new stack();

  function isNumber(char) {
    const regex = /[0-9]/;
    return regex.test(char);
}

let operate = (num1,operation,num2)=>{
  if(operation === "+"){
    return num1+num2;
  }
  if(operation === "-"){
    return num1-num2;
  }
  if(operation === "/"){
    if(num1 === 0 && num2 === 0){
      setOutput("NaN");
      return "NaN";
    }
    if(num2 === 0){
      setOutput("Infinity");
      return "Infinity";
    }
    return num1/num2;
  }
  if(operation === "*"){
    return num1*num2;
  }
}

let compareOperation = (op1,op2)=>{
  let values = {
    "%":4,
    "*":3,
    "+":2,
    "-":1
  }
  if(values[op1] > values[op2]){
    return op1;
  }else{
    return op2;
  }

}

  let calculateResult = ()=>{
    if(state === ""){
      setOutput("Error");
      return;
    }
    for(let i =0;i<state.length;i++){
      let c = state[i];
      if(isNumber(c)){
        let number = c;
        while(isNumber(state[i+1])){
          number+=state[i+1];
          i++;
        }
        stacknums.push(Number(number));
      }else{           // if its operator
        if(stackop.isEmpty()){
          stackop.push(c);
        }else{
          //checking which operation should be performed before -+/*
          let a = compareOperation(stackop.peek(),c);
          if(a === stackop.peek()){
            let num1 = stacknums.pop();
            let num2 = stacknums.pop();
            let ans = operate(num1,a,num2);
            if(ans === "NaN"){
              setOutput("NaN");
              return;
            }
            if(ans === "Infinity"){
              setOutput("Infinity");
              return;
            }

            console.log("one calculating ",num1,a,num2," ",ans);
            stackop.pop();
            stacknums.push(ans);
            stackop.push(c);
          }else{
            let num1 = stacknums.pop();
            let num2 = "";
            i++;
            while(isNumber(state[i])){
              num2+=state[i];
              i++;
            }
            num2 = Number(num2);
            let ans = operate(num1,c,num2);
            if(ans === "NaN"){
              setOutput("NaN");
              return;
            }
            if(ans === "Infinity"){
              setOutput("Infinity");
              return;
            }

            console.log("two calculating ",num1,c,num2," ",ans);
            stacknums.push(ans);
            // debugger;
            // let num2 = state[c+1]; 
            if(i < state.length){
              stackop.push(state[i]);
            }
          }
        }
      }
    }
    while(!stackop.isEmpty()){
      let num1 = stacknums.pop();
      let num2 = stacknums.pop();
      let operation = stackop.pop();
      let ans = operate(num2,operation,num1);
      stacknums.push(ans);
    }
    let ans = stacknums.pop();
    if(ans === "NaN"){
      setOutput("NaN");
      return;
    }
    if(ans === "Infinity"){
      setOutput("Infinity");
      return;
    }
    console.log("ans is ",ans);
    if(output === ""){
      console.log("output is ",output);
      setOutput(ans);
    }
  }
  let handleButton = (char)=>{
    if(char === "C"){
      setState("");
      setOutput("");
      setIsOperator(false);
    }else if(char === "="){
      calculateResult();
    }else if(isNumber(char)){
      setState((prev)=> prev+char);
      setIsOperator(false);
      console.log("is number");
    }else if(!isOperator){
      console.log("is operator",isOperator);
      setIsOperator(true);
      setState((prev)=> prev+char);
    }
  }

  return (
    <div className="App">
      <h1>React Calculator</h1>
      <input type="text" value={state} />
      <div>{output}</div>
      <div className='buttonsDivWrapper'>
        <div className={"buttonsDiv"}>
          {
            buttonsArray.map((buton)=>(
              <button onClick={()=>{handleButton(buton)}}>{buton}</button>
            ))
          }
        </div>
      </div>
    </div>
  );
}

export default App;
