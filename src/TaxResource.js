import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import "./TaxResourceForm.css";
import { RiSearchLine } from "react-icons/ri";
const validationSchema = Yup.object().shape({
  textField: Yup.string().required("Text field is required"),
  numberField: Yup.string().required("Number field is required"),
});

const initialValues = {
  textField: "",
  numberField: "",
  selectedCheckbox: "",
  specificItems: [],
};

const itemOptions = [
  { label: "Bracelets", value: "item1" },
  { label: "Janothn Bracelets", value: "item2" },
  { label: "Inspire Bracelets", value: "item3" },
  { label: "Zero amount with questions", value: "item4" },
  { label: "Normal item", value: "item5" },
  { label: "Janothn Bracelets", value: "item6" },
];

const MyForm = () => {
  const [numSelectedItems, setNumSelectedItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const handleCheckboxChange = (fieldName, setFieldValue, newValue) => {
    setFieldValue(fieldName, newValue);
    if (newValue === "Apply to specific items") {
      setNumSelectedItems(0);
    } else if (newValue === "Apply to all items") {
      setNumSelectedItems(itemOptions.length);
      const allItemValues = itemOptions.map((item) => item.value);
      setFieldValue("specificItems", allItemValues);
    }
  };

  const handleSpecificItemCheckboxChange = (specificItems) => {
    setNumSelectedItems(specificItems.length);
  };

  const handleSubmit = (values) => {
    const rate = values.numberField / 100; // Convert to percentage
    console.log("Form values:", { ...values, rate });
  };

  const filteredItems = itemOptions.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="form-container">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, setFieldValue, values }) => (
          <Form className="form">
            <h3>Add tax</h3>
            <div className="forms">
              <div className="form-field">
                <label htmlFor="textField">Text Field:</label>
                <Field type="text" id="textField" name="textField" />
                {errors.textField && touched.textField && (
                  <div className="error">{errors.textField}</div>
                )}
              </div>
              <div className="form-field">
                <label htmlFor="numberField">Number Field (%):</label>
                <Field
                  type="number"
                  id="numberField"
                  name="numberField"
                  placeholder="%"
                />
                {errors.numberField && touched.numberField && (
                  <div className="error">{errors.numberField}</div>
                )}
              </div>
            </div>
            <div className="checkbox-container">
              <label className="checkbox-label">
                <Field
                  type="checkbox"
                  name="selectedCheckbox"
                  value="Apply to all items"
                  checked={values.selectedCheckbox === "Apply to all items"}
                  onChange={() =>
                    handleCheckboxChange(
                      "selectedCheckbox",
                      setFieldValue,
                      "Apply to all items"
                    )
                  }
                />
                Apply to all items
              </label>
              <label className="checkbox-label">
                <Field
                  type="checkbox"
                  name="selectedCheckbox"
                  value="Apply to specific items"
                  checked={
                    values.selectedCheckbox === "Apply to specific items"
                  }
                  onChange={() => {
                    handleCheckboxChange(
                      "selectedCheckbox",
                      setFieldValue,
                      "Apply to specific items"
                    );
                  }}
                />
                Apply to specific items
              </label>
            </div>
            {values.selectedCheckbox === "Apply to specific items" && (
              <div className="specific-items">
                <h4>Select specific items:</h4>
                <div className="search-bar">
                  <input
                    type="text"
                    placeholder="Search specific items"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <RiSearchLine className="search-icon" />
                </div>
                {filteredItems.map((item) => (
                  <label key={item.value} className="checkbox-label">
                    <Field
                      type="checkbox"
                      name="specificItems"
                      value={item.value}
                      checked={values.specificItems.includes(item.value)}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        const newSpecificItems = values.specificItems.includes(
                          newValue
                        )
                          ? values.specificItems.filter(
                              (item) => item !== newValue
                            )
                          : [...values.specificItems, newValue];
                        handleSpecificItemCheckboxChange(newSpecificItems);
                        setFieldValue("specificItems", newSpecificItems);
                      }}
                    />
                    {item.label}
                  </label>
                ))}
              </div>
            )}
            <div className="submit-button-container">
              <button type="submit" className="submit-button">
                Apply tax to {numSelectedItems} item
                {numSelectedItems !== 1 && "s"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default MyForm;
