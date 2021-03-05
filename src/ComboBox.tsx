import React, { MutableRefObject, useRef, useMemo, useEffect } from "react";
import { Node } from "@react-types/shared";
import { mergeProps } from "@react-aria/utils";
import { useButton } from "@react-aria/button";
import { ComboBoxState, useComboBoxState } from "@react-stately/combobox";
import { useFilter, useCollator, Filter } from "@react-aria/i18n";
import { useListBox, useOption } from "@react-aria/listbox";
import { useOverlay, DismissButton } from "@react-aria/overlays";
import { useComboBox, AriaComboBoxProps } from "@react-aria/combobox";
import { Item } from "@react-stately/collections";
import { Virtualizer, VirtualizerItem } from "@react-aria/virtualizer";
import { ReusableView, Rect } from "@react-stately/virtualizer";
import { ListLayout } from "@react-stately/layout";

export { Item } from "@react-stately/collections";

type Children = JSX.Element | JSX.Element[];
type ComboBoxProps = {
  label?: string;
  children: Children;
};

export function ComboBox({ label, children }: ComboBoxProps) {
  const filter = useFilter({ sensitivity: "base" });

  const state = useComboBoxState({
    defaultFilter: filter.contains,
    children,
  });

  const triggerRef = useRef(null);
  const inputRef = useRef(null);
  const listBoxRef = useRef(null);
  const popoverRef = useRef(null);
  const virtualizerRef = useRef(null);

  const {
    buttonProps: triggerProps,
    inputProps,
    listBoxProps,
    labelProps,
  } = useComboBox(
    {
      children,
      inputRef,
      buttonRef: triggerRef,
      listBoxRef,
      popoverRef,
      menuTrigger: "input",
    },
    state
  );

  const { buttonProps } = useButton(triggerProps, triggerRef);

  const collator = useCollator({ usage: "search", sensitivity: "base" });
  const layout = useMemo(
    () =>
      new ListLayout<Node<object>>({
        estimatedRowHeight: 32,
        estimatedHeadingHeight: 24,
        collator,
      }),
    [collator]
  );

  useEffect(() => {
    if (!layout.virtualizer) return;
    layout.virtualizer.reloadData();
  }, [state.collection.size]);

  return (
    <div className="inline-flex flex-col">
      <label {...labelProps}>{label}</label>
      <div className="relative inline-block">
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            className="border-2 p-1 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-3 pr-12 sm:text-sm border-gray-300 rounded-md"
            {...inputProps}
            ref={inputRef}
          />
          <button
            className="absolute inset-y-0 right-0 flex items-center pr-2"
            {...buttonProps}
            ref={triggerRef}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 0 20 24"
              width="24px"
              fill="currentColor"
            >
              <path d="M24 24H0V0h24v24z" fill="none" opacity=".87" />
              <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z" />
            </svg>
          </button>
        </div>
        {state.isOpen && (
          <ListBoxPopup
            layout={layout}
            shouldUseVirtualFocus
            listBoxRef={listBoxRef}
            popoverRef={popoverRef}
            virtualizerRef={virtualizerRef}
            state={state}
          />
        )}
      </div>
    </div>
  );
}

type ListBoxPopupProps = {
  popoverRef: MutableRefObject<null>;
  listBoxRef: MutableRefObject<null>;
  virtualizerRef: MutableRefObject<null>;
  state: ComboBoxState<object>;
  shouldUseVirtualFocus: boolean;
  layout: ListLayout<Node<object>>;
};

function ListBoxPopup({
  popoverRef,
  listBoxRef,
  virtualizerRef,
  state,
  shouldUseVirtualFocus,
  layout,
}: ListBoxPopupProps) {
  const { listBoxProps } = useListBox(
    {
      autoFocus: state.focusStrategy,
      disallowEmptySelection: true,
      isVirtualized: true,
      keyboardDelegate: layout,
    },
    state,
    listBoxRef
  );

  const { overlayProps } = useOverlay(
    {
      onClose: () => state.close(),
      shouldCloseOnBlur: true,
      isOpen: state.isOpen,
      isDismissable: true,
    },
    popoverRef
  );

  return (
    <div {...overlayProps} ref={popoverRef}>
      <ul
        className="shadow-md bg-gray-100 pl-2 absolute w-full"
        {...listBoxProps}
        ref={listBoxRef}
      >
        <Virtualizer
          collection={state.collection}
          layout={layout}
          ref={virtualizerRef}
          sizeToFit="height"
          scrollDirection="vertical"
          className="h-48"
        >
          {(type, item) => {
            if (type !== "item") return;
            return (
              <Option
                shouldUseVirtualFocus
                key={item.key}
                item={item}
                state={state}
              />
            );
          }}
        </Virtualizer>
      </ul>
    </div>
  );
}

type OptionProps = {
  item: Node<object>;
  state: ComboBoxState<object>;
  shouldUseVirtualFocus: boolean;
};

function Option({ item, state, shouldUseVirtualFocus }: OptionProps) {
  let ref = useRef(null);
  let isDisabled = state.disabledKeys.has(item.key);
  let isSelected = state.selectionManager.isSelected(item.key);
  let isFocused = state.selectionManager.focusedKey === item.key;

  let { optionProps } = useOption(
    {
      key: item.key,
      isDisabled,
      isSelected,
      shouldSelectOnPressUp: true,
      shouldFocusOnHover: true,
      shouldUseVirtualFocus,
    },
    state,
    ref
  );

  let backgroundColor;
  let color = "black";

  return (
    <li {...optionProps} ref={ref}>
      {item.rendered}
    </li>
  );
}
