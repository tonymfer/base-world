export default function isMobile() {
  if (typeof window !== 'undefined') {
    return /iPhone|iPod|Android/i.test(window.navigator.userAgent);
  }
  return false;
}

export function isTablet() {
  if (typeof window !== 'undefined') {
    return /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(
      window.navigator.userAgent
    );
  }
  return false;
}
