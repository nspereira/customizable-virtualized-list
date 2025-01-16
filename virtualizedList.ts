interface VirtualizedListProps<T> {
  data: T[]; // The list of items to render
  itemHeight?: number; // Fixed height of each item in pixels (optional for dynamic height)
  height: number; // Height of the viewport/container in pixels
  renderItem: (item: T, index: number) => HTMLElement; // Function to render an item
  className?: string; // Custom CSS class for the container
  styles?: Partial<CSSStyleDeclaration>; // Custom inline styles for the container
  dynamicHeight?: (item: T, index: number) => number; // Function to calculate dynamic height for each item
}

class VirtualizedList<T> {
  private container: HTMLElement;
  private props: VirtualizedListProps<T>;
  private startIndex: number;
  private endIndex: number;
  private itemPositions: number[]; // Tracks item positions for dynamic heights

  constructor(container: HTMLElement, props: VirtualizedListProps<T>) {
    this.container = container;
    this.props = props;
    this.startIndex = 0;
    this.endIndex = Math.ceil(props.height / (props.itemHeight || 50));
    this.itemPositions = this.calculateItemPositions();

    this.init();
  }

  private init() {
    const { className, styles } = this.props;

    // Set container styles
    this.container.style.position = "relative";
    this.container.style.overflowY = "auto";
    this.container.style.height = `${this.props.height}px`;

    // Apply custom class if provided
    if (className) {
      this.container.className = className;
    }

    // Apply custom styles if provided
    if (styles) {
      Object.assign(this.container.style, styles);
    }

    // Add scroll listener
    this.container.addEventListener("scroll", this.handleScroll.bind(this));

    // Render initial items
    this.render();
  }

  private calculateItemPositions(): number[] {
    const { data, itemHeight, dynamicHeight } = this.props;
    const positions: number[] = [];
    let currentPosition = 0;

    data.forEach((item, index) => {
      positions.push(currentPosition);
      currentPosition += dynamicHeight
        ? dynamicHeight(item, index)
        : itemHeight || 50;
    });

    return positions;
  }

  private handleScroll() {
    const scrollTop = this.container.scrollTop;

    const newStartIndex = this.findStartIndex(scrollTop);
    const newEndIndex = this.findEndIndex(scrollTop + this.props.height);

    if (newStartIndex !== this.startIndex || newEndIndex !== this.endIndex) {
      this.startIndex = newStartIndex;
      this.endIndex = newEndIndex;
      this.render();
    }
  }

  private findStartIndex(scrollTop: number): number {
    return this.itemPositions.findIndex((pos) => pos >= scrollTop);
  }

  private findEndIndex(scrollBottom: number): number {
    for (let i = this.startIndex; i < this.itemPositions.length; i++) {
      if (this.itemPositions[i] >= scrollBottom) {
        return i;
      }
    }
    return this.props.data.length - 1;
  }

  private render() {
    const { data, renderItem, dynamicHeight } = this.props;

    // Clear container
    this.container.innerHTML = "";

    // Add top spacer
    const topSpacer = document.createElement("div");
    topSpacer.style.height = `${this.itemPositions[this.startIndex]}px`;
    this.container.appendChild(topSpacer);

    // Render visible items
    const visibleData = data.slice(
      this.startIndex,
      Math.min(this.endIndex + 1, data.length)
    );

    visibleData.forEach((item, index) => {
      const actualIndex = this.startIndex + index;
      const renderedItem = renderItem(item, actualIndex);
      renderedItem.style.position = "absolute";
      renderedItem.style.top = `${this.itemPositions[actualIndex]}px`;
      renderedItem.style.width = "100%";

      if (dynamicHeight) {
        const height = dynamicHeight(item, actualIndex);
        renderedItem.style.height = `${height}px`;
      }

      this.container.appendChild(renderedItem);
    });

    // Add bottom spacer
    const bottomSpacer = document.createElement("div");
    const totalHeight =
      this.itemPositions[this.itemPositions.length - 1] +
      (dynamicHeight
        ? dynamicHeight(data[data.length - 1], data.length - 1)
        : this.props.itemHeight || 50);
    const bottomHeight =
      totalHeight -
      this.itemPositions[Math.min(this.endIndex, data.length - 1)];
    bottomSpacer.style.height = `${bottomHeight}px`;
    this.container.appendChild(bottomSpacer);
  }
}

export default VirtualizedList;
