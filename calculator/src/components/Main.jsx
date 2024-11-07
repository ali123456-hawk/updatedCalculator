import { useState } from "react";
import Button from "./Button";
import Display from "./Display";

function Main() {
  const [input, setInput] = useState([]);
  const [memory, setMemory] = useState([]);  // Stores last 3 results
  const [memoryIndex, setMemoryIndex] = useState(-1);  // Keeps track of which memory result to show



  const buttonValues = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["0", ".", "+"],
    ["-", "*", "/",],
    ["(", ")", "%"]
  ];

  // Handle button clicks (adding numbers or operators to the input)
  const handleClick = (value) => {
    if (value === '%') {
      // Handle percentage button click
      applyPercentage();
    } else {
      // Add value to input
      setInput((prevInput) => [...prevInput, value]);
    }
  };

  const applyPercentage = () => {
    let lastInput = input.join("");  
    if (lastInput) {
      
      let match = lastInput.match(/(\d+(\.\d+)?)$/);
      if (match) {
        let number = parseFloat(match[0]);
        
        const percentageValue = number * 0.01;
    
        setInput((prevInput) => [
          ...prevInput.slice(0, prevInput.length - match[0].length), 
          percentageValue.toString()
        ]);

      } else {
        setInput(["Error"]);
      }
    }
  };

  
  const handleClear = () => {
    setInput([]);
  };

  
  const handleEquals = () => {
    try {
      let expression = input.join("");
      expression = expression.replace(/(\d+)%/g, (match, p1) => {
        return `(${p1} / 100)`;
      });

      const result = eval(expression); 
      console.log("Expression : " + expression + " = " + result);

      // Add the new result to memory
      setMemory((prevMemory) => {
        const newMemory = [...prevMemory, { expression, result: result.toString() }];
        return newMemory.length > 5 ? newMemory.slice(-5) : newMemory;
      });

      setInput([result.toString()]);
      setMemoryIndex(-1);  // Reset memory index after a new calculation
    } catch (error) {
      setInput(["Error"]);
    }
  };



  const handleShowMemory = () => {
    if (memory.length > 0) {
      setMemoryIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % memory.length;  // Cycle through memory
        setInput([memory[newIndex].expression + " = " + memory[newIndex].result]);
        return newIndex;
      });
    }
  };


  return (
    <div className="calculator">
      <Display value={input.join("")} />

      <div className="buttons">
        {buttonValues.map((row, rowIndex) => (
          <div key={rowIndex} className="button-row">
            {row.map((button, buttonIndex) => (
              <Button key={buttonIndex} value={button} onClick={handleClick} />
            ))}
          </div>
        ))}

        <div className="button-row">
          <button onClick={handleEquals}>=</button>
          <button onClick={handleClear}>C</button>
          <button onClick={handleShowMemory}>M</button>

        </div>
      </div>
    </div>
  );
}

export default Main;
