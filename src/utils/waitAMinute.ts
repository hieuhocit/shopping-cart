export default function waitAMinute() {
  return new Promise((resolve) => {
    setTimeout(resolve, 600);
  });
}