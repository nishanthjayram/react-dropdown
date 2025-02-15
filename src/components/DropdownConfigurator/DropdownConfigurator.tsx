import React, { useState } from "react";
import styles from "./DropdownConfigurator.module.css";
import { TOption } from "../../utils/types";
import Dropdown from "../Dropdown/Dropdown";
import { VIRTUALIZATION_THRESHOLD } from "../../utils/constants";

const Info = () => (
  <div className={styles.infoDialog}>
    <p>
      This configurator allows you to customize the behavior of the dropdown
      component.
    </p>
    <ul>
      <li>
        <strong>Multi-select:</strong> Toggle to allow multiple selections.
      </li>
      <li>
        <strong>Controlled:</strong> Toggle to control the selection state
        externally.
      </li>
      <li>
        <strong>Option Count:</strong> Specify the number of options to display
        in the dropdown. The component will run virtualization for{" "}
        {VIRTUALIZATION_THRESHOLD}+ entries.
      </li>
    </ul>
  </div>
);

const DropdownConfigurator: React.FC = () => {
  const [multiSelect, setMultiSelect] = useState<boolean>(false);
  const [controlled, setControlled] = useState<boolean>(true);
  const [optionCount, setOptionCount] = useState<number>(5);

  // Controlled selection state: for multi-select, an array; for single-select, an Option or null.
  const [selected, setSelected] = useState<TOption | TOption[] | null>(
    multiSelect ? [] : null
  );

  const [shouldVirtualize, setShouldVirtualize] = useState<boolean>(false);

  // Generate sample options based on the current optionCount.
  const sampleOptions: TOption[] = Array.from(
    { length: optionCount },
    (_, i) => ({
      label: `Option ${i + 1}`,
      value: `option${i + 1}`,
    })
  );

  const handleDropdownChange = (newSelection: TOption | TOption[] | null) =>
    setSelected(newSelection);

  // Create a props object for controlled usage.
  const controlledProps = {
    selected: controlled ? selected ?? undefined : undefined,
  };

  const handleOptionCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    // If the input is not a number, do nothing.
    if (isNaN(value)) return;
    // Clamp the value between 1 and 1000.
    const clamped = Math.min(1000, Math.max(1, value));
    setOptionCount(clamped);
    setShouldVirtualize(clamped >= VIRTUALIZATION_THRESHOLD); // Enable virtualization for large option counts.
  };

  return (
    <div className={styles.container}>
      <Info />
      <div className={styles.configPanel}>
        <div className={styles.configItem}>
          <label>
            <input
              type="checkbox"
              checked={multiSelect}
              onChange={(e) => {
                const value = e.target.checked;
                setMultiSelect(value);
                // Reset selection when toggling between single and multi.
                setSelected(value ? [] : null);
              }}
            />{" "}
            Multi-select
          </label>
        </div>

        <div className={styles.configItem}>
          <label>
            <input
              type="checkbox"
              checked={controlled}
              onChange={(e) => setControlled(e.target.checked)}
            />{" "}
            Controlled
          </label>
        </div>

        <div className={styles.configItem}>
          <label htmlFor="optionCount">Option Count</label>
          <input
            id="optionCount"
            type="text"
            value={optionCount}
            onChange={handleOptionCountChange}
            placeholder="Enter a number"
          />
        </div>
      </div>

      <div className={styles.dropdownWrapper}>
        <Dropdown
          options={sampleOptions}
          multiSelect={multiSelect}
          onChange={handleDropdownChange}
          placeholder="Select one or more options..."
          virtualize={shouldVirtualize}
          {...controlledProps}
        />
      </div>

      <div className={styles.selectionDisplay}>
        <strong>Current Selection:</strong>{" "}
        {controlled
          ? multiSelect
            ? Array.isArray(selected) && selected.length > 0
              ? selected
                  .slice(0, 3)
                  .map((o) => o.label)
                  .join(", ") + (selected.length > 3 ? ", ..." : "")
              : "None"
            : (selected as TOption)?.label || "None"
          : "Uncontrolled"}
      </div>

      <div className={styles.selectionDisplay}>
        <strong>Virtualized:</strong> {shouldVirtualize ? "✅" : "❌"}
      </div>
    </div>
  );
};

export default DropdownConfigurator;
