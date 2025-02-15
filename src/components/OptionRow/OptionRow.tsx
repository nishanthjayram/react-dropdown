import React from "react";
import styles from "./OptionRow.module.css";
import { TOption } from "../../utils/types";

type OptionRowProps = {
  top: number;
  option: TOption;
  isSelected: boolean;
  multiSelect: boolean;
  onOptionClick: (option: TOption) => void;
  virtualize?: boolean;
  style?: React.CSSProperties;
  className?: string;
};

const OptionRow: React.FC<OptionRowProps> = ({
  top,
  option,
  isSelected,
  multiSelect,
  onOptionClick,
  virtualize = false,
  style,
  className,
}) => {
  const handleClick = (
    e: React.MouseEvent | React.ChangeEvent<HTMLInputElement>
  ) => {
    // Prevent event propagation so we don't get duplicate events.
    e.stopPropagation();
    onOptionClick(option);
  };

  // If virtualizing, apply absolute positioning.
  const finalStyle: React.CSSProperties = virtualize
    ? { ...style, top: `${top}px`, position: "absolute", width: "100%" }
    : { ...style };

  return (
    <div
      className={
        className ?? `${styles.optionRow} ${isSelected ? styles.selected : ""}`
      }
      style={finalStyle}
      onClick={handleClick}
    >
      {multiSelect ? (
        <label className={styles.checkboxLabel}>
          <input type="checkbox" checked={isSelected} readOnly />
          <span className={styles.labelText}>{option.label}</span>
        </label>
      ) : (
        <div className={styles.labelText}>{option.label}</div>
      )}
    </div>
  );
};

export default OptionRow;
