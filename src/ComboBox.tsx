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
        estimatedHeadingHeight: 26,
        padding: 4,
        collator,
      }),
    [collator]
  );

  useEffect(() => {
    if (!layout.virtualizer) return;
    layout.virtualizer.reloadData();
  }, [state.collection]);

  return (
    <div className="inline-flex flex-col">
      <label {...labelProps}>{label}</label>
      <div className="relative inline-block">
        <input
          className="border-l-2 border-b-2 border-t-2"
          {...inputProps}
          ref={inputRef}
        />
        <button
          className="px-1 bg-blue-400 border-2"
          {...buttonProps}
          ref={triggerRef}
        >
          Open
        </button>
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
        className="bg-gray-300 absolute w-full"
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
