# Virtualized List

A lightweight and customizable virtualized list implementation in TypeScript designed for handling large datasets efficiently. This library renders only the visible items in the viewport, ensuring smooth scrolling and optimal performance even for datasets with millions or billions of items.

# Features

-Virtualization: Renders only visible items, keeping the DOM lightweight.
-Dynamic Heights: Supports items with variable heights via a custom height calculation function.
-Custom Item Rendering: Provides flexibility to render each item with custom HTML or components.
-Theming and Styles: Easily apply custom CSS classes and inline styles to the container.
-Compatibility: Works with vanilla JavaScript, React, and Angular via wrapper integrations.
-Scalability: Designed to handle very large datasets efficiently.

# Installation

Currently, this library is not available on NPM. To use it, clone this repository and include the VirtualizedList.ts file in your project.

# Clone the repository
git clone https://github.com/nspereira/virtualized-list.git

# Usage

Vanilla JavaScript Example
´´´javascript
<div id="list-container"></div>
<script type="module">
  import VirtualizedList from "./VirtualizedList.js";

  const data = Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    name: `Item ${i + 1}`,
    size: 30 + (i % 5) * 10, // Dynamic height between 30px to 70px
  }));

  const container = document.getElementById("list-container");

  new VirtualizedList(container, {
    data,
    height: 400, // Height of the container in pixels
    dynamicHeight: (item) => item.size,
    renderItem: (item) => {
      const div = document.createElement("div");
      div.textContent = item.name;
      div.style.border = "1px solid #ddd";
      div.style.backgroundColor = "#f9f9f9";
      div.style.textAlign = "center";
      return div;
    },
    className: "custom-list-container",
    styles: {
      backgroundColor: "#ffffff",
      border: "1px solid #ccc",
    },
  });
</script>
´´´
React Example
´´´javascript
import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import VirtualizedList from "./VirtualizedList";

const data = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  name: `Item ${i + 1}`,
  size: 30 + (i % 5) * 10,
}));

const ReactVirtualizedList = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      new VirtualizedList(containerRef.current, {
        data,
        height: 400,
        dynamicHeight: (item) => item.size,
        renderItem: (item) => {
          const div = document.createElement("div");
          div.textContent = item.name;
          div.style.border = "1px solid #ddd";
          div.style.backgroundColor = "#f9f9f9";
          div.style.textAlign = "center";
          return div;
        },
      });
    }
  }, []);

  return <div ref={containerRef} />;
};

export default ReactVirtualizedList;
´´´


