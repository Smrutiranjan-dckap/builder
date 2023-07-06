import './App.css';
import React, { useState, useEffect } from 'react';
import data from "./data/data.json";
import ConditionalBuilder from "./components/conditionalBuilder";

function App() {
  const [state, setState] = useState({
    allFields: {},
    conditions: [],
    node_id: 'node_id_1',
    addConditionEnabled: false,
  });

  useEffect(() => {
    let defaultValue = [
      { "field": "", "condition": "", "value": { "type": "", "value": "" } },
    ];

    // let defaultValue = [
    //   { "field": "status", "condition": "equals_to", "value": { "type": "Number", "value": "123" } },
    //   { "operator": "AND" },
    //   [
    //     { "field": "width", "condition": "equals_to", "value": { "type": "Number", "value": "456" } },
    //     { "operator": "OR" },
    //     { "field": "price1", "condition": "equals_to", "value": { "type": "Number", "value": "20" } },
    //     { "operator": "AND" },
    //     [
    //       { "field": "width", "condition": "equals_to", "value": { "type": "Number", "value": "456" } },
    //       { "operator": "OR" },
    //       { "field": "price3", "condition": "equals_to", "value": { "type": "Number", "value": "20" } },
    //       { "operator": "OR" },
    //       [
    //         { "field": "widthinner", "condition": "equals_to", "value": { "type": "Number", "value": "456" } },
    //         { "operator": "OR" },
    //         { "field": "price1", "condition": "equals_to", "value": { "type": "Number", "value": "20" } },
    //       ],
    //       { "operator": "OR" },
    //       { "field": "width", "condition": "equals_to", "value": { "type": "Number", "value": "456" } },
    //     ],
    //     { "operator": "OR" },
    //     { "field": "price1", "condition": "equals_to", "value": { "type": "Number", "value": "20" } },
    //   ],
    //   { "operator": "AND" },
    //   { "field": "desc", "condition": "equals_to", "value": { "type": "String", "value": "Hello" } }
    // ];

    setState({
      ...state,
      conditions: defaultValue,
      allFields: data ? data : {}
    });
  }, []);

  const handleAddNewFieldName = (key) => {
    let allFields = state.allFields;
    allFields[key] = "";
    setState({
      ...state,
      allFields
    })
  };

  const handleAddCondition = (indices, value, condition = state.conditions) => {
    if (indices.length === 1) {
      // Inserting Conditions
      if (value === "nested") {
        condition.push({ "operator": "and" });
        condition.push([{ "field": "", "condition": "", "value": { "type": "", "value": "" } }]);
      } else {
        condition.push({ "operator": value });
        condition.push({ "field": "", "condition": "", "value": { "type": "", "value": "" } });
      }
    }

    const index = indices[0];
    const remainingIndices = indices.slice(1);

    if (Array.isArray(condition[index])) {
      handleAddCondition(remainingIndices, value, condition[index]); // Recursively call the function for nested arrays
    }

    setState({
      ...state,
      conditions: condition,
      addConditionEnabled: false,
    })
  };

  const handleChange = (indices, key, value, condition = state.conditions) => {
    if (indices.length === 1) {
      if (key === "operator") {
        if (value == "nested") {
          condition[indices[0]]['operator'] = 'and';
          condition[indices[0] + 1] = [{ "field": "", "condition": "", "value": { "type": "", "value": "" } }];
          // condition.splice(indices[0] + 1, 0, [{ "field": "", "condition": "", "value": { "type": "", "value": "" } },])
        } else {
          condition[indices[0]]['operator'] = value
        }
      } else if (key == "type" || key == 'value') {
        condition[indices[0]]['value'][key] = value;
      } else if (key == 'field') {
        condition[indices[0]][key] = state.node_id + "." + value;
      } else {
        condition[indices[0]][key] = value;
      }
    }

    const index = indices[0];
    const remainingIndices = indices.slice(1);

    if (Array.isArray(condition[index])) {
      handleChange(remainingIndices, key, value, condition[index]); // Recursively call the function for nested arrays
    }

    setState({
      ...state,
      conditions: condition
    })
  };

  const handleDelete = (indices, condition = state.conditions) => {
    if (indices.length === 1) {
      condition.splice(indices[0] - 1, 2);
    }

    const index = indices[0];
    const remainingIndices = indices.slice(1);

    if (Array.isArray(condition[index])) {
      handleDelete(remainingIndices, condition[index]); // Recursively call the function for nested arrays
    }

    setState({
      ...state,
      conditions: condition
    })
  };
  
  const toggle = () => {
    setState({
      ...state,
      addConditionEnabled : !state.addConditionEnabled
    })
  };

  return (
    <div className="App">
      <ConditionalBuilder 
        toggle={toggle}
        allFields={state.allFields}
        handleChange={handleChange}
        handleDelete={handleDelete}
        conditions={state.conditions}
        handleAddCondition={handleAddCondition}
        handleAddNewFieldName={handleAddNewFieldName}
        addConditionEnabled={state.addConditionEnabled}
      />
    </div>
  );
}

export default App;
