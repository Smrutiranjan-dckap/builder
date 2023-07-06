import React from 'react';
import { TreeSelect, Select, Input, Button } from "antd";

function ConditionBox(props) {
  const {
    node,
    indices,
    allFields,
    handleChange,
    handleDelete,
    handleAddNewFieldName,
  } = props;

  const ifConditionOptions = {
    less_than: "less than",
    equals_to: "equals to",
    is_equal_to: "is equal to",
    greater_than: "greater than",
    is_not_equal_to: "is not equal to",
    less_than_or_equal_to: "less than or equal to",
  };

  const dataTypes = {
    string: "String",
    number: "Number",
    object: "Object",
    boolean: "Boolean"
  };

  const searchKeyInNestedObject = (obj, keyName) => {
    for (let key in obj) {
      if (key === keyName) {
        return true;
      }

      if (typeof obj[key] === 'object' && obj[key] !== null) {
        if (searchKeyInNestedObject(obj[key], keyName)) {
          return true;
        }
      }
    }

    return false;
  };

  const renderTreeNode = (data, parentKey = null) => {
    return Object.entries(data).map(([key, value]) => {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        return (
          <TreeSelect.TreeNode value={parentKey ? parentKey + "." + key : key} title={key} key={parentKey ? parentKey + "." + key : key}>
            {renderTreeNode(value, parentKey ? parentKey + "." + key : key)}
          </TreeSelect.TreeNode>
        );
      }
      return <TreeSelect.TreeNode value={parentKey ? parentKey + "." + key : key} title={key} key={parentKey ? parentKey + "." + key : key} />;
    });
  };

  const NestedObjectTreeSelect = (nestedObject) => {
    return (
      <TreeSelect
        showSearch
        allowClear
        treeDefaultExpandAll
        style={{ width: '100%' }}
        onSearch={(e) => {console.log(e)}}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        onChange={(value) => { handleChange(indices, "field", value) }}
      >
        {renderTreeNode(nestedObject)}
      </TreeSelect>
    );
  };

  return (
    <div className='condition-box'>
      {/* tree Select */}
      {NestedObjectTreeSelect(allFields)}

      {/* Condition Select */}
      <Select
        style={{ width: '60%' }}
        value={ifConditionOptions[node['condition']]}
        onChange={(value) => { handleChange(indices, "condition", value) }}>
        {Object.entries(ifConditionOptions).map(([key, value]) => <Select.Option value={key}>{value}</Select.Option>)}
      </Select>

      {/* Input data */}
      <Input
        value={node.value['value']}
        onChange={(e) => { handleChange(indices, 'value', e.target.value) }}/>

      {/* Data Type Select*/}
      <Select
        style={{ width: '50%' }}
        value={dataTypes[node.value['type']]}
        onChange={(value) => { handleChange(indices, 'type', value) }}>
        {
          Object.entries(dataTypes).map(([key, value]) => <Select.Option value={key}>{value}</Select.Option>)
        }
      </Select>

      {/* Delete Button */}
      <Button
        onClick={() => {handleDelete(indices) }}
        type="primary">D</Button>
    </div>
  )
}

export default ConditionBox;