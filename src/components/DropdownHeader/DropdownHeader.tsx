import React from "react";
import styles from "./DropdownHeader.module.css";
import { TOption } from "../../utils/types";

type DropdownHeaderProps = {
  selectedOptions: TOption[];
  placeholder: string;
  isMultiSelect: boolean;
  isOpen: boolean;
  onToggle: () => void;
  style?: React.CSSProperties;
  className?: string;
};

const DropdownHeader: React.FC<DropdownHeaderProps> = ({
  selectedOptions,
  placeholder,
  isMultiSelect,
  isOpen,
  onToggle,
  style,
  className,
}) => {
  // Render the text displayed in the header based on the selected options.
  const renderSelectionText = () => {
    if (selectedOptions.length === 0) {
      return <span className={styles.placeholder}>{placeholder}</span>;
    }
    if (isMultiSelect && selectedOptions.length > 3) {
      const displayed = selectedOptions.slice(0, 3).map((o) => o.label);
      const remaining = selectedOptions.length - 3;
      return `${displayed.join(", ")} + ${remaining} more`;
    }
    return selectedOptions.map((o) => o.label).join(", ");
  };

  return (
    <div
      className={className ?? styles.dropdownHeader}
      style={style}
      onClick={onToggle}
    >
      {renderSelectionText()}
      <span className={styles.dropdownArrow}>{isOpen ? "▲" : "▼"}</span>
    </div>
  );
};

export default DropdownHeader;
