export default function htmlElement({ d, mobile }) {
  // Constants for configuration
  const fontSize = mobile ? 8 : 20;
  const length = Math.min(Math.sqrt(d.casts) * 3, 15);
  const maxFontSize = mobile ? 43 : 70;
  const id = `${d.countryName}-div`;

  // Check for an existing element or create a new one
  const existingElement = document.getElementById(id);
  const visibleEl = existingElement
    ? existingElement
    : createNewElement(id, d.countryName);

  // Style the element
  styleElement(visibleEl, length, fontSize, maxFontSize, d);

  // Append the styled element to a new div and return
  const containerDiv = document.createElement("div");
  containerDiv.appendChild(visibleEl);
  return containerDiv;
}

function createNewElement(id, innerHTML) {
  const newElement = document.createElement("div");
  newElement.id = id;
  newElement.innerHTML = innerHTML;
  newElement.classList.add("city-label");
  return newElement;
}

function styleElement(element, length, fontSize, maxFontSize, d) {
  const computedFontSize = `${Math.min(
    parseInt(Math.sqrt(d.casts) * fontSize),
    maxFontSize
  )}px`;

  element.style.transform = `translate(-50%, ${length * -1}px)`;
  element.style.textTransform = "uppercase";
  element.style.whiteSpace = "nowrap";
  element.style.fontSize = computedFontSize;
  element.style.fontWeight = "500";
  element.style.lineHeight = "1";
  element.style.position = "absolute";
  element.style.bottom = "0";
  element.style.left = "0";
  element.style.color = "#000";
  element.style.backgroundColor = "rgba(255, 255, 255, 1)";
  element.style.padding = "5px 10px";
  element.style.borderRadius = "5px";
  element.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.2)";
  element.style.zIndex = "1";
  element.style.display = "inline-block";
  // element.style.textShadow = "2px 4px 3px #000";
  element.style.transition = "transform 0.5s ease-out";
}
