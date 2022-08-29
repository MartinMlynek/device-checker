import { useState } from "react";
import { createPortal } from "react-dom";

import styles from "./Select.module.css";
interface SelectProps {
  options: string[];
  value: string;

  setValue: (value: string) => void;
  title: string;
  hasLabel: boolean;
  inFormProps?: inForm;
}

interface inForm {
  hasError: boolean;
  errorMessage: string;
  inputBlurHandler: () => void;
  inputClasses: string;
}

const Select = ({
  options,
  value,
  title,

  setValue,

  hasLabel,
  inFormProps,
}: SelectProps) => {
  const [isSelectOpen, setIsSelectOpen] = useState<boolean>(false);
  const isFilter = inFormProps === undefined;
  const toggleSelect = () => {
    if (isSelectOpen) {
      if (inFormProps) {
        inFormProps.inputBlurHandler();
      }
      setIsSelectOpen(false);
    } else {
      setIsSelectOpen(true);
    }
  };

  let optionsWithNoFIlter = [...options];
  if (isFilter) {
    optionsWithNoFIlter.unshift("Nezáleží");
  }

  const setSelectedThenCloseDropdown = (index: number) => {
    setValue(optionsWithNoFIlter[index]);
    setIsSelectOpen(false);
  };

  return (
    <div
      className={`${styles.container} ${
        inFormProps ? inFormProps.inputClasses : "form-control"
      } ${isSelectOpen ? styles.containerOpen : ""}`}
      tabIndex={0}
    >
      {hasLabel && (
        <label className={styles.label} htmlFor={`${title}-select`}>
          {title}
        </label>
      )}
      <button
        id={`${title}-select`}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isSelectOpen}
        className={
          isSelectOpen ? `${styles.button} ${styles.expanded}` : styles.button
        }
        onClick={toggleSelect}
        tabIndex={0}
      >
        {value}
      </button>
      <ul
        className={`${styles.options} ${isSelectOpen ? styles.show : ""}`}
        role="listbox"
        aria-activedescendant={value}
        tabIndex={1}
      >
        {optionsWithNoFIlter.map((option, index) => (
          <li
            key={`${option}-${index}`}
            id={`${option}-${index}`}
            role="option"
            aria-selected={option === value}
            tabIndex={0}
            onClick={() => {
              setSelectedThenCloseDropdown(index);
            }}
          >
            {option}
          </li>
        ))}
      </ul>
      {isSelectOpen
        ? createPortal(
            <div className={styles.invisible} onClick={toggleSelect}></div>,
            document.getElementById("backdrop-root")!
          )
        : null}

      {inFormProps && inFormProps.hasError && (
        <p className="error-text">{inFormProps.errorMessage}</p>
      )}
    </div>
  );
};

export default Select;
