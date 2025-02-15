# React Dropdown

This project demonstrates a fully-featured, customizable dropdown component built using React and TypeScript. The dropdown supports both controlled and uncontrolled usage, single-select and multi-select modes, and uses dynamic measurements with virtualization for performance when dealing with many options. In addition, the project includes a **DropdownConfigurator** component that lets you interactively change settings (like multi-select, controlled mode, and option count) and see how the dropdown behaves.

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Components](#components)
  - [Dropdown](#dropdown)
  - [DropdownHeader](#dropdownheader)
  - [OptionRow](#optionrow)
  - [DropdownConfigurator](#dropdownconfigurator)
- [Utility Functions](#utility-functions)
  - [useMeasure](#usemeasure)
  - [useVirtualization](#usevirtualization)
  - [constants & types](#constants--types)
- [Usage](#usage)
- [Running the Project](#running-the-project)

## Overview

This dropdown component library is designed for flexibility and performance:

- **Controlled vs. Uncontrolled Mode:**  
  In controlled mode, the parent component manages the dropdown’s selection state. In uncontrolled mode, the dropdown manages its own state internally.
- **Single-Select and Multi-Select:**  
  The dropdown can be used to select a single option or multiple options. In multi-select mode, a "Select All" option is provided.
- **Dynamic Measurements & Virtualization:**  
  The component uses a custom `useMeasure` hook to measure the container and option row heights and passes those values to a `useVirtualization` hook so that only visible options are rendered. This is particularly useful for large lists.
- **DropdownConfigurator:**  
  An interactive component that allows you to toggle between multi-select and controlled modes, and specify the number of options (from 1 to 1000). When the option count is above `VIRTUALIZATION_THRESHOLD` (see `src/utils/constants`) or more, virtualization is enabled automatically.

## Project Structure

```
/src
  /components
    /Dropdown
      Dropdown.tsx
      Dropdown.module.css
    /DropdownHeader
      DropdownHeader.tsx
      DropdownHeader.module.css
    /OptionRow
      OptionRow.tsx
      OptionRow.module.css
    /DropdownConfigurator
      DropdownConfigurator.tsx
      DropdownConfigurator.module.css
  /utils
    constants.ts
    types.ts
    useMeasure.ts
    useVirtualization.ts
  App.tsx
  index.tsx
README.md
package.json
```

## Components

### Dropdown

- **File:** `src/components/Dropdown/Dropdown.tsx`
- **Description:**  
  The main dropdown component renders a header (via `DropdownHeader`) and a list of options (using `OptionRow`). It supports dynamic sizing via `useMeasure` and only renders visible options with `useVirtualization`. It also handles both controlled and uncontrolled selection modes as well as multi-select (with a "Select All" option).
- **Key Props:**
  - `options`: Array of options (`TOption[]`).
  - `multiSelect` (optional): If true, enables multi-select mode.
  - `selected` (optional): For controlled usage, the current selection.
  - `onChange`: Callback function called when selection changes.
  - `placeholder`: Text displayed when no option is selected.
  - `virtualize` (optional): If true, enables virtualization; typically set dynamically based on the number of options.

### DropdownHeader

- **File:** `src/components/Dropdown/DropdownHeader/DropdownHeader.tsx`
- **Description:**  
  Displays the current selection or a placeholder when nothing is selected. It also shows an arrow indicating whether the dropdown is open or closed and toggles the menu on click.
- **Key Props:**
  - `selectedOptions`: Array of currently selected options.
  - `placeholder`: Placeholder text.
  - `isMultiSelect`: Indicates if multi-select mode is enabled.
  - `isOpen`: Indicates if the dropdown is open.
  - `onToggle`: Function that toggles the dropdown open/closed.

### OptionRow

- **File:** `src/components/Dropdown/OptionRow/OptionRow.tsx`
- **Description:**  
  Renders an individual option row. In multi-select mode, it displays a readOnly checkbox alongside the option label. The entire row is clickable and its click event is handled centrally to toggle selection.
- **Key Props:**
  - `top`: Vertical offset (in pixels) where the row should be rendered (used for virtualization).
  - `option`: The option data (`TOption`).
  - `isSelected`: Boolean indicating if the option is selected.
  - `multiSelect`: If true, renders the checkbox.
  - `onOptionClick`: Function called when the option is clicked.

### DropdownConfigurator

- **File:** `src/components/DropdownConfigurator/DropdownConfigurator.tsx`
- **Description:**  
  An interactive configurator for the dropdown component. It lets you toggle between multi-select and controlled modes, and specify the number of options via a standard text input. Virtualization is automatically enabled when the option count is 100 (default value of `VIRTUALIZATION_THRESHOLD`) or more.
- **Key Features:**
  - A brief info dialog explaining the configuration options.
  - Checkboxes for toggling multi-select and controlled modes.
  - A text input for setting the number of options (1 to 1000).
  - Displays the current selection and whether virtualization is active.
  - Renders the `Dropdown` component with the chosen configuration.

## Utility Functions

### useMeasure

- **File:** `src/utils/useMeasure.ts`
- **Description:**  
  A custom hook that uses a ResizeObserver to measure a DOM element’s dimensions (width and height). This is used by the Dropdown component to dynamically compute the available container height and the height of an option row.

### useVirtualization

- **File:** `src/utils/useVirtualization.ts`
- **Description:**  
  Computes which option indices should be rendered based on the container’s height and an item’s height. It returns the visible indices, an onScroll handler, and a flag indicating whether virtualization should be applied.

### constants & types

- **File:** `src/utils/constants.ts`  
  Contains fallback constants such as:
  ```ts
  export const CONTAINER_HEIGHT = 200;
  export const ITEM_HEIGHT = 36;
  ```
- **File:** `src/utils/types.ts`  
  Contains type definitions, for example:
  ```ts
  export type TOption = {
    label: string;
    value: string;
  };
  ```

## Usage

You can use the Dropdown component in controlled or uncontrolled mode. Here are two examples:

**Controlled Single-Select Example:**

```tsx
const [selectedOption, setSelectedOption] = useState<TOption | null>(null);

<Dropdown
  options={sampleOptions}
  selected={selectedOption}
  onChange={(value) => setSelectedOption(value as TOption | null)}
  placeholder="Select an option..."
/>;
```

**Uncontrolled Multi-Select Example:**

```tsx
<Dropdown
  options={sampleOptions}
  multiSelect
  onChange={(value) => console.log("New selection:", value)}
  placeholder="Select options..."
/>
```

**DropdownConfigurator Usage:**

The **DropdownConfigurator** component wraps the Dropdown and provides interactive controls. It lets you:

- Toggle **Multi-select** mode.
- Toggle **Controlled** mode.
- Specify the **Option Count** (from 1 to 1000).  
  When the option count exceeds 100, virtualization is automatically enabled. The configurator displays the current selection and whether virtualization is active.

## Running the Project

1. **Clone the Repository:**

   ```bash
   git clone git@github.com:nishanthjayram/react-dropdown.git
   cd react-dropdown
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Start the Development Server:**

   ```bash
   npm run dev
   ```

   This will start the app (typically on [http://localhost:5173](http://localhost:5173)) and open it in your default browser.
