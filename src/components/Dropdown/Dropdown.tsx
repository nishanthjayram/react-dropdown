import React, { useState, useRef, useEffect, useMemo, RefObject } from "react";
import { CONTAINER_HEIGHT, ITEM_HEIGHT } from "../../utils/constants";
import { TOption } from "../../utils/types";
import { useVirtualization } from "../../utils/useVirtualization";
import DropdownHeader from "../DropdownHeader/DropdownHeader";
import OptionRow from "../OptionRow/OptionRow";
import styles from "./Dropdown.module.css";
import useMeasure from "../../utils/useMeasure";

type TDropdownProps = {
  options: TOption[]; // Array of options to display.
  multiSelect?: boolean; // Whether multiple options can be selected.
  selected?: TOption | TOption[]; // Selected option(s) in controlled mode.
  onChange: (selected: TOption | TOption[] | null) => void; // Callback for selection change.
  placeholder?: string; // Optional placeholder text when no option is selected.
  virtualize?: boolean; // Flag to virtualize the list.
  style?: React.CSSProperties; // Optional style object for the dropdown.
  className?: string; // Optional class name for the dropdown.
};

const Dropdown: React.FC<TDropdownProps> = ({
  options,
  multiSelect = false,
  selected,
  onChange,
  placeholder = "Select...",
  virtualize = true,
  style,
  className,
}) => {
  // Manage open state and internal selection (for uncontrolled usage)
  const [isOpen, setIsOpen] = useState(false);
  const [internalSelected, setInternalSelected] = useState<TOption[]>([]);

  // State to defer parent's update until after render (for controlled usage)
  const [pendingSelection, setPendingSelection] = useState<TOption[] | null>(
    null
  );

  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for the dropdown container
  const scrollContainerRef = useRef<HTMLDivElement>(null); // Ref for the scroll container (which we measure)
  const dummyItemRef = useRef<HTMLDivElement>(null); // Dummy ref to measure an option row's height

  // Use controlled state if provided; otherwise use internal state.
  const currentSelection = useMemo(() => {
    return selected !== undefined
      ? Array.isArray(selected)
        ? selected
        : [selected]
      : internalSelected;
  }, [selected, internalSelected]);

  // Dynamically measure container and item heights.
  const { height: measuredContainerHeight } = useMeasure(
    scrollContainerRef as RefObject<HTMLElement>
  );
  const { height: measuredItemHeight } = useMeasure(
    dummyItemRef as RefObject<HTMLElement>
  );

  // Use measured heights or defaults.
  const containerHeight = measuredContainerHeight || CONTAINER_HEIGHT;
  const itemHeight = measuredItemHeight || ITEM_HEIGHT;

  const totalItems = options.length;
  const {
    visibleIndices,
    onScroll: virtualOnScroll,
    shouldVirtualize,
    setScrollTop,
  } = useVirtualization(totalItems, virtualize, containerHeight, itemHeight);

  // Close dropdown when clicking outside.
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset scroll position when the dropdown is opened.
  useEffect(() => {
    if (isOpen && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
      setScrollTop(0);
    }
  }, [isOpen, setScrollTop]);

  // Whenever pendingSelection changes (and is non-null), call the parent's onChange.
  useEffect(() => {
    if (pendingSelection !== null) {
      onChange(multiSelect ? pendingSelection : pendingSelection[0] || null);
      setPendingSelection(null);
    }
  }, [pendingSelection, multiSelect, onChange]);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // Centralized click handler for an option.
  const handleOptionClick = (option: TOption) => {
    const updateSelection = (selection: TOption[]): TOption[] => {
      if (multiSelect) {
        return selection.some((item) => item.value === option.value)
          ? selection.filter((item) => item.value !== option.value)
          : [...selection, option];
      }
      setIsOpen(false);
      return [option];
    };

    if (selected !== undefined) {
      // Controlled mode
      const newSelection = updateSelection(currentSelection);
      setPendingSelection(newSelection);
    } else {
      // Uncontrolled mode
      setInternalSelected((prevSelection) => {
        const newSelection = updateSelection(prevSelection);
        setPendingSelection(newSelection);
        return newSelection;
      });
    }
  };

  // "Select All" handler for multi-select.
  const handleSelectAll = () => {
    if (currentSelection.length === options.length) {
      if (selected === undefined) setInternalSelected([]);
      setPendingSelection([]);
    } else {
      if (selected === undefined) setInternalSelected([...options]);
      setPendingSelection([...options]);
    }
  };

  // Determine the top offset for options if multiselect is enabled.
  const topOffset = multiSelect ? itemHeight : 0;

  // Prepare list content based on virtualization.
  const listContent = shouldVirtualize ? (
    <div
      className={styles.dropdownList}
      style={{
        height: `${totalItems * itemHeight}px`,
        position: "relative",
      }}
    >
      {visibleIndices.map((index) => {
        const top = index * itemHeight;
        const option = options[index];
        const isSelected = currentSelection.some(
          (item) => item.value === option.value
        );
        return (
          <OptionRow
            key={option.value}
            top={top}
            option={option}
            isSelected={isSelected}
            multiSelect={multiSelect}
            onOptionClick={handleOptionClick}
            virtualize={true}
          />
        );
      })}
    </div>
  ) : (
    options.map((option) => {
      const isSelected = currentSelection.some(
        (item) => item.value === option.value
      );
      return (
        <OptionRow
          key={option.value}
          top={0}
          option={option}
          isSelected={isSelected}
          multiSelect={multiSelect}
          onOptionClick={handleOptionClick}
          virtualize={false}
        />
      );
    })
  );

  // Define the list container style.
  const listContainerStyle = shouldVirtualize
    ? { height: `${containerHeight}px`, paddingTop: topOffset }
    : { paddingTop: topOffset };

  return (
    <div
      className={className ?? styles.dropdown}
      style={style}
      ref={dropdownRef}
    >
      <DropdownHeader
        selectedOptions={[...currentSelection].sort((a, b) =>
          a.value.localeCompare(b.value)
        )}
        placeholder={placeholder}
        isMultiSelect={multiSelect}
        isOpen={isOpen}
        onToggle={toggleDropdown}
      />
      {isOpen && (
        <div className={styles.dropdownMenu}>
          {multiSelect && (
            <div
              key="select-all"
              className={`${styles.dropdownOption} ${styles.selectAll} ${styles.frozen}`}
              onClick={handleSelectAll}
            >
              {currentSelection.length === options.length
                ? "Deselect All"
                : "Select All"}
            </div>
          )}
          <div
            className={styles.dropdownListContainer}
            style={listContainerStyle}
            onScroll={shouldVirtualize ? virtualOnScroll : undefined}
            ref={scrollContainerRef}
          >
            {listContent}
          </div>
        </div>
      )}
      {/*
        Off-screen dummy item for measuring option row height.
      */}
      <div
        ref={dummyItemRef}
        className={styles.dropdownOption}
        style={{ visibility: "hidden", position: "absolute" }}
      >
        Dummy
      </div>
    </div>
  );
};

export default Dropdown;
