import React, { useState } from 'react';
import { Button, Select, Radio } from 'antd';
import ConditionBox from "./conditionBox.jsx";

function ConditionalBuilder(props) {
  const {
    toggle,
    allFields,
    conditions,
    handleDelete,
    handleChange,
    handleAddCondition,
    addConditionEnabled,
    handleAddNewFieldName,
  } = props;

  return (
    <div className='builder-wrapper'>
      <h1>Conditional Builder</h1>
      <div className="action-area">
        <div className="builder-box">
          {/* All Conditions added here */}
          <TreeView
            data={conditions}
            allFields={allFields}
            handleChange={handleChange}
            handleDelete={handleDelete}
            handleAddCondition={handleAddCondition}
            handleAddNewFieldName={handleAddNewFieldName}
          />
          {/* Add condition button */}
          <div className={!addConditionEnabled ? 'add-condition' : 'add-condition-btn'}>
            {
              addConditionEnabled
                ? <div>
                  <Radio.Group onChange={(e) => { handleAddCondition([conditions.length], e.target.value) }}>
                    <Radio.Button value="and">AND</Radio.Button>
                    <Radio.Button value="or">OR</Radio.Button>
                    <Radio.Button value="nested">Nested</Radio.Button>
                  </Radio.Group>
                  <Button onClick={() => { toggle() }} >*</Button>
                </div>
                : <Button onClick={() => { toggle() }} >+</Button>
            }
          </div>
        </div>
        <div className="result-box">
          <textarea value={JSON.stringify(conditions, null, 2)}></textarea>
        </div>
      </div>
    </div>
  )
};

const TreeView = (props) => {
  const [state, setState] = useState({
    addConditionEnabled: false,
  })

  const {
    data,
    allFields,
    indices = [],
    handleChange,
    handleDelete,
    handleAddCondition,
    handleAddNewFieldName,
  } = props;

  const toggle = () => {
    setState({
      ...state,
      addConditionEnabled : !state.addConditionEnabled
    })
  }

  return (
    <ul className='condition-list'>
      {data.map((item, idx) => (
        <TreeNode
          key={idx}
          data={data}
          node={item}
          state={state}
          toggle={toggle}
          allFields={allFields}
          handleChange={handleChange}
          handleDelete={handleDelete}
          indices={[...indices, idx]}
          handleAddCondition={handleAddCondition}
          handleAddNewFieldName={handleAddNewFieldName}
        />
      ))}
    </ul>
  );
};

const TreeNode = (props) => {
  const {
    node,
    data,
    state,
    toggle,
    indices,
    allFields,
    handleChange,
    handleDelete,
    handleAddCondition,
    handleAddNewFieldName,
  } = props;
  function addNode() {
    if (typeof node === 'object' && node.hasOwnProperty('field')) {
      return (
        <li>
          <div className="linebar"></div>
          <ConditionBox
            node={node}
            data={data}
            indices={indices}
            allFields={allFields}
            handleDelete={handleDelete}
            handleChange={handleChange}
            handleAddNewFieldName={handleAddNewFieldName}
          />
        </li>
      );
    } else if (typeof node === 'object' && node.hasOwnProperty('operator')) {
      return (
        <li>
          {/* <div className="linebar"></div> */}
          <div className='operator-dropdown'>
            <Select
              value={node['operator']}
              onChange={(e) => { handleChange(indices, 'operator', e) }}
              style={{ width: 75 }}>
              <Select.Option value="and">AND</Select.Option>
              <Select.Option value="or">OR</Select.Option>
            </Select>
          </div>
        </li>
      );
    } else if (Array.isArray(node)) {
      return (
        <li>
          <TreeView
            data={node}
            toggle={toggle}
            indices={indices}
            allFields={allFields}
            handleChange={handleChange}
            handleDelete={handleDelete}
            handleAddCondition={handleAddCondition}
            handleAddNewFieldName={handleAddNewFieldName} />
          {
            node.length > 0 &&
            <div className={!state.addConditionEnabled ? 'add-condition' : 'add-condition-btn'}>
              {
                state.addConditionEnabled
                  ? <div>
                    <Radio.Group
                      onChange={(e) => {
                        toggle()
                        handleAddCondition([...indices, node.length], e.target.value)
                      }}>
                      <Radio.Button value="and">AND</Radio.Button>
                      <Radio.Button value="or">OR</Radio.Button>
                      <Radio.Button value="nested">Nested</Radio.Button>
                    </Radio.Group>
                    <Button onClick={() => { toggle() }} >*</Button>
                  </div>
                  : <Button onClick={() => { toggle() }} >+</Button>
              }
            </div>
          }
        </li>
      );
    }
  }
  return addNode();
};

export default ConditionalBuilder