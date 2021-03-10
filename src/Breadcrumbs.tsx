import React from "react";
import { useBreadcrumbs, useBreadcrumbItem } from "@react-aria/breadcrumbs";
import { AriaBreadcrumbsProps } from "@react-types/breadcrumbs";
import cn from "classnames";

export function Breadcrumbs(props: AriaBreadcrumbsProps) {
  let { navProps } = useBreadcrumbs(props);
  let children = React.Children.toArray(props.children);

  return (
    <nav {...navProps}>
      <ol style={{ display: "flex", listStyle: "none", margin: 0, padding: 0 }}>
        {children.map((child, i) =>
          React.cloneElement(child, { isCurrent: i === children.length - 1 })
        )}
      </ol>
    </nav>
  );
}

export function BreadcrumbItem(props) {
  let ref = React.useRef();
  let { itemProps } = useBreadcrumbItem({ ...props, elementType: "span" }, ref);
  return (
    <li>
      <span
        {...itemProps}
        ref={ref}
        className={cn(
          props.isCurrent
            ? "font-bold cursor-default text-blue-800"
            : "underline cursor-pointer"
        )}
      >
        {props.children}
      </span>
      {!props.isCurrent && (
        <span aria-hidden="true" className="px-1">
          {"›"}
        </span>
      )}
    </li>
  );
}
