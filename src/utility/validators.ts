const isNotEmpty = (value: string) => value.trim() !== "";
const isEmail = (value: string) => value.includes("@");
const isNotTitle = (title: string) => (value: string) => {
  return title !== value;
};
export { isEmail, isNotEmpty, isNotTitle };
