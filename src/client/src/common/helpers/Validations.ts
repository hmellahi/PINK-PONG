export function isValidInput(input: string): boolean {
  /*
    Usernames can only have:
    - Letters (a-z/ A-Z)
    - Numbers (0-9)
    - 8 characters min
  */
  let inputRegex = /^[a-zA-Z0-9]{8,}$/;
  const res = inputRegex.exec(input);
  return !!res;
}
