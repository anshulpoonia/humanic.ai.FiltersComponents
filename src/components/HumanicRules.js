// Reuired Parames in props
//======================================================================
// onChange -> State to save form values
// tempRulesRaw -> Form Json Array     ***Existing rules will be there***
// rules -> Rules output array json   ***Final response will be there***
// comparators -> Comparator array
// properties -> json array
// defaultValue -> default selected rule

"use client"
import React, { useState } from "react";
import { useEffect } from "react";
import { ButtonGroup, Col, Form, Row, ToggleButton } from "react-bootstrap";
import FeatherIcon from "feather-icons-react";
// import { Select } from "../components/vendor";----------->I am
import { v4 as uuid } from "uuid";
import _, { isObject } from "lodash";
// import HumanicHelper from "../helpers/HumanicHelper";----------->I am
import CreatableSelect from "react-select/creatable";
// import logger from "../util/logger";---------------->I am

//import { CreatableSelect } from "react-select/creatable/dist/react-select-creatable.cjs.js";
const HumanicRules = (props) => {
  const [personaRules, setPersonaRules] = useState([]);
  // const defaultComparator = HumanicHelper.rules.DATATYPE_TO_DEFAULT_CHOICE;----------->I am

  const personaGroups = [
    { name: "AND", value: "and" },
    { name: "OR", value: "or" },
  ];

  useEffect(() => {
    let tempRules = props.tempRulesRaw
      ? props.tempRulesRaw
      : {
          type: "group",
          operator: "or",
          rules: [],
        };
    tempRules.id = uuid();
    tempRules.isRoot = true;
    setPersonaRules(parsePersonaRules(tempRules));
  }, []);

  useEffect(() => {
    if (props.name) {
      props.setOutputPersonaRules(parsePersonaOutput(personaRules), props.name);
    } else {
      // props.setOutputPersonaRules(parsePersonaOutput(personaRules));----------->I am
    }
  }, [personaRules]);

  const processDefaultValue = (choices, value) => {
    let temp = { label: value, value: value };
    for (let key in choices) {
      if (key === value) {
        temp = {
          label: choices[key],
          value: key,
        };
        break;
      }
    }
    return temp;
  };

  const processDefaultPropertyValue = (propertiesArr, value) => {
    let choiceArr = {};
    for (const i in propertiesArr) {
      if (propertiesArr[i].name === value) {
        choiceArr = {
          label: propertiesArr[i].title,
          value: propertiesArr[i].name,
        };
      }
    }
    return choiceArr;
  };

  const checkPropertyValueChoices = (value) => {
    for (const i in props.properties) {
      if (props.properties[i].name === value && props.properties[i].choices) {
        return props.properties[i].choices;
      }
    }
    return false;
  };

  const processChoices = (choices, name) => {
    let choiceArr = [];
    console.log("processChoices choices", choices);
    if (name === "info_icon") {
      for (let key in choices) {
        let temp = {
          imgSrc: "/img/" + key + ".png",
          label: choices[key],
          value: key,
        };
        choiceArr.push(temp);
      }
    } else {
      for (let key in choices) {
        let temp = {
          label: choices[key],
          value: key,
        };
        choiceArr.push(temp);
      }
    }
    choiceArr = _.orderBy(choiceArr, ["label"], ["asc"]);
    return choiceArr;
  };

  const processRuleChoices = (choices) => {
    let choiceArr = [];

    for (const i in choices) {
      let temp = {
        label: choices[i].title,
        value: choices[i].name,
      };
      choiceArr.push(temp);
    }
    choiceArr = _.orderBy(choiceArr, ["label"], ["asc"]);
    return choiceArr;
  };

  function parsePersonaRules(tempRules) {
    let newPersonaRules = {
      isRoot: tempRules.isRoot ? tempRules.isRoot : false,
      id: tempRules.id ? tempRules.id : uuid(),
      type: tempRules.type,
      operator: tempRules.operator,
    };
    let updatedPresonaRule = [];

    for (let j in tempRules.rules) {
      if (tempRules.rules[j].type == "group") {
        updatedPresonaRule.push(
          tempRules.rules[j].rules ? parsePersonaRules(tempRules.rules[j]) : []
        );
      } else {
        let newRule = {
          id: uuid(),
          type: tempRules.rules[j].type,
          operator: tempRules.rules[j].operator,
          property: tempRules.rules[j].property,
          comparator: tempRules.rules[j].comparator,
          value: tempRules.rules[j].value,
          valueField: handlePropertySelect(tempRules.rules[j].property),
        };
        updatedPresonaRule.push(newRule);
      }
    }
    newPersonaRules.rules = updatedPresonaRule;
    return newPersonaRules;
  }

  const handlePropertySelect = (name) => {
    let properties = props.properties;
    let temp = {};
    for (let i in properties) {
      if (properties[i].name === name) {
        if (properties[i].choices) {
          temp = {
            type: properties[i].type,
            choices: properties[i].choices,
          };
        } else {
          temp = {
            type: properties[i].type,
          };
        }
      }
    }
    return temp;
  };

  const removePersonaGroup = (id) => {
    let updatedPresonaRule = removePersonaRecursive(personaRules, id);
    setPersonaRules(updatedPresonaRule);
  };

  const removePersonaRules = (id) => {
    let updatedPresonaRule = removePersonaRecursive(personaRules, id);
    setPersonaRules(updatedPresonaRule);
  };

  function removePersonaRecursive(personaRulesExisting, id) {
    let newPersonaRulesExisting = [];
    newPersonaRulesExisting.isRoot = personaRulesExisting.isRoot;
    newPersonaRulesExisting.id = personaRulesExisting.id;
    newPersonaRulesExisting.type = personaRulesExisting.type;
    newPersonaRulesExisting.operator = personaRulesExisting.operator;

    let updatedRules = [];
    if (personaRulesExisting.rules) {
      personaRulesExisting.rules.map((data, index) => {
        if (data.id !== id) {
          if (data.type === "group")
            updatedRules.push(removePersonaRecursive(data, id));
          else updatedRules.push(data);
        }
      });
    }
    newPersonaRulesExisting.rules = updatedRules;

    return newPersonaRulesExisting;
  }

  const sortPersonaRuleOverGroup = (personaRulesExisting) => {
    let newPersonaRulesExisting = [];
    newPersonaRulesExisting.isRoot = personaRulesExisting.isRoot;
    newPersonaRulesExisting.id = personaRulesExisting.id;
    newPersonaRulesExisting.type = personaRulesExisting.type;
    newPersonaRulesExisting.operator = personaRulesExisting.operator;

    if (personaRulesExisting.rules) {
      let updatedRules = personaRulesExisting.rules.sort(function (a, b) {
        return a.type.length > b.type.length;
      });
      newPersonaRulesExisting.rules = updatedRules;
    } else {
      newPersonaRulesExisting.rules = [];
    }
    return newPersonaRulesExisting;
  };

  const getPropertyDefaultComparator = (property) => {
    if (props.properties) {
      let prop = _.find(
        props.properties,
        (p) => p.id === property || p.name === property
      );
      logger.log("getPropertyDefaultComparator property", prop);
      let isDetailObj =
        defaultComparator[prop.datatype] &&
        _.isPlainObject(defaultComparator[prop.datatype]);
      if (isDetailObj) {
        return (
          defaultComparator[prop.datatype][prop.title?.toLowerCase()] ||
          defaultComparator[prop.datatype]["default"]
        );
      } else return defaultComparator[prop.datatype] || "";
    }
  };

  const isApplicableComparator = (property, comparator) => {
    const applicableOperator = getFilteredApplicableComparator(property);
    logger.log("isApplicableComparator applicableOperator", applicableOperator);
    return !!applicableOperator[comparator];
  };

  const getFilteredApplicableComparator = (property) => {
    let prop = _.find(
      props.properties,
      (p) => p.id === property || p.name === property
    );
    if (prop && prop.datatype) {
      let allowedComparatorType =
        HumanicHelper.rules.DATATYPE_TO_COMPARATOR_CHOICES[prop.datatype];
      let allowedComparator = HumanicHelper.rules[allowedComparatorType];
      return _.pickBy(props.comparators, (value, key) => {
        return _.has(allowedComparator, key);
      });
    } else return props.comparators;
  };

  const onChangePersonaRules = (id, name, value) => {
    let updatedPersonaRules = onChangePersonaRulesRecursive(
      personaRules,
      id,
      name,
      value
    );
    setPersonaRules(updatedPersonaRules);
  };

  function onChangePersonaRulesRecursive(
    personaRulesExisting,
    id,
    name,
    value
  ) {
    let newPersonaRulesExisting = [];
    newPersonaRulesExisting.isRoot = personaRulesExisting.isRoot;
    newPersonaRulesExisting.id = personaRulesExisting.id;
    newPersonaRulesExisting.type = personaRulesExisting.type;
    newPersonaRulesExisting.operator = personaRulesExisting.operator;
    let newPersonaRule = [];

    if (personaRulesExisting.rules) {
      personaRulesExisting.rules.map((data, index) => {
        let newData = data;
        if (data.type === "group") {
          newData = onChangePersonaRulesRecursive(data, id, name, value);
        } else {
          if (data.id === id) {
            logger.log("newData before updated", newData);
            newData[name] = value;
            if (name == "property") {
              logger.log("onChangePersonaRulesRecursive property", data);
              newData["valueField"] = handlePropertySelect(value);
              // let availableComparator = getFilteredApplicableComparator(value);
              // logger.log("availableComparator", availableComparator);

              if (newData.comparator == "" || !isApplicableComparator()) {
                newData["comparator"] = getPropertyDefaultComparator(value);
                //newData["value"] = "1";
                // newData["availableComparator"] = getFilteredApplicableComparator(value)
              }
              newData["value"] = getRulesValue(null, newData.comparator);
            }
          }
        }
        //logger.log('newData updated', newData);
        newPersonaRule.push(newData);
      });
    }
    newPersonaRulesExisting.rules = newPersonaRule;

    return newPersonaRulesExisting;
  }

  const addNewPersonaRule = (groupId) => {
    let newPersonaRules = addRecursivePersonaRule(personaRules, groupId);
    setPersonaRules(newPersonaRules);
  };

  function addRecursivePersonaRule(personaRulesExisting, groupId) {
    let newPersonaRulesExisting = [];
    newPersonaRulesExisting.isRoot = personaRulesExisting.isRoot;
    newPersonaRulesExisting.id = personaRulesExisting.id;
    newPersonaRulesExisting.type = personaRulesExisting.type;
    newPersonaRulesExisting.operator = personaRulesExisting.operator;

    let newPersonaRule = personaRulesExisting.rules
      ? personaRulesExisting.rules
      : [];
    if (personaRulesExisting.id === groupId) {
      newPersonaRule.push({
        id: uuid(),
        type: "rule",
        operator: "",
        property: "",
        comparator: "",
        value: "",
        valueField: "",
      });
      newPersonaRulesExisting.rules = newPersonaRule;
    } else {
      let updatedRules = [];
      if (personaRulesExisting.rules) {
        personaRulesExisting.rules.map((data, index) => {
          let newData = data;
          if (data.type === "group") {
            newData = addRecursivePersonaRule(data, groupId);
          }
          updatedRules.push(newData);
        });
      }
      newPersonaRulesExisting.rules = updatedRules;
    }
    return sortPersonaRuleOverGroup(newPersonaRulesExisting);
  }

  const changePersonaGroup = (id, operator) => {
    let updatedPersonaRules = changePersonaGroupRecursive(
      personaRules,
      id,
      operator
    );
    setPersonaRules(updatedPersonaRules);
  };

  function changePersonaGroupRecursive(personaRulesExisting, id, operator) {
    let newPersonaRulesExisting = [];
    newPersonaRulesExisting.isRoot = personaRulesExisting.isRoot;
    newPersonaRulesExisting.id = personaRulesExisting.id;
    newPersonaRulesExisting.type = personaRulesExisting.type;
    newPersonaRulesExisting.operator = personaRulesExisting.operator;
    let newPersonaRule = personaRulesExisting.rules
      ? personaRulesExisting.rules
      : [];
    if (personaRulesExisting.id === id) {
      newPersonaRulesExisting.operator = operator;
      newPersonaRulesExisting.rules = newPersonaRule;
    } else {
      let updatedPresonaRule = [];
      if (personaRulesExisting.rules) {
        personaRulesExisting.rules.map((data, index) => {
          let newData = data;
          if (data.type === "group") {
            newData = changePersonaGroupRecursive(data, id, operator);
          }
          updatedPresonaRule.push(newData);
        });
      }
      newPersonaRulesExisting.rules = updatedPresonaRule;
    }

    return newPersonaRulesExisting;
  }

  const addNewGroup = (id, operator) => {
    let updatedPersonaRules = addRecursiveGroup(personaRules, id, operator);
    setPersonaRules(updatedPersonaRules);
  };

  function addRecursiveGroup(personaRulesExisting, id, operator) {
    let newPersonaRulesExisting = [];
    newPersonaRulesExisting.isRoot = personaRulesExisting.isRoot;
    newPersonaRulesExisting.id = personaRulesExisting.id;
    newPersonaRulesExisting.type = personaRulesExisting.type;
    newPersonaRulesExisting.operator = personaRulesExisting.operator;

    let newPersonaRule = personaRulesExisting.rules
      ? personaRulesExisting.rules
      : [];
    if (personaRulesExisting.id === id) {
      newPersonaRule.push({
        isRoot: false,
        type: "group",
        operator: operator,
        id: uuid(),
        rules: [],
      });
      newPersonaRulesExisting.rules = newPersonaRule;
    } else {
      let updatedPresonaRule = [];
      if (personaRulesExisting.rules) {
        personaRulesExisting.rules.map((data, index) => {
          let newData = data;
          if (data.type === "group") {
            newData = addRecursiveGroup(data, id, operator);
          }
          updatedPresonaRule.push(newData);
        });
      }
      newPersonaRulesExisting.rules = updatedPresonaRule;
    }

    return newPersonaRulesExisting;
  }

  function getPropertyTitle(id) {
    return _.find(props.properties, (p) => p.id == id)?.title || "";
  }
  function getComparatorTitle(id) {
    return props.comparators[id];
  }

  function extractPersonaRuleString(rules) {
    // logger.log("extractPersonaRuleString", rules);----------->I am
    let ruleString = "";
    // if (rules)
    //     rules.map((rule, index) => {
    //         if (rule.type === "rule") {
    //             ruleString += ' ' + getPropertyTitle(rule.property) + ' ' + getComparatorTitle(rule.comparator) + ' ' + rule.value;
    //         } else {
    //             ruleString += ` ${rule.operator || 'or'} ( ` + extractPersonaRuleString(rule) + ` ) `;
    //         }
    //     })
    // logger.log("PersonaRuleString", ruleString);
    return ruleString;
  }

  function parseRulesOutput(rules) {
    let parsedRules = [];
    if (rules && rules.length > 0) {
      rules.map((rule, index) => {
        if (rule.type === "rule") {
          let newRule = {
            type: rule.type,
            operator: rule.operator,
            property: rule.property,
            comparator: rule.comparator,
            value: rule.value,
          };

          parsedRules.push(newRule);
        } else parsedRules.push(parsePersonaOutput(rule));
      });
    }
    return parsedRules;
  }

  function parsePersonaOutput(finalPersona) {
    extractPersonaRuleString(finalPersona.rules);
    let outputPersona = {};
    outputPersona.type = finalPersona.type;
    outputPersona.operator = finalPersona.operator;
    outputPersona.rules = parseRulesOutput(finalPersona.rules);
    extractPersonaRuleString(outputPersona);
    return outputPersona;
  }

  const getRulesValue = (existingValue, comparator) => {
    // logger.log("getRulesValue", existingValue, comparator);
    // let item = _.find(HumanicHelper.rules.COMPARATOR_DEFAULT_VALUE, (i) =>
    //   i.comparator.includes(comparator)
    // );
    // logger.log("getRulesValue item", item);
    return existingValue !== null ? existingValue : item?.value;
  };

  const personaModalComp = (rules) => {
    return (
      <>
        <Row
          key={rules.id}
          className={`my-1 rule-row ms-1 rounded w-100 ${
            rules.isRoot ? "root-rule-row" : ""
          }`}
        >
          <Col sm={12} className="bg-slate-200 flex gap-10 justify-center">
            <span
              className="btn btn-secondary fw-bold mt-0 w-auto"
              onClick={() => addNewPersonaRule(rules.id)}
            >
              + Rule
            </span>
            &nbsp;
            <span
              className="btn btn-primary fw-bold mt-0 w-auto"
              onClick={() => addNewGroup(rules.id, rules.operator)}
            >
              + GROUP
            </span>{" "}
            &nbsp;
            <ButtonGroup className="w-auto">
              {personaGroups.map((radio, idx) => (
                <ToggleButton
                  key={rules.id + idx}
                  id={`radio-${rules.id + idx}`}
                  type="radio"
                  variant="outline-primary"
                  name={"gtoup-type-" + rules.id}
                  checked={rules.operator == radio.value}
                  value={radio.value}
                  onChange={(e) => changePersonaGroup(rules.id, radio.value)}
                >
                  {radio.name}
                </ToggleButton>
              ))}
            </ButtonGroup>
            <FeatherIcon
              icon="trash-2"
              className={`mt-auto mx-3 ${
                !rules.isRoot ? "text-danger" : "text-muted"
              }`}
              onClick={() => removePersonaGroup(rules.id)}
            ></FeatherIcon>
          </Col>
          <Col sm={12} className="px-3 pr-0">
            {rules.rules?.length > 0 &&
              rules.rules.map((rule, rIndex) => personaRulesComp(rule))}
          </Col>
        </Row>
      </>
    );
  };

  const personaRulesComp = (rules) => {
    // logger.log("personaRulesComp rules", rules);----------->I am
    //logger.log("personaRulesComp props.properties", props.properties);
    //logger.log("personaRulesComp props.comparators", props.comparators);
    //logger.log("personaRulesComp rules", rules);
    return rules.type === "group" ? (
      <Col key={"rule-modal-" + rules.id} sm={12} className="px-0">
        {personaModalComp(rules)}
      </Col>
    ) : (
      <Row key={"rule-" + rules.id} className="my-0 rule-row w-100">
        <div data-typename="" className="rule-badge">
          &nbsp;
        </div>
        <Col sm={4} lg={4} md={4}>
          {/* <Select
            options={processRuleChoices(props.properties)}
            placeholder="Property"
            name="property"
            isSearchable
            defaultValue={
              props.defaultValue && rules.property !== ""
                ? processDefaultPropertyValue(props.properties, rules.property)
                : ""
            }
            onChange={(e) =>
              onChangePersonaRules(rules.id, "property", e.value)
            }
          /> */}
        </Col>
        <Col sm={3} lg={3} md={3}>
          {/* <Select
            options={processChoices(
              getFilteredApplicableComparator(rules.property),
              "Comparator"
            )}
            placeholder="Comparator"
            name="comparator"
            defaultValue={
              rules.comparator != ""
                ? processDefaultValue(
                    getFilteredApplicableComparator(rules.property),
                    rules.comparator
                  )
                : ""
            }
            value={
              rules.comparator != ""
                ? processDefaultValue(
                    getFilteredApplicableComparator(rules.property),
                    rules.comparator
                  )
                : ""
            }
            onChange={(e) =>
              onChangePersonaRules(rules.id, "comparator", e.value)
            }
          /> */}
        </Col>
        <Col sm={4} lg={4} md={4}>
          {checkPropertyValueChoices(rules.property) ? (
            // <Select
            //   options={processChoices(
            //     checkPropertyValueChoices(rules.property),
            //     "value"
            //   )}
            //   placeholder="Value"
            //   isSearchable
            //   input
            //   name="value"
            //   defaultValue={
            //     props.defaultValue && rules.value !== ""
            //       ? processDefaultValue(
            //           checkPropertyValueChoices(rules.property),
            //           rules.value
            //         )
            //       : ""
            //   }
            //   onChange={(e) => onChangePersonaRules(rules.id, "value", e.value)}
            // />
            <CreatableSelect
              className="input-creatable-select"
              isClearable
              options={processChoices(
                checkPropertyValueChoices(rules.property),
                "value"
              )}
              name="value"
              defaultValue={
                props.defaultValue && rules.value !== ""
                  ? processDefaultValue(
                      checkPropertyValueChoices(rules.property),
                      rules.value
                    )
                  : ""
              }
              onChange={(e) =>
                onChangePersonaRules(rules.id, "value", e?.value)
              }
            />
          ) : (
            <Form.Control
              type={rules.valueField?.type}
              name="value"
              placeholder="Value"
              value={getRulesValue(rules.value, rules.comparator)}
              onChange={(e) =>
                onChangePersonaRules(rules.id, "value", e.target.value)
              }
            />
          )}
        </Col>
        <Col
          sm={1}
          lg={1}
          md={1}
          className="d-flex align-items-center justify-content-center"
        >
          <FeatherIcon
            icon="trash-2"
            className="text-danger float-end -mt-6"
            onClick={() => removePersonaRules(rules.id)}
          ></FeatherIcon>
        </Col>
      </Row>
    );
  };

  return (
    <>
      <hr></hr>
      <p className="ms-1 mb-1 text-muted">{props?.label || "Rules"}</p>
      {personaModalComp(personaRules)}
      <hr></hr>
    </>
  );
};

export default HumanicRules;
